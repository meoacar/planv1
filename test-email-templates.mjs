import { Resend } from 'resend'

// Resend API Key - .env dosyasından
const RESEND_API_KEY = 're_PqEV9qWg_MGa1VcgoogGTJhwcUfFXXeWe'
const resend = new Resend(RESEND_API_KEY)
const APP_URL = 'https://zayiflamaplanim.com'

async function testWelcomeEmail() {
  console.log('📧 Hoş Geldin Mail\'i Gönderiliyor...')
  
  try {
    const result = await resend.emails.send({
      from: 'ZayiflamaPlan <onboarding@resend.dev>',
      to: 'meofeat@gmail.com',
      subject: 'Test - Hoş Geldin! 🎉 - ZayiflamaPlanim.com',
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

              .content {
                padding: 50px 40px;
              }
              .greeting {
                font-size: 20px;
                font-weight: 700;
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
              }
              .stats-box {
                background: linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%);
                padding: 30px;
                border-radius: 16px;
                margin: 35px 0;
                text-align: center;
              }
              .stats-grid {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 20px;
                margin-top: 20px;
              }
              .stat-number {
                font-size: 32px;
                font-weight: 800;
                background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .stat-label {
                font-size: 13px;
                color: #6b7280;
                margin-top: 5px;
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
                <div style="padding: 0; text-align: center; overflow: hidden;">
                  <img src="https://i.imgur.com/kXLlJrD.png" alt="ZayiflamaPlanim.com - Birlikte Başarıyoruz, Birlikte Güçlüyüz!" style="max-width: 100%; height: auto; display: block;" />
                </div>
                
                <div class="content">
                  <p class="greeting">Merhaba ve hoş geldin! 👋</p>
                  
                  <p class="text">
                    <strong>ZayiflamaPlanim.com</strong> ailesine katıldığın için çok mutluyuz! 
                    Burada gerçek insanların gerçek başarı hikayelerini bulacak, kendi yolculuğunu paylaşacak 
                    ve topluluk desteğiyle hedeflerine ulaşacaksın. 💪
                  </p>

                  <div class="stats-box">
                    <h3 style="margin: 0 0 10px 0; color: #7c3aed; font-size: 18px;">🌟 Topluluğumuz</h3>
                    <div class="stats-grid">
                      <div>
                        <div class="stat-number">67</div>
                        <div class="stat-label">Rozet</div>
                      </div>
                      <div>
                        <div class="stat-number">∞</div>
                        <div class="stat-label">Görev</div>
                      </div>
                      <div>
                        <div class="stat-number">24/7</div>
                        <div class="stat-label">Destek</div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="button-container">
                    <a href="${APP_URL}/dashboard" class="button">
                      🎯 Hemen Başla
                    </a>
                  </div>
                  
                  <p class="text" style="text-align: center; color: #6b7280; font-size: 15px;">
                    Bu bir test mail'idir. Tasarımı kontrol ediyoruz! 🎨<br>
                    Başarı yolculuğunda yanındayız. 🌟
                  </p>
                </div>
                
                <div class="footer">
                  <div class="footer-brand">ZayiflamaPlanim.com</div>
                  <div class="footer-tagline">💪 Birlikte Başarıyoruz, Birlikte Güçlüyüz!</div>
                  
                  <div class="footer-links">
                    <a href="${APP_URL}">🏠 Ana Sayfa</a>
                    <a href="${APP_URL}/kesfet">🔍 Keşfet</a>
                    <a href="${APP_URL}/blog">📚 Blog</a>
                    <a href="${APP_URL}/iletisim">💬 İletişim</a>
                  </div>
                  
                  <div class="footer-note">
                    Bu e-posta test amaçlıdır.<br>
                    Sorularınız için <a href="${APP_URL}/iletisim" style="color: #ec4899;">iletişim sayfamızı</a> ziyaret edebilirsiniz.
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    console.log('✅ Hoş Geldin Mail\'i Gönderildi!')
    console.log('📬 Mail ID:', result.data?.id)
  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

async function testPasswordResetEmail() {
  console.log('\n📧 Şifre Sıfırlama Mail\'i Gönderiliyor...')
  
  const resetUrl = `${APP_URL}/sifre-sifirla?token=test-token-12345`
  
  try {
    const result = await resend.emails.send({
      from: 'ZayiflamaPlan <onboarding@resend.dev>',
      to: 'meofeat@gmail.com',
      subject: 'Test - Şifre Sıfırlama Talebi - ZayiflamaPlanim.com',
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
              .footer-links a {
                color: #d1d5db;
                text-decoration: none;
                margin: 0 12px;
                font-size: 14px;
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
                <div style="padding: 0; text-align: center; overflow: hidden;">
                  <img src="https://i.imgur.com/kXLlJrD.png" alt="ZayiflamaPlanim.com - Birlikte Başarıyoruz, Birlikte Güçlüyüz!" style="max-width: 100%; height: auto; display: block;" />
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
                    <strong style="color: #92400e; font-size: 16px;">⚠️ Önemli Bilgi</strong><br>
                    Bu bir test mail'idir. Gerçek bir şifre sıfırlama linki değildir.
                  </div>
                  
                  <p class="text">
                    Mail tasarımını kontrol ediyoruz! 🎨
                  </p>
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
                    Bu e-posta test amaçlıdır.<br>
                    Sorularınız için <a href="${APP_URL}/iletisim" style="color: #ec4899;">iletişim sayfamızı</a> ziyaret edebilirsiniz.
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    console.log('✅ Şifre Sıfırlama Mail\'i Gönderildi!')
    console.log('📬 Mail ID:', result.data?.id)
  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

// Her iki mail'i gönder
console.log('🚀 Test Mail\'leri Gönderiliyor...\n')
await testWelcomeEmail()
await testPasswordResetEmail()
console.log('\n✨ Tamamlandı! meofeat@gmail.com adresini kontrol edin.')



