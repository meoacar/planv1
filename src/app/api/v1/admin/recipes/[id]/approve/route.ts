import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// PATCH /api/v1/admin/recipes/[id]/approve - Approve recipe
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
        status: 'published',
        publishedAt: new Date(),
      },
    })

    // Create notification for author
    await db.notification.create({
      data: {
        userId: recipe.authorId,
        type: 'plan_approved',
        title: 'Tarifin Onaylandı! 🎉',
        body: `"${recipe.title}" tarifin yayınlandı ve artık herkes görebilir!`,
        targetType: 'plan',
        targetId: recipe.id,
      },
    })

    // Add Guild XP
    try {
      const { addGuildXP, GuildXPAction } = await import('@/services/guild-xp.service')
      await addGuildXP(recipe.authorId, GuildXPAction.RECIPE_SHARE)
    } catch (error) {
      console.error('Guild XP error:', error)
    }

    // Log activity
    await db.activityLog.create({
      data: {
        actorId: session.user.id,
        action: 'approve_recipe',
        entity: 'recipe',
        entityId: recipe.id,
        metadata: JSON.stringify({
          recipeTitle: recipe.title,
          authorId: recipe.authorId,
          authorUsername: recipe.author.username,
        }),
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Approve recipe error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'APPROVE_ERROR',
          message: error.message || 'Tarif onaylanırken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
