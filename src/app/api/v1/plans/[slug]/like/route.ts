import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PlanService } from '@/services/plan.service'
import { NotificationService } from '@/services/notification.service'
import { rateLimit } from '@/lib/redis'

// POST /api/v1/plans/[slug]/like - Like/Unlike plan
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Giriş yapmalısınız',
          },
        },
        { status: 401 }
      )
    }

    // Rate limiting
    const rateLimitKey = `like:${session.user.id}`
    const { success } = await rateLimit(rateLimitKey, 30, 60) // 30 likes per minute

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'Çok fazla beğeni denemesi. Lütfen biraz bekleyin.',
          },
        },
        { status: 429 }
      )
    }

    // Get plan
    const { slug } = await params
    const plan = await PlanService.getPlanBySlug(slug)

    // Like/Unlike
    const result = await PlanService.likePlan(plan.id, session.user.id)

    // Send notification if liked
    if (result.liked) {
      await NotificationService.notifyLike(plan.id, session.user.id)
      
      // Gamification: Update quest progress for likes
      try {
        const { updateQuestProgress } = await import('@/services/gamification.service')
        await updateQuestProgress(session.user.id, 'daily_like', 1).catch(() => {})
      } catch (error) {
        console.error('Gamification error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Like plan error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LIKE_ERROR',
          message: error.message || 'Beğeni işlemi sırasında hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
