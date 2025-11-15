'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getStatistics() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const [
    totalUsers,
    totalPlans,
    totalComments,
    totalLikes,
    newUsersThisWeek,
    newPlansThisWeek,
    topPlans,
  ] = await Promise.all([
    db.user.count(),
    db.plan.count(),
    db.comment.count(),
    db.like.count(),
    db.user.count({ where: { createdAt: { gte: weekAgo } } }),
    db.plan.count({ where: { createdAt: { gte: weekAgo } } }),
    db.plan.findMany({
      take: 10,
      orderBy: { views: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    }),
  ])

  const totalViews = topPlans.reduce((sum, plan) => sum + plan.views, 0)
  const totalEngagement = totalLikes + totalComments

  return {
    totalUsers,
    totalPlans,
    totalComments,
    totalLikes,
    totalViews,
    totalEngagement,
    newUsersThisWeek,
    newPlansThisWeek,
    topPlans,
  }
}


export async function getUserStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [activeUsers, newUsersThisMonth, totalUsers, totalPlans, topUsers] = await Promise.all([
    db.user.count({ where: { updatedAt: { gte: sevenDaysAgo } } }),
    db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    db.user.count(),
    db.plan.count(),
    db.user.findMany({
      take: 10,
      include: {
        _count: { select: { plans: true } },
        plans: {
          select: { views: true, likesCount: true },
        },
      },
      orderBy: { plans: { _count: 'desc' } },
    }),
  ])

  const topUsersWithStats = topUsers.map(user => ({
    ...user,
    totalViews: user.plans.reduce((sum, plan) => sum + plan.views, 0),
    totalLikes: user.plans.reduce((sum, plan) => sum + plan.likesCount, 0),
  }))

  return {
    activeUsers,
    newUsersThisMonth,
    avgPlansPerUser: totalPlans / totalUsers,
    topUsers: topUsersWithStats,
  }
}

export async function getContentStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [publishedPlans, pendingPlans, plansByDifficulty, allPlans] = await Promise.all([
    db.plan.count({ where: { status: 'published' } }),
    db.plan.count({ where: { status: 'pending' } }),
    db.plan.groupBy({
      by: ['difficulty'],
      _count: true,
    }),
    db.plan.findMany({ select: { days: true } }),
  ])

  const avgPlanDuration = allPlans.length > 0
    ? Math.round(allPlans.reduce((sum, plan) => sum + plan.days.length, 0) / allPlans.length)
    : 0

  return {
    publishedPlans,
    pendingPlans,
    avgPlanDuration,
    plansByDifficulty,
  }
}

export async function getEngagementStats() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [totalLikes, totalComments, topEngagedPlans] = await Promise.all([
    db.like.count(),
    db.comment.count(),
    db.plan.findMany({
      take: 10,
      orderBy: { likesCount: 'desc' },
      include: {
        _count: { select: { comments: true } },
        author: {
          select: { id: true, name: true, username: true },
        },
      },
    }),
  ])

  return {
    totalLikes,
    totalComments,
    topEngagedPlans,
  }
}
