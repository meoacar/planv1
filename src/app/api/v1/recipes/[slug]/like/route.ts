import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { RecipeService } from '@/services/recipe.service'

// GET /api/v1/recipes/[slug]/like - Check if user liked
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({
        success: true,
        data: { liked: false },
      })
    }

    const recipe = await RecipeService.getRecipeBySlug(params.slug)
    const liked = await RecipeService.isLiked(recipe.id, session.user.id)

    return NextResponse.json({
      success: true,
      data: { liked },
    })
  } catch (error: any) {
    console.error('Check like error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CHECK_LIKE_ERROR',
          message: error.message || 'Beğeni kontrolü başarısız',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/recipes/[slug]/like - Toggle like
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
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

    const recipe = await RecipeService.getRecipeBySlug(params.slug)
    const result = await RecipeService.likeRecipe(recipe.id, session.user.id)

    // Gamification: Update quest progress for likes
    if (result.liked) {
      try {
        const { updateQuestProgress } = await import('@/services/gamification.service')
        await updateQuestProgress(session.user.id, 'daily_like', 1)
        console.log('✅ Quest progress updated: daily_like')
      } catch (error) {
        console.error('❌ Gamification error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Like recipe error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'LIKE_RECIPE_ERROR',
          message: error.message || 'Beğeni işlemi başarısız',
        },
      },
      { status: 500 }
    )
  }
}
