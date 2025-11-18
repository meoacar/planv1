import { NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { cache } from '@/lib/redis'
import type {
  BlogFeaturedPostsResponse,
  BlogErrorResponse,
} from '@/types/blog'

// GET /api/blog/featured - Öne çıkan yazılar
export async function GET(): Promise<
  NextResponse<BlogFeaturedPostsResponse | BlogErrorResponse>
> {
  try {
    // Cache featured posts for 5 minutes
    const featuredPosts = await cache(
      'blog:featured:posts',
      300, // 5 minutes
      async () => {
        return prisma.blogPost.findMany({
          where: {
            featured: true,
            status: 'PUBLISHED',
            deletedAt: null,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            coverImageAlt: true,
            readingTime: true,
            viewCount: true,
            publishedAt: true,
            featuredOrder: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
                icon: true,
              },
            },
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            featuredOrder: 'asc',
          },
          take: 3, // Maksimum 3 featured post
        })
      }
    )

    const response: BlogFeaturedPostsResponse = {
      success: true,
      data: featuredPosts,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get featured posts error:', error)

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'GET_FEATURED_POSTS_ERROR',
        message: error.message || 'Öne çıkan yazılar yüklenirken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
