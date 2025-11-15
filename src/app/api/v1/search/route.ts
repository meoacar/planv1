import { NextRequest, NextResponse } from 'next/server'
import { SearchService } from '@/services/search.service'

/**
 * GET /api/v1/search
 * 
 * Gelişmiş arama endpoint'i - FULLTEXT search kullanır
 * 
 * Query Parameters:
 * - q: Arama terimi (required, min 2 karakter)
 * - type: Arama tipi (all, plans, users) - default: all
 * - page: Sayfa numarası - default: 1
 * - limit: Sayfa başına sonuç - default: 20
 * - difficulty: Plan zorluğu (easy, medium, hard)
 * - duration: Plan süresi (short, medium, long)
 * - tag: Tag filtresi
 * 
 * Response:
 * {
 *   query: string,
 *   plans: Plan[],
 *   users: User[],
 *   plansCount: number,
 *   usersCount: number,
 *   total: number,
 *   pagination?: { page, limit, total, totalPages, hasMore }
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = (searchParams.get('type') || 'all') as 'all' | 'plans' | 'users'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Validation
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Arama terimi en az 2 karakter olmalıdır' },
        { status: 400 }
      )
    }

    if (!['all', 'plans', 'users'].includes(type)) {
      return NextResponse.json(
        { error: 'Geçersiz arama tipi. Kullanılabilir: all, plans, users' },
        { status: 400 }
      )
    }

    // Filters
    const filters: any = {}
    const difficulty = searchParams.get('difficulty')
    const duration = searchParams.get('duration')
    const tag = searchParams.get('tag')

    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filters.difficulty = difficulty
    }

    if (duration && ['short', 'medium', 'long'].includes(duration)) {
      filters.duration = duration
    }

    if (tag) {
      filters.tag = tag
    }

    // Perform search with FULLTEXT
    const results = await SearchService.searchWithFullText({
      query: query.trim(),
      type,
      page,
      limit,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Arama sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
