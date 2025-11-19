import { db } from "@/lib/db";

/**
 * Kullanıcının aktif challenge'larını kontrol eder ve tamamlananları işaretler
 */
export async function checkAndUpdateChallenges(userId: string) {
  try {
    // Kullanıcının aktif challenge'larını al
    const activeChallenges = await db.userSinChallenge.findMany({
      where: {
        userId,
        isCompleted: false,
        challenge: {
          isActive: true,
          endDate: { gte: new Date() },
        },
      },
      include: {
        challenge: true,
      },
    });

    if (activeChallenges.length === 0) {
      return [];
    }

    const completed = [];

    for (const participation of activeChallenges) {
      const challenge = participation.challenge;
      const isCompleted = await checkChallengeCompletion(
        userId,
        challenge.id,
        challenge.sinType,
        challenge.targetDays,
        challenge.maxSins,
        challenge.startDate
      );

      if (isCompleted) {
        // Challenge'ı tamamlandı olarak işaretle
        await db.userSinChallenge.update({
          where: { id: participation.id },
          data: {
            isCompleted: true,
            completedAt: new Date(),
            progress: 100,
          },
        });

        // Ödül ver
        await db.user.update({
          where: { id: userId },
          data: {
            xp: { increment: challenge.xpReward },
            coins: { increment: challenge.coinReward },
          },
        });

        completed.push({
          challenge,
          xpReward: challenge.xpReward,
          coinReward: challenge.coinReward,
        });

        console.log(`✅ Challenge completed: ${challenge.title} by user ${userId}`);
      } else {
        // İlerlemeyi güncelle
        const progress = await calculateChallengeProgress(
          userId,
          challenge.sinType,
          challenge.targetDays,
          challenge.maxSins,
          challenge.startDate
        );

        await db.userSinChallenge.update({
          where: { id: participation.id },
          data: { progress },
        });
      }
    }

    return completed;
  } catch (error) {
    console.error("Error checking challenges:", error);
    return [];
  }
}

/**
 * Challenge tamamlanma kontrolü
 */
async function checkChallengeCompletion(
  userId: string,
  challengeId: string,
  sinType: string | null,
  targetDays: number,
  maxSins: number,
  startDate: Date
): Promise<boolean> {
  const now = new Date();
  const daysSinceStart = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Henüz hedef gün sayısına ulaşılmadı
  if (daysSinceStart < targetDays) {
    return false;
  }

  // Son targetDays gün içindeki günah sayısını kontrol et
  const targetDaysAgo = new Date();
  targetDaysAgo.setDate(targetDaysAgo.getDate() - targetDays);

  const where: any = {
    userId,
    sinDate: { gte: targetDaysAgo },
  };

  if (sinType) {
    where.sinType = sinType;
  }

  const sinCount = await db.foodSin.count({ where });

  // Günah sayısı maxSins'den az veya eşitse tamamlanmış
  return sinCount <= maxSins;
}

/**
 * Challenge ilerleme yüzdesi hesapla
 */
async function calculateChallengeProgress(
  userId: string,
  sinType: string | null,
  targetDays: number,
  maxSins: number,
  startDate: Date
): Promise<number> {
  const now = new Date();
  const daysSinceStart = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Gün ilerlemesi
  const dayProgress = Math.min((daysSinceStart / targetDays) * 100, 100);

  // Günah kontrolü
  const targetDaysAgo = new Date();
  targetDaysAgo.setDate(targetDaysAgo.getDate() - Math.min(daysSinceStart, targetDays));

  const where: any = {
    userId,
    sinDate: { gte: targetDaysAgo },
  };

  if (sinType) {
    where.sinType = sinType;
  }

  const sinCount = await db.foodSin.count({ where });

  // Günah hedefine ne kadar yakın
  const sinProgress = maxSins === 0 
    ? (sinCount === 0 ? 100 : 0)
    : Math.max(0, ((maxSins - sinCount) / maxSins) * 100);

  // Ortalama ilerleme
  return Math.round((dayProgress + sinProgress) / 2);
}

/**
 * Belirli bir challenge için kontrol
 */
export async function checkSpecificChallenge(
  userId: string,
  challengeId: string
) {
  const participation = await db.userSinChallenge.findUnique({
    where: {
      userId_challengeId: {
        userId,
        challengeId,
      },
    },
    include: {
      challenge: true,
    },
  });

  if (!participation || participation.isCompleted) {
    return null;
  }

  const challenge = participation.challenge;
  const isCompleted = await checkChallengeCompletion(
    userId,
    challenge.id,
    challenge.sinType,
    challenge.targetDays,
    challenge.maxSins,
    challenge.startDate
  );

  if (isCompleted) {
    await db.userSinChallenge.update({
      where: { id: participation.id },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        progress: 100,
      },
    });

    await db.user.update({
      where: { id: userId },
      data: {
        xp: { increment: challenge.xpReward },
        coins: { increment: challenge.coinReward },
      },
    });

    return {
      challenge,
      xpReward: challenge.xpReward,
      coinReward: challenge.coinReward,
    };
  }

  return null;
}
