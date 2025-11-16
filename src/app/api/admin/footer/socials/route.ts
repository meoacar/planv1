import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { socials } = await request.json()

    // Tüm sosyal medya linklerini güncelle/oluştur
    for (const social of socials) {
      if (social.id.startsWith('new-')) {
        // Yeni link oluştur
        await db.footerSocial.create({
          data: {
            platform: social.platform,
            url: social.url,
            icon: social.icon,
            sortOrder: social.sortOrder,
            isActive: social.isActive,
          },
        })
      } else {
        // Mevcut linki güncelle
        await db.footerSocial.update({
          where: { id: social.id },
          data: {
            platform: social.platform,
            url: social.url,
            icon: social.icon,
            sortOrder: social.sortOrder,
            isActive: social.isActive,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Footer socials save error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
