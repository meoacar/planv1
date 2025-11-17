import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import * as gamificationService from '@/services/gamification.service'

// Test endpoint to manually update quest progress
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Unauthorized', 401)
    }

    const body = await req.json()
    const { questKey, increment = 1 } = body

    if (!questKey) {
      return errorResponse('VALIDATION_ERROR', 'Quest key is required', 400)
    }
    
    const result = await gamificationService.updateQuestProgress(
      session.user.id,
      questKey,
      increment
    )

    return successResponse({
      message: 'Quest progress updated',
      progress: result.progress,
      completed: result.completed,
    })
  } catch (error: any) {
    console.error('POST /api/v1/quests/test-progress error:', error)
    return errorResponse('SERVER_ERROR', error.message || 'Failed to update quest progress', 500)
  }
}
