import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { db as prisma } from '@/lib/db'

// Development only: Reset today's quests
export async function POST(req: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return errorResponse('FORBIDDEN', 'Not allowed in production', 403)
    }

    const session = await auth()
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Unauthorized', 401)
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Delete today's quest progress
    const result = await prisma.userDailyQuest.deleteMany({
      where: {
        userId: session.user.id,
        date: { gte: today },
      },
    })

    return successResponse({
      message: 'Quests reset successfully',
      deleted: result.count,
    })
  } catch (error: any) {
    console.error('POST /api/v1/quests/reset error:', error)
    return errorResponse('SERVER_ERROR', error.message || 'Failed to reset quests', 500)
  }
}
