'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getUsersForAdmin(role: string = 'all', page: number = 1, search?: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const where: any = {}
  
  if (role !== 'all') {
    where.role = role
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { username: { contains: search } },
    ]
  }

  const take = 20
  const skip = (page - 1) * take

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      take,
      skip,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            plans: true,
            comments: true,
          },
        },
      },
    }),
    db.user.count({ where }),
  ])

  return { users, total }
}

export async function toggleUserRole(userId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  await db.user.update({
    where: { id: userId },
    data: { role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' },
  })

  return { success: true }
}

export async function toggleUserBan(userId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user) throw new Error('User not found')

  await db.user.update({
    where: { id: userId },
    data: { isBanned: !user.isBanned },
  })

  return { success: true }
}

export async function deleteUser(userId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Delete user and all related data (cascade)
  await db.user.delete({
    where: { id: userId },
  })

  return { success: true }
}

export async function getUserById(userId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          plans: true,
          comments: true,
          followers: true,
          following: true,
        },
      },
    },
  })

  return user
}

export async function updateUser(
  userId: string,
  data: {
    name: string | null
    username: string | null
    bio: string | null
    role: 'USER' | 'ADMIN'
    isBanned: boolean
    bannedUntil: Date | null
    banReason: string | null
    currentWeight: number | null
    targetWeight: number | null
    height: number | null
  }
) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Eğer yasaklama kaldırılıyorsa, yasaklama bilgilerini temizle
  const updateData = {
    ...data,
    bannedUntil: data.isBanned ? data.bannedUntil : null,
    banReason: data.isBanned ? data.banReason : null,
  }

  await db.user.update({
    where: { id: userId },
    data: updateData,
  })

  return { success: true }
}
