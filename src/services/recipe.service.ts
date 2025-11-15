import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { CreateRecipeInput, UpdateRecipeInput } from '@/validations/recipe.schema'
import { RecipeFilters } from '@/types'

export class RecipeService {
  static async createRecipe(userId: string, data: CreateRecipeInput) {
    const { title, description, ingredients, instructions, tags, images, ...recipeData } = data

    // Generate unique slug
    let slug = createSlug(title)
    const existingSlug = await db.recipe.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    // Create recipe
    const recipe = await db.recipe.create({
      data: {
        slug,
        title,
        description,
        authorId: userId,
        ingredients: JSON.stringify(ingredients),
        instructions,
        tags: tags ? JSON.stringify(tags) : null,
        images: images ? JSON.stringify(images) : null,
        status: 'pending', // Needs admin approval
        ...recipeData,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return recipe
  }

  static async getRecipes(filters: RecipeFilters = {}, page = 1, limit = 20) {
    const { search, category, mealType, difficulty, authorId, maxCalories } = filters
    const skip = (page - 1) * limit

    const where: any = {
      status: 'published',
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (mealType) {
      where.mealType = mealType
    }

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (authorId) {
      where.authorId = authorId
    }

    if (maxCalories) {
      where.calories = { lte: maxCalories }
    }

    const [recipes, total] = await Promise.all([
      db.recipe.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.recipe.count({ where }),
    ])

    return {
      items: recipes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getRecipeBySlug(slug: string) {
    const recipe = await db.recipe.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            bio: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!recipe) {
      throw new Error('Tarif bulunamadı')
    }

    // Increment views
    await db.recipe.update({
      where: { id: recipe.id },
      data: { views: { increment: 1 } },
    })

    return recipe
  }

  static async updateRecipe(recipeId: string, userId: string, data: UpdateRecipeInput) {
    // Check ownership
    const recipe = await db.recipe.findUnique({
      where: { id: recipeId },
    })

    if (!recipe) {
      throw new Error('Tarif bulunamadı')
    }

    if (recipe.authorId !== userId) {
      throw new Error('Bu tarifi düzenleme yetkiniz yok')
    }

    const { ingredients, tags, images, ...recipeData } = data

    // Update recipe
    const updated = await db.recipe.update({
      where: { id: recipeId },
      data: {
        ...recipeData,
        ingredients: ingredients ? JSON.stringify(ingredients) : undefined,
        tags: tags ? JSON.stringify(tags) : undefined,
        images: images ? JSON.stringify(images) : undefined,
        status: 'pending', // Re-submit for approval
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    })

    return updated
  }

  static async deleteRecipe(recipeId: string, userId: string) {
    const recipe = await db.recipe.findUnique({
      where: { id: recipeId },
    })

    if (!recipe) {
      throw new Error('Tarif bulunamadı')
    }

    if (recipe.authorId !== userId) {
      throw new Error('Bu tarifi silme yetkiniz yok')
    }

    await db.recipe.delete({
      where: { id: recipeId },
    })

    return { success: true }
  }

  static async likeRecipe(recipeId: string, userId: string) {
    // Check if already liked
    const existing = await db.recipeLike.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    })

    if (existing) {
      // Unlike
      await db.recipeLike.delete({
        where: { id: existing.id },
      })

      await db.recipe.update({
        where: { id: recipeId },
        data: { likesCount: { decrement: 1 } },
      })

      return { liked: false }
    } else {
      // Like
      await db.recipeLike.create({
        data: {
          userId,
          recipeId,
        },
      })

      await db.recipe.update({
        where: { id: recipeId },
        data: { likesCount: { increment: 1 } },
      })

      return { liked: true }
    }
  }

  static async isLiked(recipeId: string, userId: string) {
    const like = await db.recipeLike.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    })

    return !!like
  }

  static async getComments(recipeId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit

    const [comments, total] = await Promise.all([
      db.recipeComment.findMany({
        where: {
          recipeId,
          status: 'visible',
        },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      db.recipeComment.count({
        where: {
          recipeId,
          status: 'visible',
        },
      }),
    ])

    return {
      items: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async addComment(recipeId: string, userId: string, body: string) {
    const comment = await db.recipeComment.create({
      data: {
        recipeId,
        authorId: userId,
        body,
        status: 'visible',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
      },
    })

    // Increment comments count
    await db.recipe.update({
      where: { id: recipeId },
      data: { commentsCount: { increment: 1 } },
    })

    return comment
  }

  static async getFeaturedRecipes(limit = 6) {
    return db.recipe.findMany({
      where: {
        status: 'published',
        isFeatured: true,
      },
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { views: 'desc' },
    })
  }
}
