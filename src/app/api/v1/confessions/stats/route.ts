import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getConfessionStats, getPopularConfessions } from '@/services/confession.service';

// GET /api/v1/confessions/stats - Genel istatistikler
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const includePopular = searchParams.get('includePopular') === 'true';

    // Genel istatistikleri al
    const stats = await getConfessionStats();

    const response: any = {
      success: true,
      data: stats,
    };

    // Popüler itirafları da dahil et mi?
    if (includePopular) {
      const popularConfessions = await getPopularConfessions(10);
      response.data.popularConfessions = popularConfessions;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get confession stats error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_STATS_ERROR',
          message: error.message || 'İstatistikler yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}
