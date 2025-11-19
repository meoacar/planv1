import { db as prisma } from '@/lib/db';
import { redis, rateLimit } from '@/lib/redis';
import type { Prisma } from '@prisma/client';
import { addXP, addCoins, awardBadge } from './gamification.service';
import { addAIResponseJob } from '@/lib/queue';
import { notifyAdmins } from '@/lib/notifications';
import {
  getFeedCache,
  setFeedCache,
  clearFeedCache,
  getPopularCache,
  setPopularCache,
  clearPopularCache,
  getStatsCache,
  setStatsCache,
  clearStatsCache,
  getUserConfessionsCache,
  setUserConfessionsCache,
  clearUserConfessionsCache,
  getDailyLimitCache,
  incrementDailyLimitCache,
} from '@/lib/cache';

// Prisma types
type ConfessionCategory = 'night_attack' | 'special_occasion' | 'stress_eating' | 'social_pressure' | 'no_regrets' | 'seasonal';
type ConfessionStatus = 'pending' | 'published' | 'rejected' | 'hidden';

// ====================================================
// TYPES & INTERFACES
// ====================================================

export interface CreateConfessionInput {
  userId: string;
  content: string;
  category?: ConfessionCategory;
}

export interface ConfessionFilters {
  category?: ConfessionCategory;
  isPopular?: boolean;
  userId?: string;
  status?: ConfessionStatus;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string; // Cursor-based pagination için
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  nextCursor?: string;
  hasMore: boolean;
}

export interface ConfessionStats {
  totalConfessions: number;
  categoryBreakdown: Record<ConfessionCategory, number>;
  averageEmpathy: number;
  popularCount: number;
}

// ====================================================
// VALIDATION CONSTANTS
// ====================================================

const MIN_CONTENT_LENGTH = 10;
const MAX_CONTENT_LENGTH = 500;
const DAILY_CONFESSION_LIMIT = 3;
const SPAM_WINDOW_SECONDS = 300; // 5 dakika
const SPAM_MAX_REQUESTS = 2;

// Yasaklı kelimeler (basit örnek)
const BANNED_WORDS = [
  'spam',
  'reklam',
  'satılık',
  // Daha fazla eklenebilir
];

// ====================================================
// CORE CONFESSION FUNCTIONS
// ====================================================

/**
 * Yeni itiraf oluşturur
 */
export async function createConfession(input: CreateConfessionInput) {
  const { userId, content, category } = input;

  // 1. Input validation
  if (!content || content.trim().length < MIN_CONTENT_LENGTH) {
    throw new Error(`İtiraf en az ${MIN_CONTENT_LENGTH} karakter olmalı`);
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    throw new Error(`İtiraf en fazla ${MAX_CONTENT_LENGTH} karakter olabilir`);
  }

  // 2. Günlük limit kontrolü
  const canPost = await checkDailyLimit(userId);
  if (!canPost) {
    throw new Error('Günlük itiraf limitine ulaştınız (3/3)');
  }

  // 3. Spam kontrolü
  const isSpam = await checkSpam(userId, content);
  if (isSpam) {
    throw new Error('Spam tespit edildi, lütfen daha sonra tekrar deneyin');
  }

  // 4. Uygunsuz içerik kontrolü
  const isInappropriate = checkInappropriateContent(content);
  if (isInappropriate) {
    throw new Error('İçerik uygunsuz bulundu');
  }

  // 5. Kategori otomatik tespiti (eğer verilmemişse)
  const detectedCategory = category || detectCategory(content);

  // 6. Gece savaşçısı kontrolü (23:00-06:00)
  const isNightTime = isNightConfession();

  // 7. İtirafı oluştur
  const confession = await prisma.confession.create({
    data: {
      userId,
      content: content.trim(),
      category: detectedCategory,
      status: 'pending' as ConfessionStatus, // AI yanıtı bekliyor
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // 8. AI yanıt üretimi için queue'ya ekle
  try {
    await addAIResponseJob({
      confessionId: confession.id,
      content: confession.content,
      category: detectedCategory,
      userId,
    });
    console.log(`✓ AI response job added to queue for confession ${confession.id}`);
  } catch (error) {
    console.error('Failed to add AI response job to queue:', error);
    // Queue başarısız olursa direkt fallback yanıt kullan
    // Bu durumda confession pending kalır, admin manuel onaylayabilir
  }

  // 9. XP ve Coin ödülü ver
  await addXP(userId, 10, 'İtiraf paylaştın');
  await addCoins(userId, 5, 'quest_reward', 'İtiraf paylaştın');

  // 10. Badge kontrolü
  await checkAndAwardBadges(userId, isNightTime);

  // 11. Günlük limit cache'i güncelle
  await incrementDailyConfessionCount(userId);

  // 12. Cache invalidation (yeni itiraf eklendiğinde feed cache'i temizle)
  await clearFeedCache();
  await clearStatsCache();
  await clearUserConfessionsCache(userId);

  // 13. Admin'lere bildirim gönder
  await notifyAdmins({
    type: 'confession_pending',
    title: 'Yeni İtiraf Onay Bekliyor',
    message: `${confession.user.name || confession.user.username} tarafından yeni bir itiraf paylaşıldı`,
    link: `/admin/confessions`,
    metadata: {
      confessionId: confession.id,
      userId,
      category: detectedCategory,
    }
  })

  return confession;
}

/**
 * İtirafları listeler (feed)
 */
export async function getConfessions(
  filters: ConfessionFilters = {},
  pagination: PaginationParams = {}
) {
  const { category, isPopular, userId, status = 'published' as ConfessionStatus } = filters;
  const { page = 1, limit = 20 } = pagination;

  // Kullanıcıya özel sorgular cache'lenmez
  if (!userId) {
    // Cache kontrolü
    const cached = await getFeedCache(category, isPopular, page, limit);
    if (cached) {
      console.log('✓ Feed served from cache');
      return cached;
    }
  }

  const skip = (page - 1) * limit;

  // Where clause oluştur
  const where: Prisma.ConfessionWhereInput = {
    status,
    ...(category && { category }),
    ...(isPopular !== undefined && { isPopular }),
    ...(userId && { userId }),
  };

  // Toplam sayı ve itirafları al (optimized - sadece gerekli alanlar)
  const [confessions, total] = await Promise.all([
    prisma.confession.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        category: true,
        aiResponse: true,
        aiTone: true,
        telafiBudget: true,
        empathyCount: true,
        status: true,
        isPopular: true,
        createdAt: true,
        publishedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            empathies: true,
            reports: true,
          },
        },
      },
    }),
    prisma.confession.count({ where }),
  ]);

  const result = {
    items: confessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    hasMore: skip + confessions.length < total,
  };

  // Cache'e kaydet (kullanıcıya özel değilse)
  if (!userId) {
    await setFeedCache(result, category, isPopular, page, limit);
  }

  return result;
}

/**
 * Tekil itiraf getirir
 */
export async function getConfessionById(id: string) {
  const confession = await prisma.confession.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          empathies: true,
          reports: true,
        },
      },
    },
  });

  if (!confession) {
    throw new Error('İtiraf bulunamadı');
  }

  return confession;
}

/**
 * Kullanıcının günlük itiraf limitini kontrol eder
 */
export async function checkDailyLimit(userId: string): Promise<boolean> {
  try {
    // Cache'den kontrol et
    const cachedCount = await getDailyLimitCache(userId);
    
    if (cachedCount !== null) {
      return cachedCount < DAILY_CONFESSION_LIMIT;
    }
  } catch (error) {
    console.error('Redis error in checkDailyLimit:', error);
  }

  // Redis yoksa veritabanından kontrol et
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.confession.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  return count < DAILY_CONFESSION_LIMIT;
}

/**
 * Kullanıcının günlük itiraf sayısını artırır
 */
async function incrementDailyConfessionCount(userId: string): Promise<void> {
  try {
    await incrementDailyLimitCache(userId);
  } catch (error) {
    console.error('Redis error in incrementDailyConfessionCount:', error);
  }
}

// ====================================================
// HELPER FUNCTIONS
// ====================================================

/**
 * Spam kontrolü yapar
 */
async function checkSpam(userId: string, content: string): Promise<boolean> {
  // Rate limiting kontrolü
  const rateLimitKey = `confession:spam:${userId}`;
  const { success } = await rateLimit(rateLimitKey, SPAM_MAX_REQUESTS, SPAM_WINDOW_SECONDS);

  if (!success) {
    return true; // Spam tespit edildi
  }

  // Aynı içerik kontrolü (son 1 saat)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const duplicateContent = await prisma.confession.findFirst({
    where: {
      userId,
      content,
      createdAt: { gte: oneHourAgo },
    },
  });

  return !!duplicateContent;
}

/**
 * Uygunsuz içerik kontrolü
 */
function checkInappropriateContent(content: string): boolean {
  const lowerContent = content.toLowerCase();

  // Yasaklı kelime kontrolü
  for (const word of BANNED_WORDS) {
    if (lowerContent.includes(word)) {
      return true;
    }
  }

  // URL kontrolü
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  if (urlPattern.test(content)) {
    return true;
  }

  return false;
}

/**
 * İçerikten kategori tespit eder
 */
function detectCategory(content: string): ConfessionCategory {
  const lowerContent = content.toLowerCase();

  // Gece saldırıları
  if (
    lowerContent.includes('gece') ||
    lowerContent.includes('uyuyamadım') ||
    lowerContent.includes('uykudan')
  ) {
    return 'night_attack';
  }

  // Özel gün
  if (
    lowerContent.includes('doğum günü') ||
    lowerContent.includes('düğün') ||
    lowerContent.includes('bayram') ||
    lowerContent.includes('yılbaşı')
  ) {
    return 'special_occasion';
  }

  // Stres yeme
  if (
    lowerContent.includes('stres') ||
    lowerContent.includes('sinir') ||
    lowerContent.includes('üzgün')
  ) {
    return 'stress_eating';
  }

  // Sosyal baskı
  if (
    lowerContent.includes('arkadaş') ||
    lowerContent.includes('aile') ||
    lowerContent.includes('zorladı')
  ) {
    return 'social_pressure';
  }

  // Pişman değilim
  if (
    lowerContent.includes('pişman değilim') ||
    lowerContent.includes('değdi') ||
    lowerContent.includes('harika')
  ) {
    return 'no_regrets';
  }

  // Default: stress_eating
  return 'stress_eating';
}

/**
 * Gece saatinde mi kontrol eder (23:00-06:00)
 */
function isNightConfession(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 23 || hour < 6;
}

/**
 * Badge kontrolü ve ödüllendirme
 */
async function checkAndAwardBadges(userId: string, isNightTime: boolean): Promise<void> {
  // İlk itiraf rozetini kontrol et
  const confessionCount = await prisma.confession.count({
    where: { userId },
  });

  if (confessionCount === 1) {
    await awardBadge(userId, 'confession_first');
  }

  // İtiraf ustası (10 itiraf)
  if (confessionCount === 10) {
    await awardBadge(userId, 'confession_master');
  }

  // Gece savaşçısı
  if (isNightTime) {
    await awardBadge(userId, 'night_warrior');
  }
}

// ====================================================
// EMPATHY FUNCTIONS
// ====================================================

/**
 * İtirafa empati ekler
 */
export async function addEmpathy(confessionId: string, userId: string) {
  // 1. İtirafın var olduğunu kontrol et
  const confession = await prisma.confession.findUnique({
    where: { id: confessionId },
  });

  if (!confession) {
    throw new Error('İtiraf bulunamadı');
  }

  // 2. Duplicate kontrolü
  const existing = await prisma.confessionEmpathy.findUnique({
    where: {
      confessionId_userId: {
        confessionId,
        userId,
      },
    },
  });

  if (existing) {
    throw new Error('Bu itirafa zaten empati gösterdiniz');
  }

  // 3. Empati kaydı oluştur ve empathyCount artır
  const [empathy] = await prisma.$transaction([
    prisma.confessionEmpathy.create({
      data: {
        confessionId,
        userId,
      },
    }),
    prisma.confession.update({
      where: { id: confessionId },
      data: {
        empathyCount: { increment: 1 },
      },
    }),
  ]);

  // 4. XP ödülü ver
  await addXP(userId, 2, 'Empati gösterdin');

  // 5. Badge kontrolü (50 empati = Empati Kahramanı)
  await checkEmpathyBadge(userId);

  // 6. Popüler itiraf kontrolü (100+ empati)
  await checkPopularConfession(confessionId);

  // 7. Güncellenmiş empathy count'u al
  const updatedConfession = await prisma.confession.findUnique({
    where: { id: confessionId },
    select: { empathyCount: true },
  });

  // 8. Cache invalidation (empati değiştiğinde)
  await clearFeedCache();
  await clearPopularCache();
  await clearStatsCache();

  return {
    empathy,
    empathyCount: updatedConfession?.empathyCount || 0,
  };
}

/**
 * İtiraftan empatiyi kaldırır
 */
export async function removeEmpathy(confessionId: string, userId: string) {
  // 1. Empati kaydını bul
  const empathy = await prisma.confessionEmpathy.findUnique({
    where: {
      confessionId_userId: {
        confessionId,
        userId,
      },
    },
  });

  if (!empathy) {
    throw new Error('Empati kaydı bulunamadı');
  }

  // 2. Empati kaydını sil ve empathyCount azalt
  await prisma.$transaction([
    prisma.confessionEmpathy.delete({
      where: { id: empathy.id },
    }),
    prisma.confession.update({
      where: { id: confessionId },
      data: {
        empathyCount: { decrement: 1 },
      },
    }),
  ]);

  // 3. Güncellenmiş empathy count'u al
  const updatedConfession = await prisma.confession.findUnique({
    where: { id: confessionId },
    select: { empathyCount: true },
  });

  // 4. Cache invalidation
  await clearFeedCache();
  await clearPopularCache();
  await clearStatsCache();

  return {
    empathyCount: updatedConfession?.empathyCount || 0,
  };
}

/**
 * Empati badge kontrolü
 */
async function checkEmpathyBadge(userId: string): Promise<void> {
  const empathyCount = await prisma.confessionEmpathy.count({
    where: { userId },
  });

  if (empathyCount === 50) {
    await awardBadge(userId, 'empathy_hero');
  }
}

/**
 * Popüler itiraf kontrolü (100+ empati)
 */
async function checkPopularConfession(confessionId: string): Promise<void> {
  const confession = await prisma.confession.findUnique({
    where: { id: confessionId },
    select: { empathyCount: true, isPopular: true, userId: true },
  });

  if (!confession) return;

  // 100+ empati ve henüz popüler değilse
  if (confession.empathyCount >= 100 && !confession.isPopular) {
    await prisma.confession.update({
      where: { id: confessionId },
      data: { isPopular: true },
    });

    // İtiraf sahibine badge ver
    await awardBadge(confession.userId, 'popular_confession');
  }
}

// ====================================================
// REPORT FUNCTIONS
// ====================================================

/**
 * İtirafı raporlar
 */
export async function reportConfession(
  confessionId: string,
  userId: string,
  reason: string
) {
  // 1. İtirafın var olduğunu kontrol et
  const confession = await prisma.confession.findUnique({
    where: { id: confessionId },
  });

  if (!confession) {
    throw new Error('İtiraf bulunamadı');
  }

  // 2. Duplicate kontrolü
  const existing = await prisma.confessionReport.findUnique({
    where: {
      confessionId_userId: {
        confessionId,
        userId,
      },
    },
  });

  if (existing) {
    throw new Error('Bu itirafı zaten raporladınız');
  }

  // 3. Rapor kaydı oluştur
  const report = await prisma.confessionReport.create({
    data: {
      confessionId,
      userId,
      reason,
    },
  });

  // 4. Rapor eşiği kontrolü (5+ rapor = otomatik gizle)
  await checkReportThreshold(confessionId);

  return report;
}

/**
 * Rapor eşiği kontrolü (5+ rapor = otomatik gizle)
 */
export async function checkReportThreshold(confessionId: string): Promise<void> {
  const reportCount = await prisma.confessionReport.count({
    where: { confessionId },
  });

  // 5 veya daha fazla rapor varsa otomatik gizle
  if (reportCount >= 5) {
    const confession = await prisma.confession.findUnique({
      where: { id: confessionId },
      select: { status: true },
    });

    // Sadece published durumundaysa gizle
    if (confession?.status === 'published') {
      await prisma.confession.update({
        where: { id: confessionId },
        data: {
          status: 'hidden' as ConfessionStatus,
          rejectionReason: `Otomatik gizlendi: ${reportCount} rapor alındı`,
        },
      });
    }
  }
}

// ====================================================
// STATISTICS & HELPER FUNCTIONS
// ====================================================

/**
 * Popüler itirafları günceller (cron job için)
 */
export async function updatePopularConfessions(): Promise<void> {
  // 100+ empati alan ama henüz popüler olmayan itirafları bul
  const confessions = await prisma.confession.findMany({
    where: {
      empathyCount: { gte: 100 },
      isPopular: false,
      status: 'published' as ConfessionStatus,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  // Her birini popüler yap ve badge ver
  for (const confession of confessions) {
    await prisma.confession.update({
      where: { id: confession.id },
      data: { isPopular: true },
    });

    // İtiraf sahibine badge ver
    try {
      await awardBadge(confession.userId, 'popular_confession');
    } catch (error) {
      // Badge zaten verilmişse hata verme
      console.log(`Badge already awarded to user ${confession.userId}`);
    }
  }

  console.log(`✓ ${confessions.length} itiraf popüler olarak işaretlendi`);
}

/**
 * İtiraf istatistiklerini getirir
 */
export async function getConfessionStats(): Promise<ConfessionStats> {
  try {
    // Cache kontrolü
    const cached = await getStatsCache<ConfessionStats>();
    if (cached) {
      console.log('✓ Stats served from cache');
      return cached;
    }
  } catch (error) {
    console.error('Redis error in getConfessionStats:', error);
  }

  // Toplam itiraf sayısı
  const totalConfessions = await prisma.confession.count({
    where: { status: 'published' as ConfessionStatus },
  });

  // Kategori dağılımı
  const categoryGroups = await prisma.confession.groupBy({
    by: ['category'],
    where: { status: 'published' as ConfessionStatus },
    _count: true,
  });

  const categoryBreakdown = categoryGroups.reduce(
    (acc: Record<string, number>, group: any) => {
      acc[group.category] = group._count;
      return acc;
    },
    {} as Record<ConfessionCategory, number>
  );

  // Ortalama empati sayısı
  const avgResult = await prisma.confession.aggregate({
    where: { status: 'published' as ConfessionStatus },
    _avg: {
      empathyCount: true,
    },
  });

  const averageEmpathy = avgResult._avg.empathyCount || 0;

  // Popüler itiraf sayısı
  const popularCount = await prisma.confession.count({
    where: {
      status: 'published' as ConfessionStatus,
      isPopular: true,
    },
  });

  const stats: ConfessionStats = {
    totalConfessions,
    categoryBreakdown,
    averageEmpathy,
    popularCount,
  };

  // Cache'e kaydet
  try {
    await setStatsCache(stats);
  } catch (error) {
    console.error('Redis error in getConfessionStats cache:', error);
  }

  return stats;
}

/**
 * Kullanıcının kendi itiraflarını getirir
 */
export async function getUserConfessions(
  userId: string,
  pagination: PaginationParams = {}
) {
  const { page = 1, limit = 20 } = pagination;

  try {
    // Cache kontrolü
    const cached = await getUserConfessionsCache(userId, page, limit);
    if (cached) {
      console.log('✓ User confessions served from cache');
      return cached;
    }
  } catch (error) {
    console.error('Redis error in getUserConfessions:', error);
  }

  const skip = (page - 1) * limit;

  const [confessions, total] = await Promise.all([
    prisma.confession.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        category: true,
        aiResponse: true,
        aiTone: true,
        telafiBudget: true,
        empathyCount: true,
        status: true,
        isPopular: true,
        createdAt: true,
        publishedAt: true,
        rejectionReason: true,
        _count: {
          select: {
            empathies: true,
            reports: true,
          },
        },
      },
    }),
    prisma.confession.count({ where: { userId } }),
  ]);

  const result = {
    items: confessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    hasMore: skip + confessions.length < total,
  };

  // Cache'e kaydet
  try {
    await setUserConfessionsCache(userId, result, page, limit);
  } catch (error) {
    console.error('Redis error in getUserConfessions cache:', error);
  }

  return result;
}

/**
 * Kullanıcının itiraf istatistiklerini getirir
 */
export async function getUserConfessionStats(userId: string) {
  const [totalConfessions, totalEmpathyReceived, mostPopular] = await Promise.all([
    // Toplam itiraf sayısı
    prisma.confession.count({
      where: { userId },
    }),

    // Toplam alınan empati
    prisma.confession.aggregate({
      where: { userId },
      _sum: {
        empathyCount: true,
      },
    }),

    // En popüler itiraf
    prisma.confession.findFirst({
      where: { userId },
      orderBy: { empathyCount: 'desc' },
      select: {
        id: true,
        content: true,
        empathyCount: true,
        category: true,
      },
    }),
  ]);

  return {
    totalConfessions,
    totalEmpathyReceived: totalEmpathyReceived._sum.empathyCount || 0,
    mostPopular,
  };
}

/**
 * İtirafları listeler (cursor-based pagination ile - daha performanslı)
 */
export async function getConfessionsCursor(
  filters: ConfessionFilters = {},
  pagination: PaginationParams = {}
) {
  const { category, isPopular, userId, status = 'published' as ConfessionStatus } = filters;
  const { cursor, limit = 20 } = pagination;

  // Where clause oluştur
  const where: Prisma.ConfessionWhereInput = {
    status,
    ...(category && { category }),
    ...(isPopular !== undefined && { isPopular }),
    ...(userId && { userId }),
  };

  // Cursor-based query
  const confessions = await prisma.confession.findMany({
    where,
    take: limit + 1, // Bir fazla al (hasMore kontrolü için)
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1, // Cursor'ı atla
    }),
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      content: true,
      category: true,
      aiResponse: true,
      aiTone: true,
      telafiBudget: true,
      empathyCount: true,
      status: true,
      isPopular: true,
      createdAt: true,
      publishedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          empathies: true,
          reports: true,
        },
      },
    },
  });

  // hasMore kontrolü
  const hasMore = confessions.length > limit;
  const items = hasMore ? confessions.slice(0, -1) : confessions;
  const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;

  return {
    items,
    nextCursor,
    hasMore,
  };
}

/**
 * Kullanıcının bir itirafa empati gösterip göstermediğini kontrol eder
 */
export async function hasUserEmpathized(
  confessionId: string,
  userId: string
): Promise<boolean> {
  const empathy = await prisma.confessionEmpathy.findUnique({
    where: {
      confessionId_userId: {
        confessionId,
        userId,
      },
    },
  });

  return !!empathy;
}

/**
 * Popüler itirafları getirir (optimized query)
 */
export async function getPopularConfessions(limit: number = 10) {
  try {
    // Cache kontrolü
    const cached = await getPopularCache();
    if (cached) {
      console.log('✓ Popular confessions served from cache');
      return cached;
    }
  } catch (error) {
    console.error('Redis error in getPopularConfessions:', error);
  }

  // Optimized query - sadece gerekli alanları seç
  const confessions = await prisma.confession.findMany({
    where: {
      status: 'published' as ConfessionStatus,
      isPopular: true,
    },
    take: limit,
    orderBy: { empathyCount: 'desc' },
    select: {
      id: true,
      content: true,
      category: true,
      aiResponse: true,
      empathyCount: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          empathies: true,
        },
      },
    },
  });

  // Cache'e kaydet
  try {
    await setPopularCache(confessions);
  } catch (error) {
    console.error('Redis error in getPopularConfessions cache:', error);
  }

  return confessions;
}
