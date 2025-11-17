import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserConfessions, getUserConfessionStats } from '@/services/confession.service';

// GET /api/v1/confessions/my - Kullanıcının kendi itirafları
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

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

    // İstatistikleri de dahil et mi?
    const includeStats = searchParams.get('includeStats') === 'true';

    const result = await getUserConfessions(session.user.id, { page, limit });

    const response: any = {
      success: true,
      data: result.items,
      meta: result.pagination,
      hasMore: result.hasMore,
    };

    // İstatistikler isteniyorsa ekle
    if (includeStats) {
      const stats = await getUserConfessionStats(session.user.id);
      response.stats = stats;
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Get my confessions error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_MY_CONFESSIONS_ERROR',
          message: error.message || 'İtiraflar yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}
