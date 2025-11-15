import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { RecipeService } from '@/services/recipe.service'
import { updateRecipeSchema } from '@/validations/recipe.schema'

// GET /api/v1/recipes/[slug] - Get recipe by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const recipe = await RecipeService.getRecipeBySlug(params.slug)

    return NextResponse.json({
      success: true,
      data: recipe,
    })
  } catch (error: any) {
    console.error('Get recipe error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_RECIPE_ERROR',
          message: error.message || 'Tarif yüklenirken hata oluştu',
        },
      },
      { status: error.message === 'Tarif bulunamadı' ? 404 : 500 }
    )
  }
}

// PATCH /api/v1/recipes/[slug] - Update recipe
export async function PATCH(
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

    // Get recipe to check ownership
    const recipe = await RecipeService.getRecipeBySlug(params.slug)

    const body = await req.json()
    const validatedData = updateRecipeSchema.parse(body)

    const updated = await RecipeService.updateRecipe(recipe.id, session.user.id, validatedData)

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Update recipe error:', error)

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
          code: 'UPDATE_RECIPE_ERROR',
          message: error.message || 'Tarif güncellenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/recipes/[slug] - Delete recipe
export async function DELETE(
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
    await RecipeService.deleteRecipe(recipe.id, session.user.id)

    return NextResponse.json({
      success: true,
      data: { message: 'Tarif silindi' },
    })
  } catch (error: any) {
    console.error('Delete recipe error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_RECIPE_ERROR',
          message: error.message || 'Tarif silinirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
