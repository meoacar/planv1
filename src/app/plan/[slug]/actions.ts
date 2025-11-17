'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleLike(planId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Giriş yapmalısınız')
  }

  // Check if already liked
  const existingLike = await db.like.findUnique({
    where: {
      userId_targetType_targetId: {
        userId: session.user.id,
        targetType: 'plan',
        targetId: planId,
      },
    },
  })

  if (existingLike) {
    // Unlike
    await db.$transaction([
      db.like.delete({
        where: { id: existingLike.id },
      }),
      db.plan.update({
        where: { id: planId },
        data: { likesCount: { decrement: 1 } },
      }),
    ])
  } else {
    // Like
    await db.$transaction([
      db.like.create({
        data: {
          userId: session.user.id,
          targetType: 'plan',
          targetId: planId,
        },
      }),
      db.plan.update({
        where: { id: planId },
        data: { likesCount: { increment: 1 } },
      }),
    ])

    // Gamification: Update quest progress for likes
    try {
      const { updateQuestProgress } = await import('@/services/gamification.service')
      await updateQuestProgress(session.user.id, 'daily_like', 1)
      console.log('✅ Quest progress updated: daily_like')
    } catch (error) {
      console.error('❌ Gamification error:', error)
    }
  }

  revalidatePath(`/plan/[slug]`, 'page')
  return { success: true }
}

export async function addComment(planId: string, body: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Giriş yapmalısınız')
  }

  if (!body.trim()) {
    throw new Error('Yorum boş olamaz')
  }

  // Create comment with pending status (requires moderation)
  await db.comment.create({
    data: {
      authorId: session.user.id,
      targetType: 'plan',
      targetId: planId,
      body: body.trim(),
      status: 'pending', // Yorumlar admin onayı bekler
    },
  })

  // Gamification: Update quest progress for comments
  try {
    const { updateQuestProgress } = await import('@/services/gamification.service')
    await updateQuestProgress(session.user.id, 'daily_comment', 1)
    console.log('✅ Quest progress updated: daily_comment')
  } catch (error) {
    console.error('❌ Gamification error:', error)
  }

  // Note: commentsCount is NOT incremented until comment is approved
  // This will be done by admin when approving the comment

  revalidatePath(`/plan/[slug]`, 'page')
  return { success: true }
}

export async function incrementViews(planId: string, userId?: string, ip?: string) {
  // Don't increment if no identifier
  if (!userId && !ip) {
    return
  }

  // Create a unique key for this view
  const viewKey = userId 
    ? `plan:${planId}:view:user:${userId}`
    : `plan:${planId}:view:ip:${ip}`

  try {
    const { redis } = await import('@/lib/redis')
    
    // Check if Redis is available and connected
    if (!redis || !redis.isOpen) {
      // Redis not available, use database-based view tracking
      // Check if view exists in last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      
      // For logged-in users, check by userId
      if (userId) {
        const recentView = await db.planView.findFirst({
          where: {
            planId,
            userId,
            viewedAt: { gte: oneDayAgo },
          },
        })
        
        if (recentView) {
          // Already viewed in last 24 hours
          return
        }
        
        // Create view record and increment count
        await db.$transaction([
          db.planView.create({
            data: {
              planId,
              userId,
              viewedAt: new Date(),
            },
          }),
          db.plan.update({
            where: { id: planId },
            data: { views: { increment: 1 } },
          }),
        ])
      } else {
        // For anonymous users, check by IP
        const recentView = await db.planView.findFirst({
          where: {
            planId,
            ipAddress: ip,
            viewedAt: { gte: oneDayAgo },
          },
        })
        
        if (recentView) {
          // Already viewed in last 24 hours
          return
        }
        
        // Create view record and increment count
        await db.$transaction([
          db.planView.create({
            data: {
              planId,
              ipAddress: ip,
              viewedAt: new Date(),
            },
          }),
          db.plan.update({
            where: { id: planId },
            data: { views: { increment: 1 } },
          }),
        ])
      }
      return
    }
    
    // Redis is available, use it for faster checks
    const hasViewed = await redis.get(viewKey)
    
    if (hasViewed) {
      // Already viewed within the time window, don't increment
      return
    }

    // Set the view flag with 24 hour expiration (86400 seconds)
    await redis.setEx(viewKey, 86400, '1')

    // Increment the view count in database
    await db.plan.update({
      where: { id: planId },
      data: { views: { increment: 1 } },
    })
  } catch (error) {
    // If everything fails, log but don't increment (better than spam)
    console.error('Error in incrementViews:', error)
  }
}

export async function savePlan(planId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Giriş yapmalısınız')
  }

  // Check if already saved
  const existingSave = await db.favorite.findUnique({
    where: {
      userId_targetType_targetId: {
        userId: session.user.id,
        targetType: 'plan',
        targetId: planId,
      },
    },
  })

  if (existingSave) {
    // Remove from favorites
    await db.favorite.delete({
      where: { id: existingSave.id },
    })
  } else {
    // Add to favorites
    await db.favorite.create({
      data: {
        userId: session.user.id,
        targetType: 'plan',
        targetId: planId,
      },
    })
  }

  revalidatePath(`/plan/[slug]`, 'page')
  return { success: true }
}

export async function ratePlan(planId: string, rating: number) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Giriş yapmalısınız')
  }

  if (rating < 1 || rating > 5) {
    throw new Error('Geçersiz puan')
  }

  // Check if already rated
  const existingRating = await db.planRating.findUnique({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId: planId,
      },
    },
  })

  if (existingRating) {
    // Update rating
    await db.planRating.update({
      where: { id: existingRating.id },
      data: { rating },
    })
  } else {
    // Create new rating
    await db.planRating.create({
      data: {
        userId: session.user.id,
        planId: planId,
        rating,
      },
    })
  }

  // Recalculate average rating
  const ratings = await db.planRating.findMany({
    where: { planId },
  })

  const averageRating = ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length

  await db.plan.update({
    where: { id: planId },
    data: {
      averageRating,
      ratingCount: ratings.length,
    },
  })

  revalidatePath(`/plan/[slug]`, 'page')
  return { success: true }
}

export async function trackProgress(planId: string, day: number) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error('Giriş yapmalısınız')
  }

  // Check if progress exists
  const existingProgress = await db.planProgress.findUnique({
    where: {
      userId_planId: {
        userId: session.user.id,
        planId: planId,
      },
    },
  })

  if (existingProgress) {
    // Update progress
    await db.planProgress.update({
      where: { id: existingProgress.id },
      data: {
        currentDay: day,
        lastUpdated: new Date(),
      },
    })
  } else {
    // Create new progress
    await db.planProgress.create({
      data: {
        userId: session.user.id,
        planId: planId,
        currentDay: day,
      },
    })
  }

  revalidatePath(`/plan/[slug]`, 'page')
  return { success: true }
}
