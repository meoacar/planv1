import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcının günah istatistikleri
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'week'; // day, week, month

    let startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    // Toplam günah sayısı
    const totalSins = await prisma.foodSin.count({
      where: {
        userId: session.user.id,
        sinDate: { gte: startDate },
      },
    });

    // Günah türlerine göre dağılım
    const sinsByType = await prisma.foodSin.groupBy({
      by: ['sinType'],
      where: {
        userId: session.user.id,
        sinDate: { gte: startDate },
      },
      _count: true,
    });

    // En çok yapılan günah
    const mostCommonSin = sinsByType.reduce(
      (max, item) => (item._count > max._count ? item : max),
      { sinType: null, _count: 0 }
    );

    // Temiz günler (günah işlenmemiş günler)
    const allDates = await prisma.foodSin.findMany({
      where: {
        userId: session.user.id,
        sinDate: { gte: startDate },
      },
      select: { sinDate: true },
    });

    const uniqueDates = new Set(
      allDates.map(d => d.sinDate.toISOString().split('T')[0])
    );

    const totalDays = Math.ceil(
      (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const cleanDays = totalDays - uniqueDates.size;

    // Motivasyon barı (0-100)
    const motivationBar = Math.max(0, Math.min(100, 
      Math.round((cleanDays / totalDays) * 100)
    ));

    // Günlük ortalama
    const dailyAverage = totalDays > 0 ? (totalSins / totalDays).toFixed(1) : 0;

    return NextResponse.json({
      period,
      totalSins,
      cleanDays,
      totalDays,
      dailyAverage,
      motivationBar,
      mostCommonSin: mostCommonSin.sinType,
      breakdown: sinsByType.map(item => ({
        type: item.sinType,
        count: item._count,
        emoji: getEmoji(item.sinType),
      })),
    });
  } catch (error: any) {
    console.error('Error fetching sin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

function getEmoji(sinType: string): string {
  const emojiMap: Record<string, string> = {
    tatli: '🍰',
    fastfood: '🍟',
    gazli: '🥤',
    alkol: '🍺',
    diger: '🍩',
  };
  return emojiMap[sinType] || '🍽️';
}
