'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function getCommentsForModeration() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const [comments, total] = await Promise.all([
    db.comment.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    }),
    db.comment.count(),
  ])

  return { comments, total }
}

export async function approveComment(commentId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Get comment to find the plan
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { targetId: true, targetType: true },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  // Update comment status and increment plan's comment count
  await db.$transaction([
    db.comment.update({
      where: { id: commentId },
      data: { status: 'visible' },
    }),
    db.plan.update({
      where: { id: comment.targetId },
      data: { commentsCount: { increment: 1 } },
    }),
  ])

  return { success: true }
}

export async function hideComment(commentId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Get comment to check if it was visible (to decrement count)
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { targetId: true, status: true },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  // Hide comment and decrement count if it was visible
  if (comment.status === 'visible') {
    await db.$transaction([
      db.comment.update({
        where: { id: commentId },
        data: { status: 'hidden' },
      }),
      db.plan.update({
        where: { id: comment.targetId },
        data: { commentsCount: { decrement: 1 } },
      }),
    ])
  } else {
    await db.comment.update({
      where: { id: commentId },
      data: { status: 'hidden' },
    })
  }

  return { success: true }
}

export async function deleteComment(commentId: string) {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  // Get comment to check if it was visible (to decrement count)
  const comment = await db.comment.findUnique({
    where: { id: commentId },
    select: { targetId: true, status: true },
  })

  if (!comment) {
    throw new Error('Comment not found')
  }

  // Delete comment and decrement count if it was visible
  if (comment.status === 'visible') {
    await db.$transaction([
      db.comment.delete({
        where: { id: commentId },
      }),
      db.plan.update({
        where: { id: comment.targetId },
        data: { commentsCount: { decrement: 1 } },
      }),
    ])
  } else {
    await db.comment.delete({
      where: { id: commentId },
    })
  }

  return { success: true }
}
