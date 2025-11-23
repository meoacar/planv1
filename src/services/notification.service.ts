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

  // Tarif bildirimleri
  static async notifyRecipeLike(recipeId: string, likerUserId: string) {
    const recipe = await db.recipe.findUnique({
      where: { id: recipeId },
      include: { author: { select: { id: true } } },
    })

    if (!recipe || recipe.authorId === likerUserId) return

    const liker = await db.user.findUnique({
      where: { id: likerUserId },
      select: { username: true, name: true },
    })

    await this.createNotification(
      recipe.authorId,
      'like',
      'Yeni beğeni',
      `${liker?.name || liker?.username} tarifini beğendi`,
      'recipe',
      recipeId
    )
  }

  static async notifyRecipeComment(recipeId: string, commenterUserId: string) {
    const recipe = await db.recipe.findUnique({
      where: { id: recipeId },
      include: { author: { select: { id: true } } },
    })

    if (!recipe || recipe.authorId === commenterUserId) return

    const commenter = await db.user.findUnique({
      where: { id: commenterUserId },
      select: { username: true, name: true },
    })

    await this.createNotification(
      recipe.authorId,
      'comment',
      'Yeni yorum',
      `${commenter?.name || commenter?.username} tarifine yorum yaptı`,
      'recipe',
      recipeId
    )
  }

  // Rozet bildirimleri
  static async notifyBadgeEarned(userId: string, badgeName: string, badgeIcon: string) {
    await this.createNotification(
      userId,
      'badge_earned',
      'Yeni rozet kazandın!',
      `${badgeIcon} ${badgeName} rozetini kazandın!`,
      undefined,
      undefined
    )
  }

  // Level up bildirimi
  static async notifyLevelUp(userId: string, newLevel: number) {
    await this.createNotification(
      userId,
      'level_up',
      'Seviye atladın!',
      `Tebrikler! ${newLevel}. seviyeye ulaştın! 🎉`,
      undefined,
      undefined
    )
  }

  // Görev bildirimleri
  static async notifyQuestCompleted(userId: string, questTitle: string, reward: number) {
    await this.createNotification(
      userId,
      'quest_completed',
      'Görev tamamlandı!',
      `"${questTitle}" görevini tamamladın! ${reward} coin kazandın! 🪙`,
      undefined,
      undefined
    )
  }

  // Mesaj bildirimleri
  static async notifyNewMessage(userId: string, senderName: string, conversationId: string) {
    await this.createNotification(
      userId,
      'message',
      'Yeni mesaj',
      `${senderName} sana mesaj gönderdi`,
      'conversation',
      conversationId
    )
  }

  // Grup bildirimleri
  static async notifyGroupInvite(userId: string, groupName: string, groupId: string) {
    await this.createNotification(
      userId,
      'group_invite',
      'Grup daveti',
      `"${groupName}" grubuna davet edildin`,
      'group',
      groupId
    )
  }

  static async notifyGroupJoinRequest(groupOwnerId: string, userName: string, groupId: string) {
    await this.createNotification(
      groupOwnerId,
      'group_join_request',
      'Grup katılma isteği',
      `${userName} grubuna katılmak istiyor`,
      'group',
      groupId
    )
  }

  // Premium bildirimleri
  static async notifyPremiumExpiring(userId: string, daysLeft: number) {
    await this.createNotification(
      userId,
      'premium_expiring',
      'Premium üyeliğin bitiyor',
      `Premium üyeliğin ${daysLeft} gün içinde sona erecek. Yenilemeyi unutma!`,
      undefined,
      undefined
    )
  }

  static async notifyPremiumActivated(userId: string, type: string) {
    await this.createNotification(
      userId,
      'premium_activated',
      'Premium aktif!',
      `${type} premium üyeliğin aktif edildi! Tüm özelliklerin kilidini açtın! 👑`,
      undefined,
      undefined
    )
  }

  // Streak bildirimleri
  static async notifyStreakMilestone(userId: string, days: number) {
    await this.createNotification(
      userId,
      'streak_milestone',
      'Streak başarısı!',
      `${days} günlük streak'ini tamamladın! Harikasın! 🔥`,
      undefined,
      undefined
    )
  }

  static async notifyStreakLost(userId: string) {
    await this.createNotification(
      userId,
      'streak_lost',
      'Streak kırıldı',
      `Streak'in sıfırlandı. Yeniden başla ve daha güçlü dön! 💪`,
      undefined,
      undefined
    )
  }

  // Sistem bildirimleri
  static async notifySystemAlert(userId: string, title: string, message: string) {
    await this.createNotification(
      userId,
      'system_alert',
      title,
      message,
      undefined,
      undefined
    )
  }

  // Mağaza bildirimleri
  static async notifyPurchaseSuccess(userId: string, itemName: string) {
    await this.createNotification(
      userId,
      'purchase_success',
      'Satın alma başarılı!',
      `${itemName} başarıyla satın alındı! 🎁`,
      undefined,
      undefined
    )
  }

  // Lonca bildirimleri
  static async notifyGuildInvite(userId: string, guildName: string, guildId: string) {
    await this.createNotification(
      userId,
      'guild_invite',
      'Lonca daveti',
      `"${guildName}" loncasına davet edildin`,
      'guild',
      guildId
    )
  }

  static async notifyGuildLevelUp(userId: string, guildName: string, newLevel: number) {
    await this.createNotification(
      userId,
      'guild_level_up',
      'Lonca seviye atladı!',
      `"${guildName}" loncası ${newLevel}. seviyeye ulaştı! 🏰`,
      undefined,
      undefined
    )
  }
}
