import { prisma } from '@/lib/prisma'

export type NotificationType =
  | 'recipe_pending'
  | 'comment_reported'
  | 'user_reported'
  | 'confession_pending'
  | 'appeal_pending'
  | 'group_pending'
  | 'guild_pending'
  | 'system_alert'

interface CreateNotificationParams {
  type: NotificationType
  title: string
  message: string
  link?: string
  metadata?: Record<string, any>
}

/**
 * Tüm admin kullanıcılarına bildirim gönderir
 */
export async function notifyAdmins(params: CreateNotificationParams) {
  try {
    // Tüm admin kullanıcılarını bul
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        isBanned: false
      },
      select: {
        id: true
      }
    })

    if (admins.length === 0) {
      console.warn('Bildirim gönderilemedi: Admin kullanıcı bulunamadı')
      return
    }

    // Her admin için bildirim oluştur
    await prisma.notification.createMany({
      data: admins.map(admin => ({
        userId: admin.id,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        isRead: false
      }))
    })

    console.log(`✅ ${admins.length} admin kullanıcısına bildirim gönderildi: ${params.title}`)
  } catch (error) {
    console.error('Bildirim gönderilirken hata:', error)
  }
}

/**
 * Belirli bir admin kullanıcısına bildirim gönderir
 */
export async function notifyAdmin(userId: string, params: CreateNotificationParams) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        isRead: false
      }
    })

    console.log(`✅ Admin kullanıcısına bildirim gönderildi: ${params.title}`)
  } catch (error) {
    console.error('Bildirim gönderilirken hata:', error)
  }
}
