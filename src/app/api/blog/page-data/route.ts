import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/blog/page-data - Tüm blog sayfası verilerini tek seferde getir
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)
    const skip = (page - 1) * limit
    
    // Filters
    const categorySlug = searchParams.get('category')
    const tagSlug = searchParams.get('tag')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    
    // Build where clause
    const where: any = {
      status: 'PUBLISHED',
      deletedAt: null,
    }
    
    // Category filter
    if (categorySlug) {
      const category = await db.blogCategory.findUnique({
        where: { slug: categorySlug },
        select: { id: true },
      })
      if (category) where.categoryId = category.id
    }
    
    // Tag filter
    if (tagSlug) {
      where.blog_tags = { some: { slug: tagSlug } }
    }
    
    // Search
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }
    
    // Sorting
    const orderBy: any = sort === 'popular' 
      ? { viewCount: 'desc' } 
      : { publishedAt: 'desc' }
    
    // Tek transaction'da tüm veriyi çek
    const [posts, total, categories, tags, featuredPosts] = await Promise.all([
      // Posts
      db.blogPost.findMany({
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
            take: 3, // Sadece ilk 3 tag
          },
          _count: {
            select: {
              comments: {
                where: { status: 'APPROVED' },
              },
            },
          },
        },
      }),
      
      // Total count
      db.blogPost.count({ where }),
      
      // Categories
      db.blogCategory.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
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
        orderBy: { order: 'asc' },
      }),
      
      // Popular tags
      db.blogTag.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              blog_posts: {
                where: {
                  status: 'PUBLISHED',
                  deletedAt: null,
                },
              },
            },
          },
        },
        orderBy: {
          blog_posts: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
      
      // Featured posts (sadece ana sayfada)
      (!categorySlug && !tagSlug && !search && page === 1)
        ? db.blogPost.findMany({
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
            orderBy: { featuredOrder: 'asc' },
            take: 3,
          })
        : [],
    ])
    
    // Calculate pagination
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      posts: {
        data: posts.map(post => ({
          ...post,
          tags: post.blog_tags, // Rename for frontend compatibility
          commentsCount: post._count.comments,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      categories,
      tags,
      featured: featuredPosts,
    })
  } catch (error: any) {
    console.error('Blog page data error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Veri yüklenirken hata oluştu' 
      },
      { status: 500 }
    )
  }
}
