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
      subject: 'Şifre Sıfırlama - ZayiflamaPlanim.com',
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
                color: #1f2937;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #f5f3ff 0%, #fce7f3 50%, #fff7ed 100%);
              }
              .email-wrapper {
                padding: 40px 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.15);
              }
              .hero-header {
                background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
                padding: 60px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
              }
              .hero-header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 3s ease-in-out infinite;
              }
              @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 0.5; }
                50% { transform: scale(1.1); opacity: 0.8; }
              }
              .hero-emoji {
                font-size: 72px;
                margin-bottom: 20px;
                display: block;
                animation: bounce 2s ease-in-out infinite;
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              .hero-title {
                color: white;
                font-size: 32px;
                font-weight: 800;
                margin: 0;
                text-shadow: 0 2px 10px rgba(0,0,0,0.2);
                position: relative;
                z-index: 1;
              }
              .hero-subtitle {
                color: rgba(255,255,255,0.95);
                font-size: 16px;
                margin: 12px 0 0 0;
                font-weight: 500;
                position: relative;
                z-index: 1;
              }
              .content {
                padding: 50px 40px;
              }
              .greeting {
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 20px;
              }
              .text {
                color: #4b5563;
                font-size: 16px;
                line-height: 1.8;
                margin: 16px 0;
              }
              .button-container {
                text-align: center;
                margin: 40px 0;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
                color: white;
                padding: 18px 48px;
                text-decoration: none;
                border-radius: 16px;
                font-weight: 700;
                font-size: 16px;
                box-shadow: 0 10px 30px rgba(147, 51, 234, 0.4);
                transition: all 0.3s ease;
              }
              .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 40px rgba(147, 51, 234, 0.5);
              }
              .link-box {
                background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
                padding: 20px;
                border-radius: 12px;
                margin: 30px 0;
                word-break: break-all;
                font-size: 13px;
                color: #6b7280;
                border: 2px dashed #d1d5db;
              }
              .info-box {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border-left: 5px solid #f59e0b;
                padding: 20px;
                margin: 30px 0;
                border-radius: 12px;
              }
              .info-box strong {
                color: #92400e;
                font-size: 16px;
              }
              .tips {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                padding: 25px;
                border-radius: 12px;
                margin: 30px 0;
              }
              .tips h3 {
                color: #0c4a6e;
                font-size: 18px;
                margin: 0 0 15px 0;
              }
              .tips ul {
                margin: 0;
                padding-left: 20px;
              }
              .tips li {
                color: #0369a1;
                margin: 8px 0;
                font-size: 15px;
              }
              .footer {
                background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
                padding: 40px;
                text-align: center;
              }
              .footer-brand {
                color: white;
                font-size: 24px;
                font-weight: 800;
                margin-bottom: 12px;
                background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .footer-tagline {
                color: #9ca3af;
                font-size: 14px;
                margin-bottom: 25px;
              }
              .footer-links {
                margin: 20px 0;
              }
              .footer-links a {
                color: #d1d5db;
                text-decoration: none;
                margin: 0 12px;
                font-size: 14px;
                transition: color 0.3s;
              }
              .footer-links a:hover {
                color: #ec4899;
              }
              .footer-note {
                color: #6b7280;
                font-size: 12px;
                margin-top: 25px;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <div class="container">
                <div class="hero-header">
                  <span class="hero-emoji">🔐</span>
                  <h1 class="hero-title">Şifre Sıfırlama</h1>
                  <p class="hero-subtitle">Hesabınızın güvenliği bizim için önemli</p>
                </div>
                
                <div class="content">
                  <p class="greeting">Merhaba 👋</p>
                  
                  <p class="text">
                    <strong>ZayiflamaPlanim.com</strong> hesabınız için şifre sıfırlama talebi aldık. 
                    Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın:
                  </p>
                  
                  <div class="button-container">
                    <a href="${resetUrl}" class="button">
                      🔑 Şifremi Sıfırla
                    </a>
                  </div>
                  
                  <p class="text" style="text-align: center; color: #9ca3af; font-size: 14px;">
                    Buton çalışmıyorsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:
                  </p>
                  
                  <div class="link-box">
                    ${resetUrl}
                  </div>
                  
                  <div class="info-box">
                    <strong>⚠️ Önemli Bilgi</strong><br>
                    Bu link <strong>1 saat</strong> geçerlidir ve sadece <strong>bir kez</strong> kullanılabilir. 
                    Süre dolduğunda yeni bir şifre sıfırlama talebi oluşturmanız gerekecektir.
                  </div>
                  
                  <p class="text">
                    Eğer bu talebi <strong>siz yapmadıysanız</strong>, bu e-postayı güvenle görmezden gelebilirsiniz. 
                    Şifreniz değiştirilmeyecek ve hesabınız güvende kalacaktır.
                  </p>
                  
                  <div class="tips">
                    <h3>🛡️ Güvenlik İpuçları</h3>
                    <ul>
                      <li>Şifrenizi asla kimseyle paylaşmayın</li>
                      <li>Güçlü bir şifre seçin (en az 8 karakter, harf ve rakam karışımı)</li>
                      <li>Farklı platformlarda farklı şifreler kullanın</li>
                      <li>Şüpheli aktivite fark ederseniz hemen bize bildirin</li>
                    </ul>
                  </div>
                </div>
                
                <div class="footer">
                  <div class="footer-brand">ZayiflamaPlanim.com</div>
                  <div class="footer-tagline">💪 Birlikte Başarıyoruz, Birlikte Güçlüyüz!</div>
                  
                  <div class="footer-links">
                    <a href="${APP_URL}">🏠 Ana Sayfa</a>
                    <a href="${APP_URL}/giris">🔑 Giriş Yap</a>
                    <a href="${APP_URL}/iletisim">💬 İletişim</a>
                  </div>
                  
                  <div class="footer-note">
                    Bu e-posta otomatik olarak gönderilmiştir, lütfen yanıtlamayın.<br>
                    Sorularınız için <a href="${APP_URL}/iletisim" style="color: #ec4899;">iletişim sayfamızı</a> ziyaret edebilirsiniz.
                  </div>
                </div>
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
      subject: `${name ? name + ', ' : ''}Zayıflama Yolculuğun Başlıyor! - ZayiflamaPlanim.com`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.5;
                color: #1d1d1f;
                margin: 0;
                padding: 0;
                background-color: #f5f5f7;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
              }
              .hero-section {
                padding: 0;
                text-align: center;
                overflow: hidden;
              }
              .hero-section img {
                display: block;
                width: 100%;
                height: auto;
              }
              .content-section {
                padding: 50px 40px;
              }
              .welcome-text {
                font-size: 17px;
                color: #1d1d1f;
                line-height: 1.6;
                margin-bottom: 30px;
                text-align: center;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f59e0b 100%);
                color: #ffffff;
                font-size: 17px;
                font-weight: 600;
                text-decoration: none;
                padding: 16px 40px;
                border-radius: 980px;
                margin: 20px 0 40px;
                box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
                transition: all 0.3s ease;
              }
              .cta-container {
                text-align: center;
              }
              .features {
                margin: 40px 0;
              }
              .feature-item {
                display: flex;
                align-items: flex-start;
                gap: 16px;
                margin-bottom: 24px;
                padding: 20px;
                background: #f5f5f7;
                border-radius: 16px;
              }
              .feature-icon {
                font-size: 32px;
                flex-shrink: 0;
              }
              .feature-content {
                flex: 1;
              }
              .feature-title {
                font-size: 17px;
                font-weight: 600;
                color: #1d1d1f;
                margin-bottom: 4px;
              }
              .feature-desc {
                font-size: 15px;
                color: #6e6e73;
                line-height: 1.5;
              }
              .stats-section {
                background: linear-gradient(135deg, #f5f3ff 0%, #fef3c7 100%);
                padding: 30px;
                border-radius: 20px;
                margin: 40px 0;
                text-align: center;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin-top: 20px;
              }
              .stat-item {
                text-align: center;
              }
              .stat-number {
                font-size: 36px;
                font-weight: 700;
                background: linear-gradient(135deg, #9333ea 0%, #f59e0b 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin-bottom: 4px;
              }
              .stat-label {
                font-size: 13px;
                color: #6e6e73;
                font-weight: 500;
              }
              .footer-section {
                background: #f5f5f7;
                padding: 40px;
                text-align: center;
                border-radius: 40px 40px 0 0;
              }
              .footer-brand {
                font-size: 19px;
                font-weight: 700;
                color: #1d1d1f;
                margin-bottom: 8px;
              }
              .footer-tagline {
                font-size: 15px;
                color: #6e6e73;
                margin-bottom: 24px;
              }
              .footer-links {
                margin: 20px 0;
              }
              .footer-links a {
                color: #06c;
                text-decoration: none;
                font-size: 14px;
                margin: 0 12px;
              }
              .footer-note {
                font-size: 12px;
                color: #86868b;
                margin-top: 20px;
                line-height: 1.5;
              }
              @media only screen and (max-width: 600px) {
                .content-section {
                  padding: 40px 20px;
                }
                .stats-grid {
                  grid-template-columns: 1fr;
                  gap: 16px;
                }
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Hero Section -->
              <div class="hero-section">
                <img src="https://i.imgur.com/kXLlJrD.png" alt="ZayiflamaPlanim.com - Birlikte Başarıyoruz, Birlikte Güçlüyüz!" style="max-width: 100%; height: auto; display: block; width: 600px;" />
              </div>

              <!-- Content Section -->
              <div class="content-section">
                <p class="welcome-text">
                  <strong>ZayiflamaPlanim.com</strong> ailesine katıldığın için çok mutluyuz. 
                  Burada gerçek insanların gerçek başarı hikayelerini bulacak, kendi yolculuğunu paylaşacak 
                  ve topluluk desteğiyle hedeflerine ulaşacaksın.
                </p>

                <!-- Stats -->
                <div class="stats-section">
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-number">67</div>
                      <div class="stat-label">Rozet Sistemi</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">∞</div>
                      <div class="stat-label">Günlük Görev</div>
                    </div>
                    <div class="stat-item">
                      <div class="stat-number">24/7</div>
                      <div class="stat-label">Topluluk Desteği</div>
                    </div>
                  </div>
                </div>

                <!-- CTA Button -->
                <div class="cta-container">
                  <a href="${APP_URL}/dashboard" class="cta-button">Hemen Başla</a>
                </div>

                <!-- Features -->
                <div class="features">
                  <div class="feature-item">
                    <span class="feature-icon">📋</span>
                    <div class="feature-content">
                      <div class="feature-title">Planları Keşfet</div>
                      <div class="feature-desc">Binlerce gerçek plan arasından sana uygun olanı bul</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📊</span>
                    <div class="feature-content">
                      <div class="feature-title">İlerlemeni Takip Et</div>
                      <div class="feature-desc">Kilo, su, fotoğraf takibi ile gelişimini gör</div>
                    </div>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">👥</span>
                    <div class="feature-content">
                      <div class="feature-title">Topluluğa Katıl</div>
                      <div class="feature-desc">Gruplar ve loncalarla motivasyon bul</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer-section">
                <div class="footer-brand">ZayiflamaPlanim.com</div>
                <div class="footer-tagline">Birlikte Başarıyoruz 💪</div>
                
                <div class="footer-links">
                  <a href="${APP_URL}">Ana Sayfa</a>
                  <a href="${APP_URL}/kesfet">Keşfet</a>
                  <a href="${APP_URL}/blog">Blog</a>
                  <a href="${APP_URL}/iletisim">İletişim</a>
                </div>
                
                <div class="footer-note">
                  Bu e-posta otomatik olarak gönderilmiştir.<br>
                  Sorularınız için <a href="${APP_URL}/iletisim" style="color: #06c;">iletişim sayfamızı</a> ziyaret edebilirsiniz.
                </div>
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
