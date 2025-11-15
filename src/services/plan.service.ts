import { db } from '@/lib/db'
import { createSlug } from '@/lib/utils'
import { CreatePlanInput, UpdatePlanInput } from '@/validations/plan.schema'
import { PlanFilters } from '@/types'

export class PlanService {
  static async createPlan(userId: string, data: CreatePlanInput) {
    const { title, description, duration, targetWeightLoss, difficulty, tags, authorStory, authorWeightLoss, authorDuration, days } = data

    // Generate unique slug
    let slug = createSlug(title)
    const existingSlug = await db.plan.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    // Create plan with days
    const plan = await db.plan.create({
      data: {
        slug,
        title,
        description,
        authorId: userId,
        duration,
        targetWeightLoss,
        difficulty,
        tags: tags ? JSON.stringify(tags) : null,
        authorStory,
        authorWeightLoss,
        authorDuration,
        status: 'pending', // Needs admin approval
        days: {
          create: days.map((day) => ({
            dayNumber: day.dayNumber,
            breakfast: day.breakfast,
            snack1: day.snack1,
            lunch: day.lunch,
            snack2: day.snack2,
            dinner: day.dinner,
            notes: day.notes,
          })),
        },
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
        days: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    })

    return plan
  }

  static async getPlans(filters: PlanFilters = {}, page = 1, limit = 20) {
    const { search, difficulty, duration, tags, authorId } = filters
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

    if (difficulty) {
      where.difficulty = difficulty
    }

    if (duration) {
      if (duration === 'short') {
        where.duration = { lte: 7 }
      } else if (duration === 'medium') {
        where.duration = { gte: 8, lte: 30 }
      } else if (duration === 'long') {
        where.duration = { gte: 31 }
      }
    }

    if (authorId) {
      where.authorId = authorId
    }

    const [plans, total] = await Promise.all([
      db.plan.findMany({
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
      db.plan.count({ where }),
    ])

    return {
      items: plans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async getPlanBySlug(slug: string) {
    const plan = await db.plan.findUnique({
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
        days: {
          orderBy: { dayNumber: 'asc' },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!plan) {
      throw new Error('Plan bulunamadı')
    }

    // Increment views
    await db.plan.update({
      where: { id: plan.id },
      data: { views: { increment: 1 } },
    })

    return plan
  }

  static async updatePlan(planId: string, userId: string, data: UpdatePlanInput) {
    // Check ownership
    const plan = await db.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      throw new Error('Plan bulunamadı')
    }

    if (plan.authorId !== userId) {
      throw new Error('Bu planı düzenleme yetkiniz yok')
    }

    const { days, tags, ...planData } = data

    // Update plan
    const updated = await db.plan.update({
      where: { id: planId },
      data: {
        ...planData,
        tags: tags ? JSON.stringify(tags) : undefined,
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
        days: {
          orderBy: { dayNumber: 'asc' },
        },
      },
    })

    // Update days if provided
    if (days) {
      // Delete existing days
      await db.planDay.deleteMany({
        where: { planId },
      })

      // Create new days
      await db.planDay.createMany({
        data: days.map((day) => ({
          planId,
          dayNumber: day.dayNumber,
          breakfast: day.breakfast,
          snack1: day.snack1,
          lunch: day.lunch,
          snack2: day.snack2,
          dinner: day.dinner,
          notes: day.notes,
        })),
      })
    }

    return updated
  }

  static async deletePlan(planId: string, userId: string) {
    const plan = await db.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      throw new Error('Plan bulunamadı')
    }

    if (plan.authorId !== userId) {
      throw new Error('Bu planı silme yetkiniz yok')
    }

    await db.plan.delete({
      where: { id: planId },
    })

    return { success: true }
  }

  static async likePlan(planId: string, userId: string) {
    // Check if already liked
    const existing = await db.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'plan',
          targetId: planId,
        },
      },
    })

    if (existing) {
      // Unlike
      await db.like.delete({
        where: { id: existing.id },
      })

      await db.plan.update({
        where: { id: planId },
        data: { likesCount: { decrement: 1 } },
      })

      return { liked: false }
    } else {
      // Like
      await db.like.create({
        data: {
          userId,
          targetType: 'plan',
          targetId: planId,
        },
      })

      await db.plan.update({
        where: { id: planId },
        data: { likesCount: { increment: 1 } },
      })

      return { liked: true }
    }
  }

  static async isLiked(planId: string, userId: string) {
    const like = await db.like.findUnique({
      where: {
        userId_targetType_targetId: {
          userId,
          targetType: 'plan',
          targetId: planId,
        },
      },
    })

    return !!like
  }
}
