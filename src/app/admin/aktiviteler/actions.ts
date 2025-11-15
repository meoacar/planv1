'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getRecentActivity(filters?: {
  type?: string
  search?: string
  page?: number
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const page = filters?.page || 1
  const take = 50
  const skip = (page - 1) * take

  // Farklı aktivite tiplerini birleştir
  const [plans, comments, users] = await Promise.all([
    // Plan aktiviteleri
    db.plan.findMany({
      take: filters?.type === 'plan' ? take : 20,
      skip: filters?.type === 'plan' ? skip : 0,
      orderBy: { createdAt: 'desc' },
      where: filters?.search ? {
        OR: [
          { title: { contains: filters.search } },
          { author: { name: { contains: filters.search } } },
        ],
      } : undefined,
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
    // Yorum aktiviteleri
    db.comment.findMany({
      take: filters?.type === 'comment' ? take : 20,
      skip: filters?.type === 'comment' ? skip : 0,
      orderBy: { createdAt: 'desc' },
      where: filters?.search ? {
        OR: [
          { body: { contains: filters.search } },
          { author: { name: { contains: filters.search } } },
        ],
      } : undefined,
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
    // Kullanıcı aktiviteleri
    db.user.findMany({
      take: filters?.type === 'user' ? take : 20,
      skip: filters?.type === 'user' ? skip : 0,
      orderBy: { createdAt: 'desc' },
      where: filters?.search ? {
        OR: [
          { name: { contains: filters.search } },
          { email: { contains: filters.search } },
          { username: { contains: filters.search } },
        ],
      } : undefined,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ])

  // Aktiviteleri birleştir ve formatla
  const activities = [
    ...plans.map(plan => ({
      id: `plan-${plan.id}`,
      type: 'plan' as const,
      action: plan.status === 'published' ? 'published' : plan.status === 'pending' ? 'created' : 'rejected',
      title: plan.title,
      description: `${plan.author.name || plan.author.email} tarafından oluşturuldu`,
      user: plan.author,
      metadata: {
        status: plan.status,
        views: plan.views,
        likes: plan.likesCount,
        slug: plan.slug,
      },
      createdAt: plan.createdAt,
    })),
    ...comments.map(comment => ({
      id: `comment-${comment.id}`,
      type: 'comment' as const,
      action: 'created',
      title: `"${comment.plan?.title}" planına yorum`,
      description: comment.body.substring(0, 100) + (comment.body.length > 100 ? '...' : ''),
      user: comment.author,
      metadata: {
        status: comment.status,
        planTitle: comment.plan?.title,
        planSlug: comment.plan?.slug,
      },
      createdAt: comment.createdAt,
    })),
    ...users.map(user => ({
      id: `user-${user.id}`,
      type: 'user' as const,
      action: 'registered',
      title: `${user.name || user.email} kaydoldu`,
      description: `Yeni kullanıcı: ${user.email}`,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      metadata: {
        role: user.role,
      },
      createdAt: user.createdAt,
    })),
  ]

  // Tarihe göre sırala
  activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // Tip filtreleme
  const filteredActivities = filters?.type
    ? activities.filter(a => a.type === filters.type)
    : activities

  // Sayfalama
  const paginatedActivities = filteredActivities.slice(0, take)

  return {
    activities: paginatedActivities,
    total: filteredActivities.length,
    page,
    totalPages: Math.ceil(filteredActivities.length / take),
  }
}

export async function getActivityStats() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalPlans,
    totalComments,
    totalUsers,
    todayPlans,
    todayComments,
    todayUsers,
  ] = await Promise.all([
    db.plan.count(),
    db.comment.count(),
    db.user.count(),
    db.plan.count({ where: { createdAt: { gte: today } } }),
    db.comment.count({ where: { createdAt: { gte: today } } }),
    db.user.count({ where: { createdAt: { gte: today } } }),
  ])

  return {
    totalPlans,
    totalComments,
    totalUsers,
    todayPlans,
    todayComments,
    todayUsers,
  }
}
