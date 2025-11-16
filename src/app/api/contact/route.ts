import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalı').max(100),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  subject: z.string().min(3, 'Konu en az 3 karakter olmalı').max(200),
  message: z.string().min(10, 'Mesaj en az 10 karakter olmalı').max(1000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = contactSchema.parse(body)

    // IP ve User Agent bilgilerini al
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Spam kontrolü - aynı IP'den son 1 saatte 5'ten fazla mesaj
    const recentMessages = await db.contactMessage.count({
      where: {
        ipAddress,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Son 1 saat
        },
      },
    })

    if (recentMessages >= 5) {
      return NextResponse.json(
        { message: 'Çok fazla mesaj gönderdiniz. Lütfen daha sonra tekrar deneyin.' },
        { status: 429 }
      )
    }

    // Mesajı kaydet
    const contactMessage = await db.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        ipAddress,
        userAgent,
        status: 'new',
      },
    })

    // Admin'e email gönder (opsiyonel)
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@zayiflamaplan.com',
        subject: `Yeni İletişim Mesajı: ${data.subject}`,
        html: `
          <h2>Yeni İletişim Mesajı</h2>
          <p><strong>Gönderen:</strong> ${data.name}</p>
          <p><strong>E-posta:</strong> ${data.email}</p>
          <p><strong>Konu:</strong> ${data.subject}</p>
          <p><strong>Mesaj:</strong></p>
          <p>${data.message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Mesaj ID: ${contactMessage.id}</small></p>
          <p><small>Tarih: ${new Date().toLocaleString('tr-TR')}</small></p>
        `,
      })
    } catch (emailError) {
      console.error('Email gönderme hatası:', emailError)
      // Email hatası mesaj kaydını engellemez
    }

    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    )
  }
}
