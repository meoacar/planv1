/**
 * Daily Reminders Cron Job
 * Her gün belirlenen saatlerde kullanıcılara hatırlatıcı gönderir
 * Vercel Cron: Her saat başı çalışır, kullanıcı saatlerini kontrol eder
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendDailyReminder } from '@/lib/push-service';

export async function GET(req: NextRequest) {
  try {
    // Cron secret kontrolü
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    console.log(`[Daily Reminders] Running at ${currentTime}`);

    // Bu saatte hatırlatıcı almak isteyen kullanıcıları bul
    // ±5 dakika tolerans
    const settings = await prisma.notificationSettings.findMany({
      where: {
        dailyReminder: true,
        dailyReminderTime: {
          gte: `${currentHour.toString().padStart(2, '0')}:${Math.max(0, currentMinute - 5).toString().padStart(2, '0')}`,
          lte: `${currentHour.toString().padStart(2, '0')}:${Math.min(59, currentMinute + 5).toString().padStart(2, '0')}`,
        },
      },
      include: {
        user: {
          include: {
            pushSubscriptions: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    console.log(`[Daily Reminders] Found ${settings.length} users`);

    // Her kullanıcıya bildirim gönder
    const results = await Promise.allSettled(
      settings.map(async (setting) => {
        if (setting.user.pushSubscriptions.length === 0) {
          return { userId: setting.userId, success: false, reason: 'no_subscription' };
        }

        const result = await sendDailyReminder(setting.userId);
        return { userId: setting.userId, ...result };
      })
    );

    const successCount = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any).success
    ).length;

    console.log(`[Daily Reminders] Sent ${successCount}/${settings.length} notifications`);

    return NextResponse.json({
      success: true,
      time: currentTime,
      total: settings.length,
      sent: successCount,
      results: results.map((r) =>
        r.status === 'fulfilled' ? r.value : { error: (r as any).reason }
      ),
    });
  } catch (error) {
    console.error('[Daily Reminders] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
