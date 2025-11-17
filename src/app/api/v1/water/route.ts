import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import * as gamificationService from '@/services/gamification.service'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Unauthorized', 401)
    }

    const body = await req.json()
    const { increment = 1 } = body

    // Update quest progress
    await gamificationService.updateQuestProgress(session.user.id, 'daily_water', increment)
    console.log('✅ Quest progress updated: daily_water')

    return successResponse({
      message: 'Water logged successfully',
    })
  } catch (error: any) {
    console.error('POST /api/v1/water error:', error)
    return errorResponse('SERVER_ERROR', error.message || 'Water logging failed', 500)
  }
}
