import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Genel istatistikler
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    // Aktif kullanıcı sayısı
    const totalActiveUsers = await prisma.user.count({
      where: { isActive: true },
    });

    // Bu hafta günah ekleyen kullanıcı sayısı
    const weeklyActiveUsers = await prisma.foodSin.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    });

    // En başarılı kullanıcılar (en az günah)
    const topUsers = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        level: true,
        xp: true,
        _count: {
          select: {
            foodSins: {
              where: {
                createdAt: {
                  gte: weekStart,
                },
              },
            },
          },
        },
        sinBadges: {
          select: {
            badge: {
              select: {
                emoji: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        foodSins: {
          _count: 'asc',
        },
      },
      take: 10,
    });

    // En çok rozet kazanan kullanıcılar
    const topBadgeEarners = await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            sinBadges: true,
          },
        },
      },
      orderBy: {
        sinBadges: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Günah türü dağılımı (tüm kullanıcılar)
    const sinTypeDistribution = await prisma.foodSin.groupBy({
      by: ['sinType'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: weekStart,
        },
      },
    });

    return NextResponse.json({
      totalActiveUsers,
      weeklyActiveUsers: weeklyActiveUsers.length,
      engagementRate: totalActiveUsers > 0
        ? Math.round((weeklyActiveUsers.length / totalActiveUsers) * 100)
        : 0,
      topUsers: topUsers.map((user) => ({
        id: user.id,
        name: user.name || user.username || 'Anonim',
        image: user.image,
        level: user.level || 1,
        xp: user.xp || 0,
        weeklySins: user._count.foodSins,
        badges: user.sinBadges.map((ub) => ({
          emoji: ub.badge.emoji,
          name: ub.badge.name,
        })),
      })),
      topBadgeEarners: topBadgeEarners.map((user) => ({
        id: user.id,
        name: user.name || user.username || 'Anonim',
        image: user.image,
        badgeCount: user._count.sinBadges,
      })),
      sinTypeDistribution: sinTypeDistribution.map((item) => ({
        type: item.sinType,
        count: item._count.id,
      })),
    });
  } catch (error) {
    console.error('Admin leaderboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard stats' },
      { status: 500 }
    );
  }
}
