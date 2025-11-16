import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { response } = await request.json()

    if (!response || response.trim().length < 10) {
      return NextResponse.json(
        { message: 'Yanıt en az 10 karakter olmalı' },
        { status: 400 }
      )
    }

    // Mesajı al
    const message = await db.contactMessage.findUnique({
      where: { id: params.id },
    })

    if (!message) {
      return NextResponse.json(
        { message: 'Mesaj bulunamadı' },
        { status: 404 }
      )
    }

    // Yanıtı kaydet
    await db.contactMessage.update({
      where: { id: params.id },
      data: {
        response,
        status: 'responded',
        respondedBy: session.user.id,
        respondedAt: new Date(),
      },
    })

    // Kullanıcıya email gönder
    try {
      console.log('📧 Email gönderiliyor:', message.email)
      console.log('📧 Resend API Key:', process.env.RESEND_API_KEY ? 'Var ✅' : 'YOK ❌')
      
      await sendEmail({
        to: message.email,
        subject: `Re: ${message.subject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
                .response-box { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                .original { background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 0 0 8px 8px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">💬 Mesajınıza Yanıt</h1>
                </div>
                <div class="content">
                  <p>Merhaba <strong>${message.name}</strong>,</p>
                  <p>Mesajınız için teşekkür ederiz. İşte yanıtımız:</p>
                  
                  <div class="response-box">
                    <p style="white-space: pre-wrap; margin: 0;">${response}</p>
                  </div>
                  
                  <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                  
                  <p><strong>Orijinal Mesajınız:</strong></p>
                  <div class="original">
                    <p style="margin: 0; color: #666;">${message.message.replace(/\n/g, '<br>')}</p>
                  </div>
                </div>
                <div class="footer">
                  <p style="margin: 0 0 10px 0;"><strong>ZayiflamaPlan</strong></p>
                  <p style="margin: 0;">Bu bir otomatik yanıttır. Lütfen bu e-postayı yanıtlamayın.</p>
                  <p style="margin: 10px 0 0 0;">
                    Başka sorularınız için <a href="https://zayiflamaplan.com/iletisim" style="color: #667eea;">iletişim sayfamızı</a> ziyaret edebilirsiniz.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      })
      
      console.log('✅ Email başarıyla gönderildi!')
    } catch (emailError: any) {
      console.error('❌ Email gönderme hatası:', emailError)
      console.error('Hata mesajı:', emailError.message)
      if (emailError.response) {
        console.error('API yanıtı:', emailError.response)
      }
      // Email hatası yanıt kaydını engellemez
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact respond error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
