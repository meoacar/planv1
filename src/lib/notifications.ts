import { getSetting } from './settings'

interface EmailNotification {
  to: string
  subject: string
  body: string
}

export async function sendAdminNotification(
  type: 'new_plan' | 'new_comment' | 'new_user',
  data: any
) {
  try {
    // Bildirimler aktif mi kontrol et
    const emailNotifications = await getSetting('emailNotifications', 'true')
    if (emailNotifications !== 'true') {
      return
    }

    // Bu tip bildirim aktif mi kontrol et
    const notifyKey = `notify${type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`
    const isEnabled = await getSetting(notifyKey, 'false')
    if (isEnabled !== 'true') {
      return
    }

    // Admin email adresini al
    const adminEmail = await getSetting('notifyAdminEmail', '')
    if (!adminEmail) {
      return
    }

    // Email içeriğini hazırla
    let subject = ''
    let body = ''

    switch (type) {
      case 'new_plan':
        subject = `Yeni Plan: ${data.title}`
        body = `
          Yeni bir plan oluşturuldu:
          
          Başlık: ${data.title}
          Yazar: ${data.author}
          Durum: ${data.status}
          
          Planı görüntüle: ${await getSetting('siteUrl', '')}/plan/${data.slug}
        `
        break

      case 'new_comment':
        subject = `Yeni Yorum: ${data.planTitle}`
        body = `
          Yeni bir yorum yapıldı:
          
          Plan: ${data.planTitle}
          Yazar: ${data.author}
          Yorum: ${data.body}
          
          Yorumu görüntüle: ${await getSetting('siteUrl', '')}/plan/${data.planSlug}
        `
        break

      case 'new_user':
        subject = `Yeni Kullanıcı: ${data.name}`
        body = `
          Yeni bir kullanıcı kaydoldu:
          
          İsim: ${data.name}
          Email: ${data.email}
          Tarih: ${new Date().toLocaleString('tr-TR')}
        `
        break
    }

    // Email gönder (Resend veya başka bir servis kullanılabilir)
    // Şimdilik console'a log at
    console.log('Admin Notification:', { to: adminEmail, subject, body })

    // TODO: Gerçek email gönderimi için Resend entegrasyonu
    // await sendEmail({ to: adminEmail, subject, body })

  } catch (error) {
    console.error('Notification error:', error)
  }
}

export async function sendUserNotification(
  userId: string,
  type: string,
  data: any
) {
  // Kullanıcıya bildirim gönder
  // Database'e notification kaydı ekle
  const { db } = await import('./db')
  
  await db.notification.create({
    data: {
      userId,
      type: type as any,
      title: data.title,
      body: data.body,
      targetType: data.targetType,
      targetId: data.targetId,
    },
  })
}
