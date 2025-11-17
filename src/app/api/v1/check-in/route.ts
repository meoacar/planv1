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

    // Update streak
    const result = await gamificationService.updateStreak(session.user.id)

    // Update quest progress
    try {
      await gamificationService.updateQuestProgress(session.user.id, 'daily_check_in', 1)
      console.log('✅ Quest progress updated: daily_check_in')
    } catch (error) {
      console.error('❌ Quest progress error:', error)
    }

    return successResponse({
      message: 'Check-in successful',
      streak: result.streak,
      continued: result.continued,
    })
  } catch (error: any) {
    console.error('POST /api/v1/check-in error:', error)
    return errorResponse('SERVER_ERROR', error.message || 'Check-in failed', 500)
  }
}
