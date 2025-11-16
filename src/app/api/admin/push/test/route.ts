import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { sendPushNotification } from '@/lib/push';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const { userId, title, body } = await req.json();

    // Get user's push subscriptions
    const subscriptions = await db.pushSubscription.findMany({
      where: userId ? { userId } : {},
      select: {
        endpoint: true,
        p256dh: true,
        auth: true,
      },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found' },
        { status: 404 }
      );
    }

    // Send push notification
    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        sendPushNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          {
            title: title || 'Test Bildirimi',
            body: body || 'Bu bir test bildirimidir.',
            icon: '/maskot/maskot-192.png',
            badge: '/maskot/maskot-192.png',
          }
        )
      )
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - success;

    return NextResponse.json({
      success: true,
      sent: success,
      failed,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('Push test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
