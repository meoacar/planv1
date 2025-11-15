'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getRecipesForModeration(
  status: string = 'all',
  page: number = 1,
  search?: string
) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const limit = 20
  const skip = (page - 1) * limit

  const where: any = {}

  if (status !== 'all') {
    where.status = status
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ]
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
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    db.recipe.count({ where }),
  ])

  return { recipes, total }
}

export async function approveRecipe(recipeId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.recipe.update({
    where: { id: recipeId },
    data: {
      status: 'published',
      publishedAt: new Date(),
    },
  })

  revalidatePath('/admin/tarifler')
  revalidatePath('/tarifler')

  return { success: true }
}

export async function rejectRecipe(recipeId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.recipe.update({
    where: { id: recipeId },
    data: {
      status: 'rejected',
    },
  })

  revalidatePath('/admin/tarifler')

  return { success: true }
}

export async function deleteRecipe(recipeId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.recipe.delete({
    where: { id: recipeId },
  })

  revalidatePath('/admin/tarifler')
  revalidatePath('/tarifler')

  return { success: true }
}

export async function toggleFeatured(recipeId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const recipe = await db.recipe.findUnique({
    where: { id: recipeId },
    select: { isFeatured: true },
  })

  await db.recipe.update({
    where: { id: recipeId },
    data: {
      isFeatured: !recipe?.isFeatured,
    },
  })

  revalidatePath('/admin/tarifler')
  revalidatePath('/tarifler')

  return { success: true }
}
