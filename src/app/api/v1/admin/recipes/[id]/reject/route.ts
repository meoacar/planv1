import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const rejectSchema = z.object({
  reason: z.string().min(10, 'Reddetme sebebi en az 10 karakter olmalı'),
})

// PATCH /api/v1/admin/recipes/[id]/reject - Reject recipe
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Bu işlem için yetkiniz yok',
          },
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { reason } = rejectSchema.parse(body)

    const recipe = await db.recipe.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Tarif bulunamadı',
          },
        },
        { status: 404 }
      )
    }

    // Update recipe status
    const updated = await db.recipe.update({
      where: { id: params.id },
      data: {
        status: 'rejected',
        rejectionReason: reason,
      },
    })

    // Create notification for author
    await db.notification.create({
      data: {
        userId: recipe.authorId,
        type: 'plan_rejected',
        title: 'Tarifin Reddedildi',
        body: `"${recipe.title}" tarifin reddedildi. Sebep: ${reason}`,
        targetType: 'plan',
        targetId: recipe.id,
      },
    })

    // Log activity
    await db.activityLog.create({
      data: {
        actorId: session.user.id,
        action: 'reject_recipe',
        entity: 'recipe',
        entityId: recipe.id,
        metadata: JSON.stringify({
          recipeTitle: recipe.title,
          authorId: recipe.authorId,
          authorUsername: recipe.author.username,
          reason,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Reject recipe error:', error)

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
          code: 'REJECT_ERROR',
          message: error.message || 'Tarif reddedilirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
