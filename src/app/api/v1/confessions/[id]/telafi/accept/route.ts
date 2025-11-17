import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getConfessionById } from '@/services/confession.service';
import { addXP } from '@/services/gamification.service';

// POST /api/v1/confessions/[id]/telafi/accept - Telafi planını kabul et
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Giriş yapmalısınız',
          },
        },
        { status: 401 }
      );
    }

    // İtirafı kontrol et
    const confession = await getConfessionById(params.id);

    // Sadece kendi itirafının telafi planını kabul edebilir
    if (confession.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Bu işlem için yetkiniz yok',
          },
        },
        { status: 403 }
      );
    }

    // Telafi planı var mı kontrol et
    if (!confession.telafiBudget) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NO_TELAFI_PLAN',
            message: 'Bu itirafın telafi planı yok',
          },
        },
        { status: 400 }
      );
    }

    // Telafi planını parse et
    let telafiBudget;
    try {
      telafiBudget = JSON.parse(confession.telafiBudget);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TELAFI_PLAN',
            message: 'Telafi planı geçersiz',
          },
        },
        { status: 400 }
      );
    }

    // TODO: Telafi planını günlük göreve ekle (Phase 4'te implement edilecek)
    // Bu aşamada sadece XP ödülü veriyoruz
    const xpReward = telafiBudget.xpReward || 15;
    await addXP(session.user.id, xpReward, `Telafi planı kabul edildi: ${telafiBudget.action}`);

    return NextResponse.json({
      success: true,
      data: {
        action: telafiBudget.action,
        xpReward,
      },
      message: `Telafi planı kabul edildi! +${xpReward} XP kazandın`,
    });
  } catch (error: any) {
    console.error('Accept telafi error:', error);

    if (error.message.includes('bulunamadı')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONFESSION_NOT_FOUND',
            message: error.message,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ACCEPT_TELAFI_ERROR',
          message: error.message || 'Telafi planı kabul edilirken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}
