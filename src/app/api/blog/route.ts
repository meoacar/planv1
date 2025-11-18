import { NextRequest, NextResponse } from 'next/server'
import { db as prisma } from '@/lib/db'
import { cache } from '@/lib/redis'
import type { BlogPostListResponse, BlogErrorResponse } from '@/types/blog'

// GET /api/blog - Blog listesi
export async function GET(req: NextRequest): Promise<NextResponse<BlogPostListResponse | BlogErrorResponse>> {
  try {
    const { searchParams } = new URL(req.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50) // Max 50
    const skip = (page - 1) * limit
    
    // Filters
    const categorySlug = searchParams.get('category')
    const tagSlug = searchParams.get('tag')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest' // newest, popular
    
    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
    }
    
    // Category filter
    if (categorySlug) {
      const category = await prisma.blogCategory.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      })
      
      if (category) {
        where.categoryId = category.id
      }
    }
    
    // Tag filter
    if (tagSlug) {
      where.tags = {
        some: {
          slug: tagSlug,
        },
      }
    }
    
    // Search
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } },
        {
          blog_tags: {
            some: {
              name: { contains: search },
            },
          },
        },
      ]
    }
    
    // Sorting
    let orderBy: any = { publishedAt: 'desc' } // Default: newest
    
    if (sort === 'popular') {
      orderBy = { viewCount: 'desc' }
    }
    
    // Create cache key based on query params
    const cacheKey = `blog:list:${page}:${limit}:${categorySlug || 'all'}:${tagSlug || 'all'}:${search || 'all'}:${sort}`
    
    // Fetch posts with cache (5 minutes TTL)
    const [posts, total] = await cache(
      cacheKey,
      300, // 5 minutes
      async () => {
        return Promise.all([
          prisma.blogPost.findMany({
            where,
            orderBy,
            skip,
            take: limit,
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
              createdAt: true,
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
          }),
          prisma.blogPost.count({ where }),
        ])
      }
    )
    
    // Calculate pagination
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    // Format response according to BlogPostListResponse type
    const response: BlogPostListResponse = {
      success: true,
      data: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        coverImageAlt: post.coverImageAlt,
        readingTime: post.readingTime,
        viewCount: post.viewCount,
        publishedAt: post.publishedAt,
        createdAt: post.createdAt,
        category: post.category,
        author: post.author,
        tags: post.tags,
        commentsCount: post._count.comments,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    }
    
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Get blog posts error:', error)

    const errorResponse: BlogErrorResponse = {
      success: false,
      error: {
        code: 'GET_BLOG_POSTS_ERROR',
        message: error.message || 'Blog yazıları yüklenirken hata oluştu',
      },
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
