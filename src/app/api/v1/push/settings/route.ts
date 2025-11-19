/**
 * Push Notification Settings API
 * GET /api/v1/push/settings - Kullanıcı ayarlarını getir
 * PUT /api/v1/push/settings - Ayarları güncelle
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.notificationSettings.findUnique({
      where: { userId: session.user.id },
    });

    // Yoksa default oluştur
    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: {
          userId: session.user.id,
          dailyReminder: true,
          dailyReminderTime: '20:00',
          weeklySummary: true,
          badgeEarned: true,
          challengeReminder: true,
          streakWarning: true,
          friendActivity: false,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      dailyReminder,
      dailyReminderTime,
      weeklySummary,
      badgeEarned,
      challengeReminder,
      streakWarning,
      friendActivity,
    } = body;

    const settings = await prisma.notificationSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        dailyReminder: dailyReminder ?? true,
        dailyReminderTime: dailyReminderTime ?? '20:00',
        weeklySummary: weeklySummary ?? true,
        badgeEarned: badgeEarned ?? true,
        challengeReminder: challengeReminder ?? true,
        streakWarning: streakWarning ?? true,
        friendActivity: friendActivity ?? false,
      },
      update: {
        dailyReminder,
        dailyReminderTime,
        weeklySummary,
        badgeEarned,
        challengeReminder,
        streakWarning,
        friendActivity,
      },
    });

    return NextResponse.json({
      success: true,
      settings,
      message: 'Settings updated',
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
