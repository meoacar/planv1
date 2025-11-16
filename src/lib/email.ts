import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'ZayiflamaPlan <noreply@zayiflamaplan.com>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

/**
 * Şifre sıfırlama emaili gönder
 */
export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Şifre Sıfırlama Talebi - ZayiflamaPlan',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                text-align: center;
                color: white;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .content {
                padding: 40px 30px;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
              }
              .button:hover {
                transform: translateY(-2px);
              }
              .link-box {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                word-break: break-all;
                font-size: 14px;
                color: #666;
              }
              .warning {
                background: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                color: #666;
                font-size: 14px;
              }
              .footer a {
                color: #667eea;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Şifre Sıfırlama</h1>
              </div>
              
              <div class="content">
                <p>Merhaba,</p>
                
                <p>ZayiflamaPlan hesabınız için şifre sıfırlama talebi aldık. Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">
                    Şifremi Sıfırla
                  </a>
                </div>
                
                <p>Veya bu linki tarayıcınıza kopyalayabilirsiniz:</p>
                
                <div class="link-box">
                  ${resetUrl}
                </div>
                
                <div class="warning">
                  <strong>⚠️ Önemli:</strong> Bu link <strong>1 saat</strong> geçerlidir ve sadece <strong>bir kez</strong> kullanılabilir.
                </div>
                
                <p>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz. Şifreniz değiştirilmeyecektir.</p>
                
                <p>Güvenliğiniz için:</p>
                <ul>
                  <li>Şifrenizi kimseyle paylaşmayın</li>
                  <li>Güçlü bir şifre seçin (en az 8 karakter)</li>
                  <li>Şüpheli aktivite görürseniz hemen bize bildirin</li>
                </ul>
              </div>
              
              <div class="footer">
                <p><strong>ZayiflamaPlan</strong></p>
                <p>Birlikte Başarıyoruz 💪</p>
                <p>
                  <a href="${APP_URL}">Ana Sayfa</a> • 
                  <a href="${APP_URL}/giris">Giriş Yap</a> • 
                  <a href="${APP_URL}/yardim">Yardım</a>
                </p>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                  Bu email otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Send password reset email error:', error)
    return { success: false, error: 'Email gönderilemedi' }
  }
}

/**
 * Hoş geldin emaili gönder
 */
export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Hoş Geldin! - ZayiflamaPlan',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
              .content { padding: 30px 20px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 40px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Hoş Geldin${name ? ` ${name}` : ''}!</h1>
              </div>
              <div class="content">
                <p>ZayiflamaPlan ailesine katıldığın için çok mutluyuz!</p>
                <p>Burada gerçek insanların gerçek başarı hikayelerini bulacak, kendi yolculuğunu paylaşacak ve topluluk desteğiyle hedeflerine ulaşacaksın.</p>
                <h3>Hemen Başla:</h3>
                <ul>
                  <li>📋 Planları keşfet ve beğendiğini favorilerine ekle</li>
                  <li>✍️ Kendi planını oluştur ve paylaş</li>
                  <li>📊 Kilo takibini başlat</li>
                  <li>👥 Gruplara katıl ve motivasyon bul</li>
                </ul>
                <div style="text-align: center;">
                  <a href="${APP_URL}/dashboard" class="button">Dashboard'a Git</a>
                </div>
                <p>Sorularını veya önerilerini bizimle paylaşmaktan çekinme!</p>
              </div>
              <div class="footer">
                <p><strong>ZayiflamaPlan</strong> - Birlikte Başarıyoruz 💪</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Send welcome email error:', error)
    return { success: false }
  }
}

/**
 * Plan onaylandı emaili gönder
 */
export async function sendPlanApprovedEmail(
  email: string,
  planTitle: string,
  planSlug: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Planın Onaylandı: ${planTitle} - ZayiflamaPlan`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .success { background: #d4edda; border-left: 4px solid #28a745; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .button { display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>🎉 Harika Haber!</h1>
              <div class="success">
                <h2 style="margin-top: 0;">Planın Yayınlandı!</h2>
                <p><strong>"${planTitle}"</strong> planın incelendi ve onaylandı. Artık herkes görebilir!</p>
              </div>
              <p>Planın şimdi platformda yayında ve diğer kullanıcılar tarafından görülebilir, beğenilebilir ve yorumlanabilir.</p>
              <div style="text-align: center;">
                <a href="${APP_URL}/plan/${planSlug}" class="button">Planı Görüntüle</a>
              </div>
              <p>Başarı hikayeni paylaşmaya devam et! 💪</p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Send plan approved email error:', error)
    return { success: false }
  }
}

/**
 * Plan reddedildi emaili gönder
 */
export async function sendPlanRejectedEmail(
  email: string,
  planTitle: string,
  reason: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Plan İnceleme Sonucu: ${planTitle} - ZayiflamaPlan`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 4px; margin: 20px 0; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Plan İnceleme Sonucu</h1>
              <div class="warning">
                <h2 style="margin-top: 0;">Planın İncelendi</h2>
                <p><strong>"${planTitle}"</strong> planın incelendi ancak şu anda yayınlanamadı.</p>
              </div>
              <h3>Sebep:</h3>
              <p>${reason}</p>
              <p>Endişelenme! Planını düzenleyip tekrar gönderebilirsin. Topluluğumuzun kalitesini korumak için tüm planları inceliyoruz.</p>
              <div style="text-align: center;">
                <a href="${APP_URL}/planlarim" class="button">Planlarıma Git</a>
              </div>
              <p>Sorularını bize iletmekten çekinme!</p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Send plan rejected email error:', error)
    return { success: false }
  }
}

/**
 * Admin bildirimi gönder
 */
export async function sendAdminNotification(
  subject: string,
  body: string
) {
  const adminEmail = process.env.ADMIN_EMAIL

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL not configured')
    return { success: false }
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `[Admin] ${subject} - ZayiflamaPlan`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .alert { background: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; border-radius: 4px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="alert">
                <h2 style="margin-top: 0;">${subject}</h2>
                <p>${body}</p>
              </div>
              <p><a href="${APP_URL}/admin">Admin Panel'e Git</a></p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Send admin notification error:', error)
    return { success: false }
  }
}

/**
 * Genel email gönderme fonksiyonu
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html: html || text || '',
      text,
    })

    return { success: true }
  } catch (error) {
    console.error('Send email error:', error)
    throw error
  }
}
