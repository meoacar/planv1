/**
 * Push Notification Subscription API
 * POST /api/v1/push/subscribe - Yeni abonelik oluştur
 * DELETE /api/v1/push/subscribe - Aboneliği iptal et
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { endpoint, keys, userAgent } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Mevcut aboneliği kontrol et
    const existing = await prisma.pushSubscription.findFirst({
      where: {
        userId: session.user.id,
        endpoint,
      },
    });

    if (existing) {
      // Varsa güncelle
      const updated = await prisma.pushSubscription.update({
        where: { id: existing.id },
        data: {
          p256dh: keys.p256dh,
          auth: keys.auth,
          userAgent,
          isActive: true,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        subscription: updated,
        message: 'Subscription updated',
      });
    }

    // Yoksa yeni oluştur
    const subscription = await prisma.pushSubscription.create({
      data: {
        userId: session.user.id,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent,
        isActive: true,
      },
    });

    // Notification settings yoksa oluştur
    await prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        dailyReminder: true,
        dailyReminderTime: '20:00',
        weeklySummary: true,
        badgeEarned: true,
        challengeReminder: true,
        streakWarning: true,
        friendActivity: false,
      },
      update: {},
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: 'Subscription created',
    });
  } catch (error) {
    console.error('Push subscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint required' },
        { status: 400 }
      );
    }

    // Aboneliği pasif yap
    await prisma.pushSubscription.updateMany({
      where: {
        userId: session.user.id,
        endpoint,
      },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription removed',
    });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
