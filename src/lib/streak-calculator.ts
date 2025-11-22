import prisma from '@/lib/prisma';

/**
 * Kullanıcının mevcut streak'ini hesaplar
 * Streak: Ardışık temiz günler (günah yapılmayan günler)
 */
export async function calculateUserStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  lastCleanDate: Date | null;
  streakBroken: boolean;
}> {
  // Kullanıcının tüm günahlarını tarihe göre sırala
  const sins = await prisma.foodSin.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });

  // Freeze kullanılan günleri al (coinsCost = 0 olanlar freeze)
  const freezeDays = await prisma.streakRecovery.findMany({
    where: {
      userId,
      coinsCost: 0,
    },
    select: { recoveredAt: true },
  });

  const freezeDates = new Set(
    freezeDays.map((freeze) => {
      const date = new Date(freeze.recoveredAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    })
  );

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Günah yapılan günleri set'e ekle (YYYY-MM-DD formatında)
  // Ama freeze kullanılan günleri hariç tut
  const sinDates = new Set(
    sins
      .map((sin) => {
        const date = new Date(sin.createdAt);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      })
      .filter((dateStr) => !freezeDates.has(dateStr)) // Freeze günlerini hariç tut
  );

  // Eğer hiç günah yoksa, streak 0 olmalı (henüz takip başlamamış)
  if (sins.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastCleanDate: null,
      streakBroken: false,
    };
  }

  // İlk günah tarihini bul - streak hesaplaması buradan başlar
  const firstSin = sins[sins.length - 1];
  const firstSinDate = new Date(firstSin.createdAt);
  firstSinDate.setHours(0, 0, 0, 0);

  // Mevcut streak'i hesapla (bugünden geriye doğru)
  let currentStreak = 0;
  let checkDate = new Date(today);
  let lastCleanDate: Date | null = null;

  // Bugün günah yapılmış mı kontrol et
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayHasSin = sinDates.has(todayStr);

  // Eğer bugün günah yapılmışsa, streak sıfır
  if (todayHasSin) {
    currentStreak = 0;
    lastCleanDate = null;
  } else {
    // Bugünden başlayarak geriye doğru temiz günleri say
    // Ama ilk günah tarihinden öncesine gitme
    while (checkDate >= firstSinDate) {
      const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;

      if (sinDates.has(dateStr)) {
        // Günah yapılmış, streak kırıldı
        break;
      }

      currentStreak++;
      
      // İlk temiz gün (en son) bugün olmalı
      if (lastCleanDate === null) {
        lastCleanDate = new Date(checkDate);
      }

      // Bir gün geriye git
      checkDate.setDate(checkDate.getDate() - 1);

      // Maksimum 365 gün kontrol et (performans için)
      if (currentStreak >= 365) break;
    }
  }

  // En uzun streak'i hesapla (ilk günah tarihinden bugüne)
  let longestStreak = currentStreak;
  let tempStreak = 0;
  
  for (let d = new Date(firstSinDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (!sinDates.has(dateStr)) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return {
    currentStreak,
    longestStreak,
    lastCleanDate,
    streakBroken: todayHasSin,
  };
}

/**
 * Kullanıcının streak'ini veritabanında günceller
 */
export async function updateUserStreak(userId: string): Promise<number> {
  const { currentStreak } = await calculateUserStreak(userId);

  await prisma.user.update({
    where: { id: userId },
    data: { streak: currentStreak },
  });

  return currentStreak;
}

/**
 * Streak milestone'larını kontrol eder ve rozet verir
 */
export async function checkStreakMilestones(
  userId: string,
  currentStreak: number
): Promise<Array<{ badge: string; xp: number; coins: number }>> {
  const milestones = [
    { days: 3, badge: '🔥 3 Gün Streak', xp: 50, coins: 10 },
    { days: 7, badge: '🔥 1 Hafta Streak', xp: 100, coins: 25 },
    { days: 14, badge: '🔥 2 Hafta Streak', xp: 200, coins: 50 },
    { days: 30, badge: '🔥 1 Ay Streak', xp: 500, coins: 100 },
    { days: 60, badge: '🔥 2 Ay Streak', xp: 1000, coins: 200 },
    { days: 90, badge: '🔥 3 Ay Streak', xp: 2000, coins: 500 },
    { days: 180, badge: '🔥 6 Ay Streak', xp: 5000, coins: 1000 },
    { days: 365, badge: '🔥 1 Yıl Streak', xp: 10000, coins: 2500 },
  ];

  const earned: Array<{ badge: string; xp: number; coins: number }> = [];

  for (const milestone of milestones) {
    if (currentStreak >= milestone.days) {
      // Rozet zaten verilmiş mi kontrol et (badge key'e göre)
      const badgeKey = `streak_${milestone.days}`;

      const existingBadge = await prisma.sinBadge.findFirst({
        where: { key: badgeKey },
      });

      if (existingBadge) {
        const userHasBadge = await prisma.userSinBadge.findFirst({
          where: {
            userId,
            badgeId: existingBadge.id,
          },
        });

        if (!userHasBadge) {
          // Rozet ver
          await prisma.userSinBadge.create({
            data: {
              userId,
              badgeId: existingBadge.id,
            },
          });

          // XP ve coin ver
          await prisma.user.update({
            where: { id: userId },
            data: {
              xp: { increment: milestone.xp },
              coins: { increment: milestone.coins },
            },
          });

          earned.push({
            badge: milestone.badge,
            xp: milestone.xp,
            coins: milestone.coins,
          });
        }
      }
    }
  }

  return earned;
}

/**
 * Streak freeze kullanarak streak'i koru
 * Bugün günah yapılmış olsa bile streak korunur
 */
export async function useStreakFreeze(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { streakFreezeCount: true, streak: true },
  });

  if (!user || user.streakFreezeCount <= 0) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Bugün zaten freeze kullanılmış mı kontrol et
  const existingFreeze = await prisma.streakRecovery.findFirst({
    where: {
      userId,
      recoveredAt: { gte: today },
      coinsCost: 0, // Freeze kayıtları coinsCost = 0
    },
  });

  if (existingFreeze) {
    return false; // Bugün zaten freeze kullanılmış
  }

  // Streak freeze kullan ve kaydet
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        streakFreezeCount: { decrement: 1 },
      },
    }),
    // Freeze kaydı oluştur (StreakRecovery tablosunu kullan)
    prisma.streakRecovery.create({
      data: {
        userId,
        streakLost: 0, // Freeze için 0
        coinsCost: 0, // Freeze için 0 (recovery'den ayırt etmek için)
      },
    }),
  ]);

  return true;
}

/**
 * Streak recovery (coin ile streak geri al)
 */
export async function recoverStreak(
  userId: string,
  streakToRecover: number
): Promise<boolean> {
  const coinsCost = Math.min(streakToRecover * 10, 500); // Max 500 coin

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { coins: true },
  });

  if (!user || user.coins < coinsCost) {
    return false;
  }

  // Coin'leri düş ve streak'i geri ver
  await prisma.user.update({
    where: { id: userId },
    data: {
      coins: { decrement: coinsCost },
      streak: streakToRecover,
    },
  });

  // Recovery kaydı oluştur
  await prisma.streakRecovery.create({
    data: {
      userId,
      streakLost: streakToRecover,
      coinsCost,
    },
  });

  return true;
}
