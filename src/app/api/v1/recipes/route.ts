import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { RecipeService } from '@/services/recipe.service'
import { createRecipeSchema } from '@/validations/recipe.schema'
import { rateLimit } from '@/lib/redis'

// GET /api/v1/recipes - List recipes
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const filters = {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') as any,
      mealType: searchParams.get('mealType') as any,
      difficulty: searchParams.get('difficulty') as any,
      maxCalories: searchParams.get('maxCalories') ? parseInt(searchParams.get('maxCalories')!) : undefined,
      authorId: searchParams.get('authorId') || undefined,
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await RecipeService.getRecipes(filters, page, limit)

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.pagination,
    })
  } catch (error: any) {
    console.error('Get recipes error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_RECIPES_ERROR',
          message: error.message || 'Tarifler yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/recipes - Create recipe
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
    const rateLimitKey = `create-recipe:${session.user.id}`
    const { success } = await rateLimit(rateLimitKey, 10, 3600) // 10 recipes per hour

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'Çok fazla tarif oluşturma denemesi. Lütfen 1 saat sonra tekrar deneyin.',
          },
        },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Validate
    const validatedData = createRecipeSchema.parse(body)

    // Create recipe
    const recipe = await RecipeService.createRecipe(session.user.id, validatedData)

    return NextResponse.json({
      success: true,
      data: recipe,
    })
  } catch (error: any) {
    console.error('Create recipe error:', error)

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
          code: 'CREATE_RECIPE_ERROR',
          message: error.message || 'Tarif oluşturulurken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
