'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getModerationStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [
    pendingPlans,
    pendingComments,
    reportedContent,
    bannedUsers,
    approvedToday,
    rejectedToday,
  ] = await Promise.all([
    db.plan.count({ where: { status: 'pending' } }),
    db.comment.count({ where: { status: 'pending' } }),
    // Raporlanan içerik (şimdilik 0, gelecekte eklenebilir)
    Promise.resolve(0),
    db.user.count({ where: { isBanned: true } }),
    db.plan.count({
      where: {
        status: 'published',
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    db.plan.count({
      where: {
        status: 'rejected',
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  return {
    pendingPlans,
    pendingComments,
    reportedContent,
    bannedUsers,
    approvedToday,
    rejectedToday,
  }
}

export async function getPendingContent() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [pendingPlans, pendingComments] = await Promise.all([
    db.plan.findMany({
      where: { status: 'pending' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    }),
    db.comment.findMany({
      where: { status: 'pending' },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        plan: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    }),
  ])

  return {
    pendingPlans,
    pendingComments,
  }
}

export async function getBannedUsers() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const bannedUsers = await db.user.findMany({
    where: { isBanned: true },
    take: 20,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          plans: true,
          comments: true,
        },
      },
    },
  })

  return bannedUsers
}

export async function getRecentModerationActions() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [approvedPlans, rejectedPlans, hiddenComments] = await Promise.all([
    db.plan.count({
      where: {
        status: 'published',
        updatedAt: { gte: sevenDaysAgo },
      },
    }),
    db.plan.count({
      where: {
        status: 'rejected',
        updatedAt: { gte: sevenDaysAgo },
      },
    }),
    db.comment.count({
      where: {
        status: 'hidden',
        updatedAt: { gte: sevenDaysAgo },
      },
    }),
  ])

  return {
    approvedPlans,
    rejectedPlans,
    hiddenComments,
  }
}
