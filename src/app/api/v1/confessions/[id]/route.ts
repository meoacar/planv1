import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getConfessionById } from '@/services/confession.service';

// GET /api/v1/confessions/[id] - Tekil itiraf detayı
export async function GET(
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

    const confession = await getConfessionById(params.id);

    return NextResponse.json({
      success: true,
      data: confession,
    });
  } catch (error: any) {
    console.error('Get confession error:', error);

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
          code: 'GET_CONFESSION_ERROR',
          message: error.message || 'İtiraf yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}
