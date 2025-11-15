'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleFollowAction(targetUserId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { error: 'Giriş yapmalısınız' }
  }

  if (session.user.id === targetUserId) {
    return { error: 'Kendinizi takip edemezsiniz' }
  }

  try {
    // Check if already following
    const existingFollow = await db.follow.findUnique({
      where: {
        userId_targetId: {
          userId: session.user.id,
          targetId: targetUserId,
        },
      },
    })

    if (existingFollow) {
      // Unfollow
      await db.follow.delete({
        where: {
          userId_targetId: {
            userId: session.user.id,
            targetId: targetUserId,
          },
        },
      })
      return { success: true, isFollowing: false }
    } else {
      // Follow
      await db.follow.create({
        data: {
          userId: session.user.id,
          targetId: targetUserId,
        },
      })
      return { success: true, isFollowing: true }
    }
  } catch (error) {
    console.error('Follow error:', error)
    return { error: 'Bir hata oluştu' }
  }
}
