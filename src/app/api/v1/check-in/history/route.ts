import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import * as gamificationService from '@/services/gamification.service'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Unauthorized', 401)
    }

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '30')

    const history = await gamificationService.getCheckInHistory(session.user.id, limit)

    return successResponse({
      history,
      total: history.length,
    })
  } catch (error: any) {
    console.error('GET /api/v1/check-in/history error:', error)
    return errorResponse('SERVER_ERROR', error.message || 'Failed to fetch check-in history', 500)
  }
}
