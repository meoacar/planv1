import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { RecipeService } from '@/services/recipe.service'

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
