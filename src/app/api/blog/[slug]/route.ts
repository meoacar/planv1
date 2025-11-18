import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { cache } from '@/lib/redis'
import type { BlogPostDetailResponse, BlogErrorResponse } from '@/types/blog'

// GET /api/blog/[slug] - Blog detay
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<BlogPostDetailResponse | BlogErrorResponse>> {
  try {
    const { slug } = await params

    // Cache blog post for 10 minutes
    const cacheKey = `blog:post:${slug}`
    const cachedData = await cache(
      cacheKey,
      600, // 10 minutes
      async () => {
        // Fetch blog post
        const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        coverImage: true,
        coverImageAlt: true,
        metaTitle: true,
        metaDescription: true,
        readingTime: true,
        viewCount: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
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
        blog_tags: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            comments: {
              where: {
                status: 'APPROVED',
              },
            },
          },
        },
      },
    })

        // 404 if not found
        if (!post) {
          return null
        }

        // Fetch related posts (same category, exclude current post)
        const relatedPosts = await prisma.blogPost.findMany({
          where: {
            categoryId: post.category.id,
            id: { not: post.id },
            status: 'PUBLISHED',
            deletedAt: null,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            readingTime: true,
            viewCount: true,
            publishedAt: true,
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true,
              },
            },
          },
          orderBy: {
            viewCount: 'desc',
          },
          take: 3,
        })

        // Return formatted data
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          coverImage: post.coverImage,
          coverImageAlt: post.coverImageAlt,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          readingTime: post.readingTime,
          viewCount: post.viewCount,
          publishedAt: post.publishedAt,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          category: post.category,
          author: post.author,
          tags: post.blog_tags,
          commentsCount: post._count.comments,
          relatedPosts,
        }
      }
    )

    // Check if post was found
    if (!cachedData) {
      const errorResponse: BlogErrorResponse = {
        success: false,
        error: {
          code: 'BLOG_POST_NOT_FOUND',
          message: 'Blog yazısı bulunamadı',
        },
      }
      return NextResponse.json(errorResponse, { status: 404 })
    }

    // Format response
    const response: BlogPostDetailResponse = {
      success: true,
      data: cachedData,
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get blog post detail error:', error)

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'GET_BLOG_POST_ERROR',
        message: error.message || 'Blog yazısı yüklenirken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
