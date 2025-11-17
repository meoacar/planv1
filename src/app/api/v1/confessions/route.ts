import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getConfessions, createConfession } from '@/services/confession.service';
import { rateLimit } from '@/lib/redis';

// GET /api/v1/confessions - İtiraf listesi (feed)
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

    // Filters
    const filters = {
      category: searchParams.get('category') as any,
      isPopular: searchParams.get('popular') === 'true' ? true : undefined,
      status: 'published' as const,
    };

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50

    const result = await getConfessions(filters, { page, limit });

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.pagination,
      hasMore: result.hasMore,
    });
  } catch (error: any) {
    console.error('Get confessions error:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_CONFESSIONS_ERROR',
          message: error.message || 'İtiraflar yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/confessions - Yeni itiraf oluştur
export async function POST(req: NextRequest) {
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

    // Rate limiting (spam koruması)
    const rateLimitKey = `create-confession:${session.user.id}`;
    const { success: rateLimitSuccess } = await rateLimit(rateLimitKey, 5, 300); // 5 istek / 5 dakika

    if (!rateLimitSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'Çok fazla itiraf oluşturma denemesi. Lütfen birkaç dakika sonra tekrar deneyin.',
          },
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { content, category } = body;

    // Basic validation
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'İtiraf içeriği gerekli',
          },
        },
        { status: 400 }
      );
    }

    // Create confession (service içinde tüm validasyon ve kontroller yapılıyor)
    const confession = await createConfession({
      userId: session.user.id,
      content,
      category,
    });

    // AI yanıt üretimi için queue'ya ekle (TODO: Phase 5'te implement edilecek)
    // await addToAIQueue(confession.id);

    return NextResponse.json({
      success: true,
      data: confession,
      message: 'İtiraf başarıyla paylaşıldı! +10 XP, +5 Coin kazandınız',
    });
  } catch (error: any) {
    console.error('Create confession error:', error);

    // Özel hata mesajları
    if (error.message.includes('limit')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DAILY_LIMIT_EXCEEDED',
            message: error.message,
          },
        },
        { status: 429 }
      );
    }

    if (error.message.includes('karakter')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    if (error.message.includes('Spam') || error.message.includes('uygunsuz')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CONTENT_REJECTED',
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
          code: 'CREATE_CONFESSION_ERROR',
          message: error.message || 'İtiraf oluşturulurken hata oluştu',
        },
      },
      { status: 500 }
    );
  }
}
