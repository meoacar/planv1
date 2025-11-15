import { db } from '@/lib/db'
import { NotificationType, TargetType } from '@prisma/client'

export class NotificationService {
  static async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    targetType?: TargetType,
    targetId?: string
  ) {
    return db.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        targetType,
        targetId,
      },
    })
  }

  static async getNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit

    const [notifications, total, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      db.notification.count({ where: { userId } }),
      db.notification.count({ where: { userId, read: false } }),
    ])

    return {
      items: notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    })

    if (!notification || notification.userId !== userId) {
      throw new Error('Bildirim bulunamadı')
    }

    return db.notification.update({
      where: { id: notificationId },
      data: { read: true },
    })
  }

  static async markAllAsRead(userId: string) {
    return db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  }

  static async getUnreadCount(userId: string) {
    return db.notification.count({
      where: { userId, read: false },
    })
  }

  // Helper methods for specific notification types
  static async notifyLike(planId: string, likerUserId: string) {
    const plan = await db.plan.findUnique({
      where: { id: planId },
      include: {
        author: {
          select: { id: true, username: true },
        },
      },
    })

    if (!plan || plan.authorId === likerUserId) return

    const liker = await db.user.findUnique({
      where: { id: likerUserId },
      select: { username: true, name: true },
    })

    await this.createNotification(
      plan.authorId,
      'like',
      'Yeni beğeni',
      `${liker?.name || liker?.username} planını beğendi`,
      'plan',
      planId
    )
  }

  static async notifyComment(planId: string, commenterUserId: string) {
    const plan = await db.plan.findUnique({
      where: { id: planId },
      include: {
        author: {
          select: { id: true },
        },
      },
    })

    if (!plan || plan.authorId === commenterUserId) return

    const commenter = await db.user.findUnique({
      where: { id: commenterUserId },
      select: { username: true, name: true },
    })

    await this.createNotification(
      plan.authorId,
      'comment',
      'Yeni yorum',
      `${commenter?.name || commenter?.username} planına yorum yaptı`,
      'plan',
      planId
    )
  }

  static async notifyFollow(targetUserId: string, followerUserId: string) {
    const follower = await db.user.findUnique({
      where: { id: followerUserId },
      select: { username: true, name: true },
    })

    await this.createNotification(
      targetUserId,
      'follow',
      'Yeni takipçi',
      `${follower?.name || follower?.username} seni takip etmeye başladı`,
      undefined,
      undefined
    )
  }

  static async notifyPlanApproved(planId: string) {
    const plan = await db.plan.findUnique({
      where: { id: planId },
      include: {
        author: {
          select: { id: true },
        },
      },
    })

    if (!plan) return

    await this.createNotification(
      plan.authorId,
      'plan_approved',
      'Plan onaylandı',
      `"${plan.title}" planın yayınlandı!`,
      'plan',
      planId
    )
  }

  static async notifyPlanRejected(planId: string, reason?: string) {
    const plan = await db.plan.findUnique({
      where: { id: planId },
      include: {
        author: {
          select: { id: true },
        },
      },
    })

    if (!plan) return

    await this.createNotification(
      plan.authorId,
      'plan_rejected',
      'Plan reddedildi',
      reason || `"${plan.title}" planın reddedildi. Lütfen düzenleyip tekrar gönder.`,
      'plan',
      planId
    )
  }
}
