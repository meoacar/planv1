import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { RecipeService } from '@/services/recipe.service'
import { recipeCommentSchema } from '@/validations/recipe.schema'

// GET /api/v1/recipes/[slug]/comments - Get comments
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const recipe = await RecipeService.getRecipeBySlug(slug)
    const result = await RecipeService.getComments(recipe.id, page, limit)

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.pagination,
    })
  } catch (error: any) {
    console.error('Get comments error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_COMMENTS_ERROR',
          message: error.message || 'Yorumlar yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/recipes/[slug]/comments - Add comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
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
    const validatedData = recipeCommentSchema.parse(body)

    const recipe = await RecipeService.getRecipeBySlug(slug)
    const comment = await RecipeService.addComment(recipe.id, session.user.id, validatedData.body)

    // Add Guild XP
    try {
      const { addGuildXP, GuildXPAction } = await import('@/services/guild-xp.service')
      await addGuildXP(session.user.id, GuildXPAction.COMMENT)
    } catch (error) {
      console.error('Guild XP error:', error)
    }

    return NextResponse.json({
      success: true,
      data: comment,
    })
  } catch (error: any) {
    console.error('Add comment error:', error)

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
          code: 'ADD_COMMENT_ERROR',
          message: error.message || 'Yorum eklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
