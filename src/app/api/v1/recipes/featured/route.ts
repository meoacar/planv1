import { NextRequest, NextResponse } from 'next/server'
import { RecipeService } from '@/services/recipe.service'

// GET /api/v1/recipes/featured - Get featured recipes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '6')

    const recipes = await RecipeService.getFeaturedRecipes(limit)

    return NextResponse.json({
      success: true,
      data: recipes,
    })
  } catch (error: any) {
    console.error('Get featured recipes error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_FEATURED_RECIPES_ERROR',
          message: error.message || 'Öne çıkan tarifler yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
