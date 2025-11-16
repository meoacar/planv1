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
