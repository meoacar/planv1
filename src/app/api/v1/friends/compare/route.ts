/**
 * Friend Comparison API
 * GET /api/v1/friends/compare?friendId=xxx - Arkadaşla karşılaştır
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';
import { startOfWeek, startOfMonth, endOfWeek, endOfMonth } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get('friendId');

    if (!friendId) {
      return NextResponse.json(
        { error: 'Friend ID required' },
        { status: 400 }
      );
    }

    // Arkadaş mı kontrol et
    const friendship = await prisma.friendship.findFirst({
      where: {
        userId: session.user.id,
        friendId,
      },
    });

    if (!friendship) {
      return NextResponse.json({ error: 'Not friends' }, { status: 403 });
    }

    // Arkadaşın gizlilik ayarlarını kontrol et
    const friendSettings = await prisma.friendSettings.findUnique({
      where: { userId: friendId },
    });

    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Kullanıcı verileri
    const [user, friend] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          level: true,
          xp: true,
          streak: true,
          coins: true,
          sinBadges: {
            include: { badge: true },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: friendId },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          level: friendSettings?.showStats ? true : false,
          xp: friendSettings?.showStats ? true : false,
          streak: friendSettings?.showStreak ? true : false,
          coins: friendSettings?.showStats ? true : false,
          sinBadges: friendSettings?.showBadges
            ? {
                include: { badge: true },
              }
            : false,
        },
      }),
    ]);

    if (!user || !friend) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // İstatistikler
    const [userWeekStats, friendWeekStats, userMonthStats, friendMonthStats] =
      await Promise.all([
        // Kullanıcı haftalık
        prisma.foodSin.aggregate({
          where: {
            userId: session.user.id,
            sinDate: { gte: weekStart, lte: weekEnd },
          },
          _count: true,
        }),
        // Arkadaş haftalık
        friendSettings?.showStats
          ? prisma.foodSin.aggregate({
              where: {
                userId: friendId,
                sinDate: { gte: weekStart, lte: weekEnd },
              },
              _count: true,
            })
          : null,
        // Kullanıcı aylık
        prisma.foodSin.aggregate({
          where: {
            userId: session.user.id,
            sinDate: { gte: monthStart, lte: monthEnd },
          },
          _count: true,
        }),
        // Arkadaş aylık
        friendSettings?.showStats
          ? prisma.foodSin.aggregate({
              where: {
                userId: friendId,
                sinDate: { gte: monthStart, lte: monthEnd },
              },
              _count: true,
            })
          : null,
      ]);

    return NextResponse.json({
      user: {
        ...user,
        weekSins: userWeekStats._count,
        monthSins: userMonthStats._count,
      },
      friend: {
        ...friend,
        weekSins: friendWeekStats?._count || null,
        monthSins: friendMonthStats?._count || null,
      },
      privacy: {
        showStats: friendSettings?.showStats ?? true,
        showStreak: friendSettings?.showStreak ?? true,
        showBadges: friendSettings?.showBadges ?? true,
      },
    });
  } catch (error) {
    console.error('Compare friends error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
