import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addLeaguePoints } from '@/services/gamification.service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, points } = body;

    if (!userId || !points) {
      return NextResponse.json(
        { success: false, message: 'userId ve points gerekli' },
        { status: 400 }
      );
    }

    if (typeof points !== 'number' || points <= 0) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz puan miktarı' },
        { status: 400 }
      );
    }

    const result = await addLeaguePoints(userId, points);

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Aktif sezon bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.promoted
        ? `Kullanıcı ${result.league.name}'e yükseldi!`
        : 'Puan başarıyla eklendi',
      data: result,
    });
  } catch (error) {
    console.error('Error adding league points:', error);
    return NextResponse.json(
      { success: false, message: 'Puan eklenirken hata oluştu' },
      { status: 500 }
    );
  }
}
