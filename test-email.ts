import { Resend } from 'resend'

// API Key direkt .env'den yüklenecek (Next.js otomatik yükler)
const resend = new Resend('re_PqEV9qWg_MGa1VcgoogGTJhwcUfFXXeWe')

async function testEmail() {
  try {
    console.log('📧 Test email gönderiliyor...')
    console.log('API Key:', 're_PqEV9qWg...')
    console.log('From:', 'ZayiflamaPlan <onboarding@resend.dev>')
    console.log('To:', 'test@example.com')
    
    const result = await resend.emails.send({
      from: 'ZayiflamaPlan <onboarding@resend.dev>',
      to: 'delivered@resend.dev', // Resend'in test email adresi
      subject: 'Test Email - ZayiflamaPlan',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .container { max-width: 600px; margin: 0 auto; background: #f5f5f5; padding: 30px; border-radius: 10px; }
              h1 { color: #667eea; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>✅ Test Email Başarılı!</h1>
              <p>Eğer bu emaili aldıysanız, Resend API çalışıyor! 🎉</p>
              <p><strong>Tarih:</strong> ${new Date().toLocaleString('tr-TR')}</p>
              <p><strong>API Key:</strong> re_PqEV9qWg...</p>
            </div>
          </body>
        </html>
      `,
    })
    
    console.log('✅ Email başarıyla gönderildi!')
    console.log('📬 Email ID:', result.data?.id)
    console.log('📊 Sonuç:', JSON.stringify(result, null, 2))
  } catch (error: any) {
    console.error('❌ Email gönderme hatası!')
    console.error('Hata tipi:', error.name)
    console.error('Hata mesajı:', error.message)
    console.error('Status code:', error.statusCode)
    if (error.response) {
      console.error('API yanıtı:', JSON.stringify(error.response, null, 2))
    }
  }
}

console.log('🚀 Resend Email Test Başlıyor...')
console.log('=' .repeat(50))
testEmail().then(() => {
  console.log('=' .repeat(50))
  console.log('✨ Test tamamlandı!')
  process.exit(0)
})
