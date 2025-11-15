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
