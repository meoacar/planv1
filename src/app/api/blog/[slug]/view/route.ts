import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import type { BlogErrorResponse } from '@/types/blog'

interface ViewCountResponse {
  success: true
  data: {
    viewCount: number
  }
}

// POST /api/blog/[slug]/view - View count artır
export async function POST(
  _req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<ViewCountResponse | BlogErrorResponse>> {
  try {
    const { slug } = params

    // Blog yazısını bul ve view count'u artır
    const post = await prisma.blogPost.update({
      where: {
        slug,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      select: {
        viewCount: true,
      },
    })

    const response: ViewCountResponse = {
      success: true,
      data: {
        viewCount: post.viewCount,
      },
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Increment view count error:', error)

    // Blog bulunamadıysa 404
    if (error.code === 'P2025') {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'BLOG_POST_NOT_FOUND',
          message: 'Blog yazısı bulunamadı',
        },
      }
      return NextResponse.json(errorResponse, { status: 404 })
    }

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'INCREMENT_VIEW_COUNT_ERROR',
        message: error.message || 'Görüntülenme sayısı artırılırken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
