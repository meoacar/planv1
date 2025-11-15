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

  return {
    totalUsers,
    totalPlans,
    totalComments,
    pendingPlans,
    pendingComments,
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
