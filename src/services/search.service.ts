import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

export interface SearchOptions {
  query: string
  type?: 'all' | 'plans' | 'users'
  page?: number
  limit?: number
  filters?: {
    difficulty?: string
    duration?: string
    tag?: string
  }
}

export interface SearchResults {
  query: string
  plans: any[]
  users: any[]
  plansCount: number
  usersCount: number
  total: number
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export class SearchService {
  /**
   * Gelişmiş arama - FULLTEXT search kullanır (MySQL 5.7+)
   */
  static async searchWithFullText(options: SearchOptions): Promise<SearchResults> {
    const { query, type = 'all', page = 1, limit = 20, filters } = options
    const skip = (page - 1) * limit

    const results: SearchResults = {
      query,
      plans: [],
      users: [],
      plansCount: 0,
      usersCount: 0,
      total: 0,
    }

    // Search Plans with FULLTEXT
    if (type === 'all' || type === 'plans') {
      try {
        // FULLTEXT search için raw query kullanıyoruz
        const searchQuery = query.trim().split(' ').map(word => `+${word}*`).join(' ')
        
        const plansData = await db.$queryRaw<any[]>`
          SELECT 
            p.*,
            MATCH(p.title, p.description) AGAINST(${query} IN NATURAL LANGUAGE MODE) as relevance
          FROM plans p
          WHERE 
            p.status = 'published'
            AND MATCH(p.title, p.description) AGAINST(${query} IN NATURAL LANGUAGE MODE)
            ${filters?.difficulty ? Prisma.sql`AND p.difficulty = ${filters.difficulty}` : Prisma.empty}
            ${filters?.duration === 'short' ? Prisma.sql`AND p.duration BETWEEN 1 AND 7` : Prisma.empty}
            ${filters?.duration === 'medium' ? Prisma.sql`AND p.duration BETWEEN 8 AND 30` : Prisma.empty}
            ${filters?.duration === 'long' ? Prisma.sql`AND p.duration >= 31` : Prisma.empty}
            ${filters?.tag ? Prisma.sql`AND p.tags LIKE ${`%${filters.tag}%`}` : Prisma.empty}
          ORDER BY relevance DESC, p.likesCount DESC, p.views DESC
          LIMIT ${limit} OFFSET ${skip}
        `

        const plansCount = await db.$queryRaw<any[]>`
          SELECT COUNT(*) as count
          FROM plans p
          WHERE 
            p.status = 'published'
            AND MATCH(p.title, p.description) AGAINST(${query} IN NATURAL LANGUAGE MODE)
            ${filters?.difficulty ? Prisma.sql`AND p.difficulty = ${filters.difficulty}` : Prisma.empty}
            ${filters?.duration === 'short' ? Prisma.sql`AND p.duration BETWEEN 1 AND 7` : Prisma.empty}
            ${filters?.duration === 'medium' ? Prisma.sql`AND p.duration BETWEEN 8 AND 30` : Prisma.empty}
            ${filters?.duration === 'long' ? Prisma.sql`AND p.duration >= 31` : Prisma.empty}
            ${filters?.tag ? Prisma.sql`AND p.tags LIKE ${`%${filters.tag}%`}` : Prisma.empty}
        `

        // Author bilgilerini ekle
        const planIds = plansData.map(p => p.id)
        if (planIds.length > 0) {
          const authors = await db.user.findMany({
            where: { id: { in: plansData.map(p => p.authorId) } },
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          })

          results.plans = plansData.map(plan => {
            const author = authors.find(a => a.id === plan.authorId)
            let parsedTags: string[] = []
            if (plan.tags) {
              try {
                parsedTags = Array.isArray(plan.tags) ? plan.tags : JSON.parse(plan.tags)
              } catch (e) {
                parsedTags = []
              }
            }
            return { ...plan, author, tags: parsedTags }
          })
        }

        results.plansCount = plansCount[0]?.count || 0
      } catch (error) {
        console.error('FULLTEXT search error, falling back to LIKE:', error)
        // Fallback to regular search
        const fallbackResults = await this.searchWithLike(options)
        results.plans = fallbackResults.plans
        results.plansCount = fallbackResults.plansCount
      }
    }

    // Search Users
    if (type === 'all' || type === 'users') {
      const [usersData, usersCount] = await Promise.all([
        db.user.findMany({
          where: {
            isBanned: false,
            OR: [
              { username: { contains: query } },
              { name: { contains: query } },
              { bio: { contains: query } },
            ],
          },
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
            _count: {
              select: {
                plans: { where: { status: 'published' } },
                followers: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: type === 'users' ? skip : 0,
          take: type === 'users' ? limit : 5,
        }),
        db.user.count({
          where: {
            isBanned: false,
            OR: [
              { username: { contains: query } },
              { name: { contains: query } },
              { bio: { contains: query } },
            ],
          },
        }),
      ])

      results.users = usersData
      results.usersCount = usersCount
    }

    // Calculate total
    results.total = results.plansCount + results.usersCount

    // Pagination
    if (type === 'plans') {
      results.pagination = {
        page,
        limit,
        total: results.plansCount,
        totalPages: Math.ceil(results.plansCount / limit),
        hasMore: skip + results.plans.length < results.plansCount,
      }
    } else if (type === 'users') {
      results.pagination = {
        page,
        limit,
        total: results.usersCount,
        totalPages: Math.ceil(results.usersCount / limit),
        hasMore: skip + results.users.length < results.usersCount,
      }
    }

    return results
  }

  /**
   * Basit arama - LIKE kullanır (fallback)
   */
  static async searchWithLike(options: SearchOptions): Promise<SearchResults> {
    const { query, type = 'all', page = 1, limit = 20, filters } = options
    const skip = (page - 1) * limit

    const results: SearchResults = {
      query,
      plans: [],
      users: [],
      plansCount: 0,
      usersCount: 0,
      total: 0,
    }

    // Search Plans
    if (type === 'all' || type === 'plans') {
      const where: any = {
        status: 'published',
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } },
        ],
      }

      if (filters?.difficulty) {
        where.difficulty = filters.difficulty
      }

      if (filters?.duration) {
        if (filters.duration === 'short') {
          where.duration = { gte: 1, lte: 7 }
        } else if (filters.duration === 'medium') {
          where.duration = { gte: 8, lte: 30 }
        } else if (filters.duration === 'long') {
          where.duration = { gte: 31 }
        }
      }

      if (filters?.tag) {
        where.tags = { contains: filters.tag }
      }

      const [plansData, plansCount] = await Promise.all([
        db.plan.findMany({
          where,
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: [
            { likesCount: 'desc' },
            { views: 'desc' },
            { createdAt: 'desc' },
          ],
          skip: type === 'plans' ? skip : 0,
          take: type === 'plans' ? limit : 5,
        }),
        db.plan.count({ where }),
      ])

      results.plans = plansData.map(plan => {
        let parsedTags: string[] = []
        if (plan.tags) {
          try {
            parsedTags = Array.isArray(plan.tags) ? plan.tags : JSON.parse(plan.tags)
          } catch (e) {
            parsedTags = []
          }
        }
        return { ...plan, tags: parsedTags }
      })

      results.plansCount = plansCount
    }

    // Search Users (same as above)
    if (type === 'all' || type === 'users') {
      const [usersData, usersCount] = await Promise.all([
        db.user.findMany({
          where: {
            isBanned: false,
            OR: [
              { username: { contains: query } },
              { name: { contains: query } },
              { bio: { contains: query } },
            ],
          },
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
            _count: {
              select: {
                plans: { where: { status: 'published' } },
                followers: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          skip: type === 'users' ? skip : 0,
          take: type === 'users' ? limit : 5,
        }),
        db.user.count({
          where: {
            isBanned: false,
            OR: [
              { username: { contains: query } },
              { name: { contains: query } },
              { bio: { contains: query } },
            ],
          },
        }),
      ])

      results.users = usersData
      results.usersCount = usersCount
    }

    results.total = results.plansCount + results.usersCount

    if (type === 'plans') {
      results.pagination = {
        page,
        limit,
        total: results.plansCount,
        totalPages: Math.ceil(results.plansCount / limit),
        hasMore: skip + results.plans.length < results.plansCount,
      }
    } else if (type === 'users') {
      results.pagination = {
        page,
        limit,
        total: results.usersCount,
        totalPages: Math.ceil(results.usersCount / limit),
        hasMore: skip + results.users.length < results.usersCount,
      }
    }

    return results
  }
}
