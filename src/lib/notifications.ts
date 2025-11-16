// Notification Helper Functions
import { db } from '@/lib/db';
import { sendPushNotificationBulk, PushNotificationPayload } from '@/lib/push';

/**
 * Send notification to a user (in-app + push)
 */
export async function sendNotificationToUser(
  userId: string,
  notification: {
    type: string;
    title: string;
    body: string;
    targetType?: string;
    targetId?: string;
  }
) {
  // Create in-app notification
  await db.notification.create({
    data: {
      userId,
      type: notification.type as any,
      title: notification.title,
      body: notification.body,
      targetType: notification.targetType as any,
      targetId: notification.targetId,
    },
  });

  // Send push notification if user has subscriptions
  const subscriptions = await (db as any).pushSubscription.findMany({
    where: { userId },
    select: {
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  if (subscriptions.length > 0) {
    const pushPayload: PushNotificationPayload = {
      title: notification.title,
      body: notification.body,
      icon: '/maskot/maskot-192.png',
      badge: '/maskot/maskot-192.png',
      data: {
        url: notification.targetId ? `/${notification.targetType}/${notification.targetId}` : '/',
      },
    };

    await sendPushNotificationBulk(
      subscriptions.map((sub: any) => ({
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      })),
      pushPayload
    );
  }
}

/**
 * Send notification to multiple users
 */
export async function sendNotificationToUsers(
  userIds: string[],
  notification: {
    type: string;
    title: string;
    body: string;
    targetType?: string;
    targetId?: string;
  }
) {
  // Create in-app notifications
  await db.notification.createMany({
    data: userIds.map(userId => ({
      userId,
      type: notification.type as any,
      title: notification.title,
      body: notification.body,
      targetType: notification.targetType as any,
      targetId: notification.targetId,
    })),
  });

  // Get all push subscriptions for these users
  const subscriptions = await (db as any).pushSubscription.findMany({
    where: { userId: { in: userIds } },
    select: {
      endpoint: true,
      p256dh: true,
      auth: true,
    },
  });

  if (subscriptions.length > 0) {
    const pushPayload: PushNotificationPayload = {
      title: notification.title,
      body: notification.body,
      icon: '/maskot/maskot-192.png',
      badge: '/maskot/maskot-192.png',
      data: {
        url: notification.targetId ? `/${notification.targetType}/${notification.targetId}` : '/',
      },
    };

    await sendPushNotificationBulk(
      subscriptions.map((sub: any) => ({
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      })),
      pushPayload
    );
  }
}
