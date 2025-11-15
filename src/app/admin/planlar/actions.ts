'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getPlansForModeration(
  status: string = 'all', 
  page: number = 1,
  search?: string
) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

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

  const take = 20
  const skip = (page - 1) * take

  const [plans, total] = await Promise.all([
    db.plan.findMany({
      where,
      take,
      skip,
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
    db.plan.count({ where }),
  ])

  return { plans, total }
}

export async function approvePlan(planId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.plan.update({
    where: { id: planId },
    data: { 
      status: 'published',
      publishedAt: new Date(),
    },
  })

  return { success: true }
}

export async function rejectPlan(planId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.plan.update({
    where: { id: planId },
    data: { status: 'rejected' },
  })

  return { success: true }
}

export async function deletePlan(planId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  await db.plan.delete({
    where: { id: planId },
  })

  return { success: true }
}
