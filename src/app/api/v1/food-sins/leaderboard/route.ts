import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'weekly'; // daily, weekly, monthly, alltime
    const metric = searchParams.get('metric') || 'cleanDays'; // cleanDays, leastSins, motivation

    // Tarih aralığını hesapla
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const dayOfWeek = now.getDay();
        startDate = new Date(now);
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'alltime':
      default:
        startDate = new Date(0); // Başlangıçtan beri
        break;
    }

    // Tüm kullanıcıların istatistiklerini hesapla
    const users = await prisma.user.findMany({
      where: {
        isBanned: false,
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        level: true,
        xp: true,
        foodSins: {
          where: {
            createdAt: {
              gte: startDate,
            },
          },
          select: {
            id: true,
            createdAt: true,
          },
        },
        sinBadges: {
          select: {
            badge: {
              select: {
                icon: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Her kullanıcı için metrikleri hesapla
    const leaderboardData = await Promise.all(
      users.map(async (user) => {
        const totalSins = user.foodSins.length;

        // Temiz günleri hesapla
        const sinDates = new Set(
          user.foodSins.map((sin) =>
            new Date(sin.createdAt).toISOString().split('T')[0]
          )
        );

        const totalDays = Math.ceil(
          (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const cleanDays = Math.max(0, totalDays - sinDates.size);

        // Motivasyon skoru hesapla (0-100)
        const motivationScore = totalDays > 0
          ? Math.round((cleanDays / totalDays) * 100)
          : 100;

        return {
          userId: user.id,
          name: user.name || user.username || 'Anonim',
          username: user.username,
          image: user.image,
          level: user.level || 1,
          xp: user.xp || 0,
          totalSins,
          cleanDays,
          motivationScore,
          badges: user.sinBadges.map((ub) => ({
            icon: ub.badge.icon,
            name: ub.badge.name,
          })),
          isCurrentUser: user.id === session.user.id,
        };
      })
    );

    // Metriğe göre sırala
    let sortedData = [...leaderboardData];
    switch (metric) {
      case 'leastSins':
        sortedData.sort((a, b) => a.totalSins - b.totalSins);
        break;
      case 'motivation':
        sortedData.sort((a, b) => b.motivationScore - a.motivationScore);
        break;
      case 'cleanDays':
      default:
        sortedData.sort((a, b) => b.cleanDays - a.cleanDays);
        break;
    }

    // Sıralama numarası ekle
    const rankedData = sortedData.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    // Mevcut kullanıcının sıralamasını bul
    const currentUserRank = rankedData.find((u) => u.isCurrentUser);

    return NextResponse.json({
      leaderboard: rankedData.slice(0, 100), // İlk 100 kullanıcı
      currentUser: currentUserRank,
      period,
      metric,
      totalUsers: rankedData.length,
    });
  } catch (error: any) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch leaderboard',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
