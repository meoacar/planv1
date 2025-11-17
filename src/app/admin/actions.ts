'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getAdminStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [
    totalUsers,
    totalPlans,
    totalComments,
    pendingPlans,
    pendingComments,
    newUsersToday,
    newPlansToday,
  ] = await Promise.all([
    db.user.count(),
    db.plan.count(),
    db.comment.count(),
    db.plan.count({ where: { status: 'pending' } }),
    db.comment.count({ where: { status: 'pending' } }),
    db.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    db.plan.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  // Try to get pending appeals count, fallback to 0 if table doesn't exist yet
  let pendingAppeals = 0
  try {
    if (db.contentAppeal) {
      pendingAppeals = await db.contentAppeal.count({ where: { status: 'pending' } })
    }
  } catch (error) {
    // Table doesn't exist yet, migration not applied
    console.log('ContentAppeal table not found - migration not applied yet')
  }

  return {
    totalUsers,
    totalPlans,
    totalComments,
    pendingPlans,
    pendingComments,
    pendingAppeals,
    newUsersToday,
    newPlansToday,
  }
}

export async function getRecentActivity() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    return []
  }

  const recentPlans = await db.plan.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          username: true,
          name: true,
        },
      },
    },
  })

  return recentPlans
}

export async function getPopularPlans() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    return []
  }

  const popularPlans = await db.plan.findMany({
    where: { status: 'published' },
    take: 3,
    orderBy: { views: 'desc' },
    include: {
      author: {
        select: {
          username: true,
          name: true,
        },
      },
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  })

  return popularPlans
}

export async function getGrowthStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    return {
      userGrowth: 0,
      planGrowth: 0,
      engagementGrowth: 0,
    }
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  // Get counts for last 30 days
  const [usersLast30, plansLast30, commentsLast30, likesLast30] = await Promise.all([
    db.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    db.plan.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    db.comment.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    db.like.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
  ])

  // Get counts for previous 30 days (30-60 days ago)
  const [usersPrevious30, plansPrevious30, commentsPrevious30, likesPrevious30] = await Promise.all([
    db.user.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    db.plan.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    db.comment.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
    db.like.count({
      where: {
        createdAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    }),
  ])

  // Calculate growth percentages
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  const userGrowth = calculateGrowth(usersLast30, usersPrevious30)
  const planGrowth = calculateGrowth(plansLast30, plansPrevious30)
  
  // Engagement = comments + likes
  const engagementLast30 = commentsLast30 + likesLast30
  const engagementPrevious30 = commentsPrevious30 + likesPrevious30
  const engagementGrowth = calculateGrowth(engagementLast30, engagementPrevious30)

  return {
    userGrowth,
    planGrowth,
    engagementGrowth,
    usersLast30,
    plansLast30,
    engagementLast30,
  }
}
