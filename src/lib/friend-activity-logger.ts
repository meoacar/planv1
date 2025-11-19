/**
 * Friend Activity Logger
 * Arkadaş aktivitelerini otomatik kaydeder
 */

import { prisma } from '@/lib/prisma';

export type ActivityType =
  | 'sin_added'
  | 'badge_earned'
  | 'streak_milestone'
  | 'challenge_completed'
  | 'level_up';

interface ActivityData {
  [key: string]: any;
}

/**
 * Aktivite kaydet
 */
export async function logFriendActivity(
  userId: string,
  activityType: ActivityType,
  activityData?: ActivityData,
  isPublic: boolean = true
) {
  try {
    // Kullanıcının ayarlarını kontrol et
    const settings = await prisma.friendSettings.findUnique({
      where: { userId },
    });

    // Aktivite paylaşımı kapalıysa kaydetme
    if (settings && !settings.showActivity) {
      return null;
    }

    const activity = await prisma.friendActivity.create({
      data: {
        userId,
        activityType,
        activityData: activityData ? JSON.stringify(activityData) : null,
        isPublic,
      },
    });

    return activity;
  } catch (error) {
    console.error('Log friend activity error:', error);
    return null;
  }
}

/**
 * Günah eklendiğinde
 */
export async function logSinAdded(
  userId: string,
  sinType: string,
  note?: string
) {
  return logFriendActivity(userId, 'sin_added', {
    sinType,
    note: note?.substring(0, 50), // İlk 50 karakter
  });
}

/**
 * Rozet kazanıldığında
 */
export async function logBadgeEarned(
  userId: string,
  badgeName: string,
  badgeIcon: string
) {
  return logFriendActivity(userId, 'badge_earned', {
    badgeName,
    badgeIcon,
  });
}

/**
 * Streak milestone'a ulaşıldığında
 */
export async function logStreakMilestone(userId: string, streak: number) {
  // Sadece önemli milestone'ları kaydet (3, 7, 14, 30, 60, 90, 180, 365)
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
  if (!milestones.includes(streak)) {
    return null;
  }

  return logFriendActivity(userId, 'streak_milestone', {
    streak,
  });
}

/**
 * Challenge tamamlandığında
 */
export async function logChallengeCompleted(
  userId: string,
  challengeTitle: string,
  reward: { xp: number; coins: number }
) {
  return logFriendActivity(userId, 'challenge_completed', {
    challengeTitle,
    reward,
  });
}

/**
 * Level atlandığında
 */
export async function logLevelUp(userId: string, newLevel: number) {
  return logFriendActivity(userId, 'level_up', {
    level: newLevel,
  });
}
