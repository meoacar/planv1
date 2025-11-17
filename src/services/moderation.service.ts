import { db as prisma } from '@/lib/db';
import { redis, rateLimit } from '@/lib/redis';

// ====================================================
// TYPES & INTERFACES
// ====================================================

type ConfessionStatus = 'pending' | 'published' | 'rejected' | 'hidden';

export interface ModerationResult {
  isClean: boolean;
  reason?: string;
  confidence: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  hasMore: boolean;
}

// ====================================================
// MODERATION CONSTANTS
// ====================================================

const SPAM_WINDOW_SECONDS = 300; // 5 dakika
const SPAM_MAX_CONFESSIONS = 2; // 5 dakikada maksimum 2 itiraf
const DUPLICATE_CHECK_HOURS = 1; // Aynı içerik kontrolü için 1 saat
const REPORT_THRESHOLD = 5; // 5+ rapor = otomatik gizle

// Yasaklı kelimeler listesi
const BANNED_WORDS = [
  'spam',
  'reklam',
  'satılık',
  'satış',
  'para kazan',
  'tıkla',
  'link',
  'site',
  'takip et',
  'abone ol',
  // Daha fazla eklenebilir
];

// URL pattern
const URL_PATTERN = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|net|org|io|tr|co)[^\s]*)/gi;

// ====================================================
// OTOMATIK MODERASYON FONKSİYONLARI
// ====================================================

/**
 * Spam kontrolü yapar
 * - 5 dakikada 2'den fazla itiraf yapılamaz
 * - Aynı içerik 1 saat içinde tekrar gönderilemez
 */
export async function checkSpam(userId: string, content: string): Promise<boolean> {
  try {
    // 1. Rate limiting kontrolü (5 dakikada 2 itiraf)
    const rateLimitKey = `confession:spam:${userId}`;
    const { success } = await rateLimit(rateLimitKey, SPAM_MAX_CONFESSIONS, SPAM_WINDOW_SECONDS);

    if (!success) {
      console.log(`[Spam] Rate limit exceeded for user ${userId}`);
      return true; // Spam tespit edildi
    }

    // 2. Aynı içerik kontrolü (son 1 saat)
    const oneHourAgo = new Date(Date.now() - DUPLICATE_CHECK_HOURS * 60 * 60 * 1000);
    const duplicateContent = await prisma.confession.findFirst({
      where: {
        userId,
        content: content.trim(),
        createdAt: { gte: oneHourAgo },
      },
    });

    if (duplicateContent) {
      console.log(`[Spam] Duplicate content detected for user ${userId}`);
      return true; // Aynı içerik tekrar gönderilmiş
    }

    // 3. Çok kısa sürede çok fazla itiraf kontrolü (veritabanı bazlı)
    const recentConfessions = await prisma.confession.count({
      where: {
        userId,
        createdAt: { gte: new Date(Date.now() - SPAM_WINDOW_SECONDS * 1000) },
      },
    });

    if (recentConfessions >= SPAM_MAX_CONFESSIONS) {
      console.log(`[Spam] Too many confessions in short time for user ${userId}`);
      return true;
    }

    return false; // Spam değil
  } catch (error) {
    console.error('Error in checkSpam:', error);
    // Hata durumunda güvenli tarafta kal, spam olarak işaretle
    return true;
  }
}

/**
 * Uygunsuz içerik kontrolü yapar
 * - Yasaklı kelimeler
 * - URL/link tespiti
 * - Çok fazla büyük harf
 * - Tekrarlayan karakterler
 */
export async function checkInappropriate(content: string): Promise<ModerationResult> {
  const lowerContent = content.toLowerCase();
  const reasons: string[] = [];
  let confidence = 0;

  // 1. Yasaklı kelime kontrolü
  for (const word of BANNED_WORDS) {
    if (lowerContent.includes(word)) {
      reasons.push(`Yasaklı kelime tespit edildi: "${word}"`);
      confidence += 0.3;
    }
  }

  // 2. URL/link kontrolü
  const urlMatches = content.match(URL_PATTERN);
  if (urlMatches && urlMatches.length > 0) {
    reasons.push('URL veya link içeriyor');
    confidence += 0.4;
  }

  // 3. Çok fazla büyük harf kontrolü (CAPSLOCK spam)
  const uppercaseCount = (content.match(/[A-ZÇĞİÖŞÜ]/g) || []).length;
  const totalLetters = (content.match(/[a-zA-ZçğıöşüÇĞİÖŞÜ]/g) || []).length;
  if (totalLetters > 10 && uppercaseCount / totalLetters > 0.7) {
    reasons.push('Çok fazla büyük harf kullanımı');
    confidence += 0.2;
  }

  // 4. Tekrarlayan karakter kontrolü (aaaaa, !!!!!, vb.)
  const repeatingPattern = /(.)\1{4,}/g;
  if (repeatingPattern.test(content)) {
    reasons.push('Tekrarlayan karakter spam');
    confidence += 0.2;
  }

  // 5. Çok fazla emoji kontrolü
  const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojiCount = (content.match(emojiPattern) || []).length;
  if (emojiCount > 10) {
    reasons.push('Çok fazla emoji kullanımı');
    confidence += 0.15;
  }

  // Confidence'ı 0-1 arasında sınırla
  confidence = Math.min(confidence, 1);

  const isClean = confidence < 0.5; // 0.5'ten düşükse temiz

  return {
    isClean,
    reason: reasons.length > 0 ? reasons.join(', ') : undefined,
    confidence,
  };
}

/**
 * Kullanıcı geçmişi kontrolü
 * - Daha önce reddedilen itiraf sayısı
 * - Ban durumu
 * - Reputation score
 */
export async function checkUserHistory(userId: string): Promise<boolean> {
  try {
    // 1. Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isBanned: true,
        bannedUntil: true,
        reputationScore: true,
      },
    });

    if (!user) {
      console.log(`[UserHistory] User not found: ${userId}`);
      return false; // Kullanıcı bulunamadı, güvenli tarafta kal
    }

    // 2. Ban kontrolü
    if (user.isBanned) {
      // Geçici ban süresi dolmuş mu kontrol et
      if (user.bannedUntil && user.bannedUntil > new Date()) {
        console.log(`[UserHistory] User is banned until ${user.bannedUntil}`);
        return false; // Hala banlı
      }
    }

    // 3. Reputation score kontrolü (çok düşükse şüpheli)
    if (user.reputationScore < -50) {
      console.log(`[UserHistory] Low reputation score: ${user.reputationScore}`);
      return false; // Düşük reputation
    }

    // 4. Son 7 gündeki reddedilen itiraf sayısı
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const rejectedCount = await prisma.confession.count({
      where: {
        userId,
        status: 'rejected' as ConfessionStatus,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    if (rejectedCount >= 3) {
      console.log(`[UserHistory] Too many rejected confessions: ${rejectedCount}`);
      return false; // Son 7 günde 3+ reddedilmiş itiraf
    }

    return true; // Kullanıcı geçmişi temiz
  } catch (error) {
    console.error('Error in checkUserHistory:', error);
    return true; // Hata durumunda kullanıcıya şans ver
  }
}

/**
 * Otomatik moderasyon kararı verir
 * Tüm kontrolleri birleştirerek nihai kararı verir
 */
export async function autoModerate(
  userId: string,
  content: string
): Promise<{ status: ConfessionStatus; reason?: string }> {
  try {
    // 1. Spam kontrolü
    const isSpam = await checkSpam(userId, content);
    if (isSpam) {
      return {
        status: 'rejected' as ConfessionStatus,
        reason: 'Spam tespit edildi. Lütfen daha sonra tekrar deneyin.',
      };
    }

    // 2. Uygunsuz içerik kontrolü
    const moderationResult = await checkInappropriate(content);
    if (!moderationResult.isClean) {
      return {
        status: 'pending' as ConfessionStatus, // Manuel moderasyona gönder
        reason: `Otomatik moderasyon: ${moderationResult.reason} (Güven: ${(moderationResult.confidence * 100).toFixed(0)}%)`,
      };
    }

    // 3. Kullanıcı geçmişi kontrolü
    const hasGoodHistory = await checkUserHistory(userId);
    if (!hasGoodHistory) {
      return {
        status: 'pending' as ConfessionStatus, // Manuel moderasyona gönder
        reason: 'Kullanıcı geçmişi nedeniyle manuel moderasyona alındı',
      };
    }

    // 4. Tüm kontroller geçildi, otomatik onayla
    return {
      status: 'pending' as ConfessionStatus, // AI yanıtı bekliyor, sonra published olacak
    };
  } catch (error) {
    console.error('Error in autoModerate:', error);
    // Hata durumunda manuel moderasyona gönder
    return {
      status: 'pending' as ConfessionStatus,
      reason: 'Otomatik moderasyon hatası, manuel kontrol gerekiyor',
    };
  }
}

/**
 * Rapor eşiği kontrolü (5+ rapor = otomatik gizle)
 */
export async function checkReportThreshold(confessionId: string): Promise<void> {
  try {
    const reportCount = await prisma.confessionReport.count({
      where: { confessionId },
    });

    // 5 veya daha fazla rapor varsa otomatik gizle
    if (reportCount >= REPORT_THRESHOLD) {
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

        console.log(`[AutoModeration] Confession ${confessionId} hidden due to ${reportCount} reports`);
      }
    }
  } catch (error) {
    console.error('Error in checkReportThreshold:', error);
  }
}

// ====================================================
// HELPER FUNCTIONS
// ====================================================

/**
 * İçeriği temizler ve normalize eder
 */
export function sanitizeContent(content: string): string {
  return content
    .trim()
    .replace(/\s+/g, ' ') // Çoklu boşlukları tek boşluğa çevir
    .replace(/[\r\n]+/g, '\n'); // Çoklu satır sonlarını tek satır sonuna çevir
}

/**
 * Moderasyon istatistiklerini getirir
 */
export async function getModerationStats() {
  try {
    const [
      totalPending,
      totalRejected,
      totalHidden,
      recentReports,
    ] = await Promise.all([
      // Bekleyen itiraflar
      prisma.confession.count({
        where: { status: 'pending' as ConfessionStatus },
      }),

      // Reddedilen itiraflar (son 7 gün)
      prisma.confession.count({
        where: {
          status: 'rejected' as ConfessionStatus,
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),

      // Gizlenen itiraflar
      prisma.confession.count({
        where: { status: 'hidden' as ConfessionStatus },
      }),

      // Son 24 saatteki raporlar
      prisma.confessionReport.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      totalPending,
      totalRejected,
      totalHidden,
      recentReports,
    };
  } catch (error) {
    console.error('Error in getModerationStats:', error);
    return {
      totalPending: 0,
      totalRejected: 0,
      totalHidden: 0,
      recentReports: 0,
    };
  }
}

// ====================================================
// ADMIN MODERASYON FONKSİYONLARI
// ====================================================

/**
 * Moderasyon kuyruğunu getirir (pending itiraflar)
 */
export async function getModerationQueue(
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<any>> {
  const { page = 1, limit = 20 } = pagination;
  const skip = (page - 1) * limit;

  try {
    const [confessions, total] = await Promise.all([
      prisma.confession.findMany({
        where: {
          status: 'pending' as ConfessionStatus,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' }, // En eski önce (FIFO)
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              reputationScore: true,
              isBanned: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },
      }),
      prisma.confession.count({
        where: { status: 'pending' as ConfessionStatus },
      }),
    ]);

    return {
      items: confessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      hasMore: skip + confessions.length < total,
    };
  } catch (error) {
    console.error('Error in getModerationQueue:', error);
    throw new Error('Moderasyon kuyruğu alınamadı');
  }
}

/**
 * İtirafı onaylar (status: published, publishedAt set)
 */
export async function approveConfession(
  confessionId: string,
  adminId: string
): Promise<void> {
  try {
    // 1. İtirafın var olduğunu ve pending durumunda olduğunu kontrol et
    const confession = await prisma.confession.findUnique({
      where: { id: confessionId },
      select: { status: true, userId: true },
    });

    if (!confession) {
      throw new Error('İtiraf bulunamadı');
    }

    if (confession.status !== 'pending') {
      throw new Error('Bu itiraf zaten işleme alınmış');
    }

    // 2. İtirafı onayla
    await prisma.confession.update({
      where: { id: confessionId },
      data: {
        status: 'published' as ConfessionStatus,
        publishedAt: new Date(),
      },
    });

    // 3. Kullanıcıya bildirim gönder (opsiyonel)
    try {
      await prisma.notification.create({
        data: {
          userId: confession.userId,
          type: 'plan_approved', // Genel onay bildirimi kullanıyoruz
          title: 'İtirafın Onaylandı! 🎉',
          body: 'İtirafın moderasyon sürecinden geçti ve yayınlandı. Diğer kullanıcılar artık görebilir.',
          targetType: 'plan', // Confession için özel tip yoksa plan kullanıyoruz
          targetId: confessionId,
        },
      });
    } catch (notifError) {
      console.error('Error sending approval notification:', notifError);
      // Bildirim hatası ana işlemi etkilemesin
    }

    console.log(`[Admin] Confession ${confessionId} approved by admin ${adminId}`);
  } catch (error) {
    console.error('Error in approveConfession:', error);
    throw error;
  }
}

/**
 * İtirafı reddeder (status: rejected, rejectionReason set, kullanıcıya bildirim)
 */
export async function rejectConfession(
  confessionId: string,
  adminId: string,
  reason: string
): Promise<void> {
  try {
    // 1. Reason kontrolü
    if (!reason || reason.trim().length < 10) {
      throw new Error('Reddetme nedeni en az 10 karakter olmalıdır');
    }

    // 2. İtirafın var olduğunu ve pending durumunda olduğunu kontrol et
    const confession = await prisma.confession.findUnique({
      where: { id: confessionId },
      select: { status: true, userId: true },
    });

    if (!confession) {
      throw new Error('İtiraf bulunamadı');
    }

    if (confession.status !== 'pending') {
      throw new Error('Bu itiraf zaten işleme alınmış');
    }

    // 3. İtirafı reddet
    await prisma.confession.update({
      where: { id: confessionId },
      data: {
        status: 'rejected' as ConfessionStatus,
        rejectionReason: reason.trim(),
      },
    });

    // 4. Kullanıcıya bildirim gönder
    try {
      await prisma.notification.create({
        data: {
          userId: confession.userId,
          type: 'plan_rejected', // Genel red bildirimi kullanıyoruz
          title: 'İtirafın Reddedildi',
          body: `İtirafın moderasyon sürecinden geçemedi. Neden: ${reason.trim()}`,
          targetType: 'plan',
          targetId: confessionId,
        },
      });
    } catch (notifError) {
      console.error('Error sending rejection notification:', notifError);
      // Bildirim hatası ana işlemi etkilemesin
    }

    // 5. Kullanıcının reputation score'unu düşür (opsiyonel)
    try {
      await prisma.user.update({
        where: { id: confession.userId },
        data: {
          reputationScore: { decrement: 5 },
        },
      });
    } catch (repError) {
      console.error('Error updating reputation:', repError);
    }

    console.log(`[Admin] Confession ${confessionId} rejected by admin ${adminId}: ${reason}`);
  } catch (error) {
    console.error('Error in rejectConfession:', error);
    throw error;
  }
}

/**
 * Rapor edilen itirafları getirir
 */
export async function getReportedConfessions(
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<any>> {
  const { page = 1, limit = 20 } = pagination;
  const skip = (page - 1) * limit;

  try {
    // Rapor sayısına göre grupla
    const reportedConfessions = await prisma.confessionReport.groupBy({
      by: ['confessionId'],
      _count: {
        confessionId: true,
      },
      orderBy: {
        _count: {
          confessionId: 'desc', // En çok rapor alan önce
        },
      },
      skip,
      take: limit,
    });

    // Her itiraf için detayları al
    const confessionIds = reportedConfessions.map((r) => r.confessionId);
    const confessions = await prisma.confession.findMany({
      where: {
        id: { in: confessionIds },
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
        reports: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Rapor sayısını ekle
    const confessionsWithReportCount = confessions.map((confession) => ({
      ...confession,
      reportCount: reportedConfessions.find((r) => r.confessionId === confession.id)?._count.confessionId || 0,
    }));

    // Rapor sayısına göre sırala
    confessionsWithReportCount.sort((a, b) => b.reportCount - a.reportCount);

    // Toplam rapor edilen itiraf sayısı
    const totalReported = await prisma.confessionReport.groupBy({
      by: ['confessionId'],
    });

    return {
      items: confessionsWithReportCount,
      pagination: {
        page,
        limit,
        total: totalReported.length,
        totalPages: Math.ceil(totalReported.length / limit),
      },
      hasMore: skip + confessionsWithReportCount.length < totalReported.length,
    };
  } catch (error) {
    console.error('Error in getReportedConfessions:', error);
    throw new Error('Rapor edilen itiraflar alınamadı');
  }
}

/**
 * İtirafı gizler/gösterir (toggle)
 */
export async function toggleConfessionVisibility(
  confessionId: string,
  adminId: string
): Promise<{ status: ConfessionStatus }> {
  try {
    const confession = await prisma.confession.findUnique({
      where: { id: confessionId },
      select: { status: true },
    });

    if (!confession) {
      throw new Error('İtiraf bulunamadı');
    }

    // Hidden ise published yap, published ise hidden yap
    const newStatus: ConfessionStatus =
      confession.status === 'hidden' ? 'published' : 'hidden';

    await prisma.confession.update({
      where: { id: confessionId },
      data: {
        status: newStatus,
        ...(newStatus === 'hidden' && {
          rejectionReason: `Admin tarafından gizlendi (${adminId})`,
        }),
        ...(newStatus === 'published' && {
          publishedAt: new Date(),
          rejectionReason: null,
        }),
      },
    });

    console.log(`[Admin] Confession ${confessionId} visibility toggled to ${newStatus} by admin ${adminId}`);

    return { status: newStatus };
  } catch (error) {
    console.error('Error in toggleConfessionVisibility:', error);
    throw error;
  }
}

/**
 * Toplu moderasyon işlemi (bulk approve/reject)
 */
export async function bulkModerateConfessions(
  confessionIds: string[],
  action: 'approve' | 'reject',
  adminId: string,
  reason?: string
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const confessionId of confessionIds) {
    try {
      if (action === 'approve') {
        await approveConfession(confessionId, adminId);
      } else if (action === 'reject') {
        if (!reason) {
          throw new Error('Reddetme nedeni gerekli');
        }
        await rejectConfession(confessionId, adminId, reason);
      }
      success++;
    } catch (error) {
      console.error(`Error in bulk moderation for confession ${confessionId}:`, error);
      failed++;
    }
  }

  console.log(`[Admin] Bulk moderation by ${adminId}: ${success} success, ${failed} failed`);

  return { success, failed };
}
