/**
 * Push Notification Service
 * Web Push API ile bildirim gönderme servisi
 */

import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

// VAPID keys yapılandırması
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY!;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@zayiflamaplan.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  tag?: string;
  requireInteraction?: boolean;
}

/**
 * Tek bir kullanıcıya push notification gönder
 */
export async function sendPushToUser(
  userId: string,
  type: string,
  payload: PushPayload
) {
  try {
    // VAPID keys kontrolü
    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys not configured');
      return { success: false, reason: 'vapid_not_configured' };
    }

    // Kullanıcının aktif aboneliklerini al
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        isActive: true,
      },
    });

    if (subscriptions.length === 0) {
      console.log(`No active subscriptions for user ${userId}`);
      return { success: false, reason: 'no_subscriptions' };
    }

    // Notification kaydı oluştur
    const notification = await prisma.pushNotification.create({
      data: {
        userId,
        type: type as any,
        title: payload.title,
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge,
        data: payload.data ? JSON.stringify(payload.data) : null,
        status: 'pending',
      },
    });

    // Tüm aboneliklere gönder
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            JSON.stringify(payload)
          );
          return { success: true, subscriptionId: sub.id };
        } catch (error: any) {
          // 410 Gone - Abonelik geçersiz, sil
          if (error.statusCode === 410) {
            await prisma.pushSubscription.update({
              where: { id: sub.id },
              data: { isActive: false },
            });
          }
          throw error;
        }
      })
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;

    // Notification durumunu güncelle
    await prisma.pushNotification.update({
      where: { id: notification.id },
      data: {
        status: successCount > 0 ? 'sent' : 'failed',
        sentAt: successCount > 0 ? new Date() : null,
        errorMessage:
          successCount === 0
            ? results
                .filter((r) => r.status === 'rejected')
                .map((r: any) => r.reason?.message)
                .join(', ')
            : null,
      },
    });

    return {
      success: successCount > 0,
      sent: successCount,
      total: subscriptions.length,
      notificationId: notification.id,
    };
  } catch (error) {
    console.error('Push notification error:', error);
    throw error;
  }
}

/**
 * Birden fazla kullanıcıya push notification gönder
 */
export async function sendPushToUsers(
  userIds: string[],
  type: string,
  payload: PushPayload
) {
  const results = await Promise.allSettled(
    userIds.map((userId) => sendPushToUser(userId, type, payload))
  );

  const successCount = results.filter((r) => r.status === 'fulfilled').length;

  return {
    success: successCount > 0,
    sent: successCount,
    total: userIds.length,
  };
}

/**
 * Günlük hatırlatıcı gönder
 */
export async function sendDailyReminder(userId: string) {
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  });

  if (!settings?.dailyReminder) {
    return { success: false, reason: 'disabled' };
  }

  return sendPushToUser(userId, 'daily_reminder', {
    title: '🍽️ Günlük Kontrol Zamanı!',
    body: 'Bugün kaçamak yaptın mı? Günlüğünü güncellemeyi unutma!',
    icon: '/maskot/maskot-192.png',
    badge: '/maskot/maskot-192.png',
    data: { url: '/gunah-sayaci' },
    tag: 'daily-reminder',
  });
}

/**
 * Haftalık özet bildirimi gönder
 */
export async function sendWeeklySummary(userId: string) {
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  });

  if (!settings?.weeklySummary) {
    return { success: false, reason: 'disabled' };
  }

  return sendPushToUser(userId, 'weekly_summary', {
    title: '📊 Haftalık Özetin Hazır!',
    body: 'Bu haftaki performansını görmek için tıkla!',
    icon: '/maskot/maskot-192.png',
    badge: '/maskot/maskot-192.png',
    data: { url: '/gunah-sayaci?tab=summary' },
    tag: 'weekly-summary',
    requireInteraction: true,
  });
}

/**
 * Rozet kazanma bildirimi
 */
export async function sendBadgeEarned(
  userId: string,
  badgeName: string,
  badgeIcon: string
) {
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  });

  if (!settings?.badgeEarned) {
    return { success: false, reason: 'disabled' };
  }

  return sendPushToUser(userId, 'badge_earned', {
    title: '🏆 Yeni Rozet Kazandın!',
    body: `Tebrikler! "${badgeName}" rozetini kazandın!`,
    icon: '/maskot/maskot-192.png',
    badge: '/maskot/maskot-192.png',
    data: { url: '/gunah-sayaci?tab=badges', badgeName },
    tag: 'badge-earned',
    requireInteraction: true,
  });
}

/**
 * Streak uyarısı gönder
 */
export async function sendStreakWarning(userId: string, currentStreak: number) {
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  });

  if (!settings?.streakWarning) {
    return { success: false, reason: 'disabled' };
  }

  return sendPushToUser(userId, 'streak_warning', {
    title: '🔥 Streak\'in Tehlikede!',
    body: `${currentStreak} günlük streak'ini kaybetme! Bugün temiz kal!`,
    icon: '/maskot/maskot-192.png',
    badge: '/maskot/maskot-192.png',
    data: { url: '/gunah-sayaci?tab=streak', currentStreak },
    tag: 'streak-warning',
    requireInteraction: true,
  });
}

/**
 * Challenge hatırlatıcısı gönder
 */
export async function sendChallengeReminder(
  userId: string,
  challengeTitle: string
) {
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  });

  if (!settings?.challengeReminder) {
    return { success: false, reason: 'disabled' };
  }

  return sendPushToUser(userId, 'challenge_reminder', {
    title: '🎯 Challenge Hatırlatıcısı',
    body: `"${challengeTitle}" challenge'ı devam ediyor! İlerlemeni kontrol et!`,
    icon: '/maskot/maskot-192.png',
    badge: '/maskot/maskot-192.png',
    data: { url: '/gunah-sayaci?tab=challenges', challengeTitle },
    tag: 'challenge-reminder',
  });
}
