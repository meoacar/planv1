import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db as prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    // Aktif sezonu bul
    const currentSeason = await prisma.season.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!currentSeason) {
      return NextResponse.json(
        { success: false, message: 'Aktif sezon bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcının lig bilgisini bul veya oluştur
    let userLeague = await prisma.userLeague.findUnique({
      where: {
        userId_seasonId: {
          userId: session.user.id,
          seasonId: currentSeason.id,
        },
      },
      include: {
        league: true,
      },
    });

    // Eğer kullanıcının lig kaydı yoksa, başlangıç ligine yerleştir
    if (!userLeague) {
      const bronzeLeague = await prisma.league.findFirst({
        where: {
          seasonId: currentSeason.id,
          tier: 'bronze',
        },
      });

      if (!bronzeLeague) {
        return NextResponse.json(
          { success: false, message: 'Başlangıç ligi bulunamadı' },
          { status: 404 }
        );
      }

      userLeague = await prisma.userLeague.create({
        data: {
          userId: session.user.id,
          leagueId: bronzeLeague.id,
          seasonId: currentSeason.id,
          points: 0,
        },
        include: {
          league: true,
        },
      });
    }

    // Kullanıcının sıralamasını hesapla
    const rank = await prisma.userLeague.count({
      where: {
        leagueId: userLeague.leagueId,
        points: {
          gt: userLeague.points,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...userLeague,
        rank: rank + 1,
      },
    });
  } catch (error) {
    console.error('Error fetching user league:', error);
    return NextResponse.json(
      { success: false, message: 'Lig bilgisi alınamadı' },
      { status: 500 }
    );
  }
}
