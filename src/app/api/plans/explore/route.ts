import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const query = searchParams.get('q') || ''
    const difficulty = searchParams.get('difficulty')
    const duration = searchParams.get('duration')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') || 'popular'
    const filter = searchParams.get('filter') || 'all'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: 'published',
    }

    // Search query - MySQL case-insensitive by default
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
      ]
    }

    // Difficulty filter
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      where.difficulty = difficulty
    }

    // Duration filter
    if (duration) {
      if (duration === 'short') {
        where.duration = { gte: 1, lte: 7 }
      } else if (duration === 'medium') {
        where.duration = { gte: 8, lte: 30 }
      } else if (duration === 'long') {
        where.duration = { gte: 31 }
      }
    }

    // Tag filter - MySQL JSON search
    if (tag) {
      where.tags = {
        contains: tag
      }
    }

    // Apply filter-based ordering
    let orderBy: any = { createdAt: 'desc' }
    
    if (filter === 'trending') {
      // Trending: combination of recent activity and engagement
      orderBy = [
        { likesCount: 'desc' },
        { views: 'desc' },
        { createdAt: 'desc' },
      ]
    } else if (filter === 'popular') {
      orderBy = [
        { likesCount: 'desc' },
        { commentsCount: 'desc' },
      ]
    } else if (filter === 'new') {
      orderBy = { createdAt: 'desc' }
    } else {
      // Default sorting based on sort parameter
      if (sort === 'popular') {
        orderBy = [
          { likesCount: 'desc' },
          { views: 'desc' },
        ]
      } else if (sort === 'newest') {
        orderBy = { createdAt: 'desc' }
      } else if (sort === 'likes') {
        orderBy = { likesCount: 'desc' }
      } else if (sort === 'views') {
        orderBy = { views: 'desc' }
      }
    }

    // Fetch plans
    const [plansData, total] = await Promise.all([
      db.plan.findMany({
        where,
        include: {
          author: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      db.plan.count({ where }),
    ])

    // Parse tags from JSON string to array
    const plans = plansData.map(plan => {
      let parsedTags: string[] = []
      
      if (plan.tags) {
        try {
          // If it's already an array, use it
          if (Array.isArray(plan.tags)) {
            parsedTags = plan.tags
          } 
          // If it's a string, try to parse it as JSON
          else if (typeof plan.tags === 'string') {
            parsedTags = JSON.parse(plan.tags)
          }
        } catch (e) {
          // If parsing fails, treat it as empty array
          parsedTags = []
        }
      }
      
      return {
        ...plan,
        tags: parsedTags
      }
    })

    const hasMore = skip + plans.length < total

    return NextResponse.json({
      plans,
      hasMore,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { error: 'Planlar yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
