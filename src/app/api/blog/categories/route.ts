import { NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { cache } from '@/lib/redis'
import type { BlogCategoryListResponse, BlogErrorResponse } from '@/types/blog'

// GET /api/blog/categories - Tüm kategoriler
export async function GET(): Promise<
  NextResponse<BlogCategoryListResponse | BlogErrorResponse>
> {
  try {
    // Cache categories for 10 minutes (they change less frequently)
    const categories = await cache(
      'blog:categories:all',
      600, // 10 minutes
      async () => {
        return prisma.blogCategory.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
            color: true,
            order: true,
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
            order: 'asc',
          },
        })
      }
    )

    const response: BlogCategoryListResponse = {
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        _count: {
          posts: cat._count.posts,
        },
      })),
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get blog categories error:', error)

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'GET_CATEGORIES_ERROR',
        message: error.message || 'Kategoriler yüklenirken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
