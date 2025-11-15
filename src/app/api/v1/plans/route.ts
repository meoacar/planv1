import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PlanService } from '@/services/plan.service'
import { createPlanSchema } from '@/validations/plan.schema'
import { rateLimit } from '@/lib/redis'

// GET /api/v1/plans - List plans
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const filters = {
      search: searchParams.get('search') || undefined,
      difficulty: searchParams.get('difficulty') as any,
      duration: searchParams.get('duration') as any,
      authorId: searchParams.get('authorId') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await PlanService.getPlans(filters, page, limit)

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.pagination,
    })
  } catch (error: any) {
    console.error('Get plans error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_PLANS_ERROR',
          message: error.message || 'Planlar yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/plans - Create plan
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

    // Rate limiting
    const rateLimitKey = `create-plan:${session.user.id}`
    const { success } = await rateLimit(rateLimitKey, 10, 3600) // 10 plans per hour

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'Çok fazla plan oluşturma denemesi. Lütfen 1 saat sonra tekrar deneyin.',
          },
        },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Validate
    const validatedData = createPlanSchema.parse(body)

    // Create plan
    const plan = await PlanService.createPlan(session.user.id, validatedData)

    return NextResponse.json({
      success: true,
      data: plan,
    })
  } catch (error: any) {
    console.error('Create plan error:', error)

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
          code: 'CREATE_PLAN_ERROR',
          message: error.message || 'Plan oluşturulurken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
