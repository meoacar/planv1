import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PlanService } from '@/services/plan.service'
import { updatePlanSchema } from '@/validations/plan.schema'

// GET /api/v1/plans/[slug] - Get plan detail
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const plan = await PlanService.getPlanBySlug(slug)

    return NextResponse.json({
      success: true,
      data: plan,
    })
  } catch (error: any) {
    console.error('Get plan error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_PLAN_ERROR',
          message: error.message || 'Plan yüklenirken hata oluştu',
        },
      },
      { status: 404 }
    )
  }
}

// PATCH /api/v1/plans/[slug] - Update plan
export async function PATCH(
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

    const body = await req.json()

    // Validate
    const validatedData = updatePlanSchema.parse(body)

    // Get plan ID from slug
    const { slug } = await params
    const existingPlan = await PlanService.getPlanBySlug(slug)

    // Update plan
    const plan = await PlanService.updatePlan(
      existingPlan.id,
      session.user.id,
      validatedData
    )

    return NextResponse.json({
      success: true,
      data: plan,
    })
  } catch (error: any) {
    console.error('Update plan error:', error)

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
          code: 'UPDATE_PLAN_ERROR',
          message: error.message || 'Plan güncellenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/plans/[slug] - Delete plan
export async function DELETE(
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

    // Get plan ID from slug
    const { slug } = await params
    const existingPlan = await PlanService.getPlanBySlug(slug)

    // Delete plan
    await PlanService.deletePlan(existingPlan.id, session.user.id)

    return NextResponse.json({
      success: true,
      data: { message: 'Plan silindi' },
    })
  } catch (error: any) {
    console.error('Delete plan error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_PLAN_ERROR',
          message: error.message || 'Plan silinirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
