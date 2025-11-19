/**
 * Streak Warnings Cron Job
 * Her gün akşam streak'i tehlikede olan kullanıcılara uyarı gönderir
 * Vercel Cron: Her gün 21:00'da çalışır
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendStreakWarning } from '@/lib/push-service';
import { startOfDay, endOfDay } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    // Cron secret kontrolü
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Streak Warnings] Running...');

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);

    // Streak'i olan ama bugün günah eklememiş kullanıcıları bul
    const usersWithStreak = await prisma.user.findMany({
      where: {
        streak: {
          gte: 3, // En az 3 günlük streak
        },
      },
      include: {
        foodSins: {
          where: {
            createdAt: {
              gte: todayStart,
              lte: todayEnd,
            },
          },
        },
        notificationSettings: true,
        pushSubscriptions: {
          where: { isActive: true },
        },
      },
    });

    // Bugün günah eklememiş ve bildirim ayarı açık olanları filtrele
    const usersToWarn = usersWithStreak.filter(
      (user) =>
        user.foodSins.length === 0 &&
        user.notificationSettings?.streakWarning &&
        user.pushSubscriptions.length > 0
    );

    console.log(`[Streak Warnings] Found ${usersToWarn.length} users to warn`);

    // Her kullanıcıya uyarı gönder
    const results = await Promise.allSettled(
      usersToWarn.map(async (user) => {
        const result = await sendStreakWarning(user.id, user.streak);
        return { userId: user.id, streak: user.streak, ...result };
      })
    );

    const successCount = results.filter(
      (r) => r.status === 'fulfilled' && (r.value as any).success
    ).length;

    console.log(`[Streak Warnings] Sent ${successCount}/${usersToWarn.length} warnings`);

    return NextResponse.json({
      success: true,
      total: usersToWarn.length,
      sent: successCount,
      results: results.map((r) =>
        r.status === 'fulfilled' ? r.value : { error: (r as any).reason }
      ),
    });
  } catch (error) {
    console.error('[Streak Warnings] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
