import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { reportConfession } from '@/services/confession.service';

// POST /api/v1/confessions/[id]/report - İtirafı raporla
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    const body = await req.json();
    const { reason } = body;

    if (!reason || typeof reason !== 'string' || reason.trim().length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Rapor nedeni en az 10 karakter olmalı',
          },
        },
        { status: 400 }
      );
    }

    await reportConfession(id, session.user.id, reason);

    return NextResponse.json({
      success: true,
      message: 'İtiraf raporlandı. İnceleme için teşekkürler.',
    });
  } catch (error: any) {
    console.error('Report confession error:', error);

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

    if (error.message.includes('zaten rapor')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ALREADY_REPORTED',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REPORT_ERROR',
          message: error.message || 'Rapor gönderilirken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}
