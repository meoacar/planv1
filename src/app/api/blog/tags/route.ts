import { NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { cache } from '@/lib/redis'
import type { BlogTagListResponse, BlogErrorResponse } from '@/types/blog'

// GET /api/blog/tags - Popüler etiketler
export async function GET(): Promise<
  NextResponse<BlogTagListResponse | BlogErrorResponse>
> {
  try {
    // Cache popular tags for 10 minutes
    const tags = await cache(
      'blog:tags:popular',
      600, // 10 minutes
      async () => {
        return prisma.blogTag.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            _count: {
              select: {
                posts: {
                  where: {
                    status: 'PUBLISHED',
                    deletedAt: null,
                  },
                },
              },
            },
          },
          orderBy: {
            posts: {
              _count: 'desc',
            },
          },
          take: 20, // En popüler 20 etiket
        })
      }
    )

    const response: BlogTagListResponse = {
      success: true,
      data: tags.map((tag) => ({
        ...tag,
        _count: {
          posts: tag._count.posts,
        },
      })),
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get blog tags error:', error)

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'GET_TAGS_ERROR',
        message: error.message || 'Etiketler yüklenirken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
