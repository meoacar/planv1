import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { TrackingService } from '@/services/tracking.service'
import { weightLogSchema } from '@/validations/tracking.schema'

// GET /api/v1/weight-logs - Get weight logs
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '30')

    const logs = await TrackingService.getWeightLogs(session.user.id, limit)

    return NextResponse.json({
      success: true,
      data: logs,
    })
  } catch (error: any) {
    console.error('Get weight logs error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_WEIGHT_LOGS_ERROR',
          message: error.message || 'Kilo kayıtları yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/weight-logs - Create weight log
export async function POST(req: NextRequest) {
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

    const body = await req.json()

    // Validate
    const validatedData = weightLogSchema.parse(body)

    // Create log
    const log = await TrackingService.createWeightLog(session.user.id, validatedData)

    // Gamification: Award badges for weight loss milestones
    try {
      const { awardBadge, addXP, addLeaguePoints, updateQuestProgress } = await import('@/services/gamification.service')
      const { prisma } = await import('@/lib/db')
      
      // Get user's initial weight and current weight
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { currentWeight: true }
      })
      
      const firstLog = await prisma.weightLog.findFirst({
        where: { userId: session.user.id },
        orderBy: { date: 'asc' }
      })
      
      if (user?.currentWeight && firstLog) {
        const weightLoss = firstLog.weight - validatedData.weight
        
        // Award badges for milestones
        if (weightLoss >= 5) await awardBadge(session.user.id, 'weight_loss_5kg').catch(() => {})
        if (weightLoss >= 10) await awardBadge(session.user.id, 'weight_loss_10kg').catch(() => {})
        if (weightLoss >= 20) await awardBadge(session.user.id, 'weight_loss_20kg').catch(() => {})
        
        // Award league points based on weight loss
        if (weightLoss > 0) {
          await addLeaguePoints(session.user.id, Math.floor(weightLoss * 10))
        }
      }
      
      // Award XP for logging weight
      await addXP(session.user.id, 15, 'Kilo kaydı ekledi')
      
      // Update quest progress
      await updateQuestProgress(session.user.id, 'daily_weigh_in', 1).catch(() => {})
      
      // Add Guild XP
      try {
        const { addGuildXP, GuildXPAction } = await import('@/services/guild-xp.service')
        await addGuildXP(session.user.id, GuildXPAction.DAILY_WEIGH_IN)
      } catch (error) {
        console.error('Guild XP error:', error)
      }
    } catch (error) {
      console.error('Gamification error:', error)
    }

    return NextResponse.json({
      success: true,
      data: log,
    })
  } catch (error: any) {
    console.error('Create weight log error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_WEIGHT_LOG_ERROR',
          message: error.message || 'Kilo kaydı oluşturulurken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
