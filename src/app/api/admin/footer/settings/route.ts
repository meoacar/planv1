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

    const { settings } = await request.json()

    // Her ayarı güncelle veya oluştur
    for (const [key, value] of Object.entries(settings)) {
      await db.footerSetting.upsert({
        where: { key },
        update: { value: value as string },
        create: {
          key,
          value: value as string,
          description: null,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Footer settings save error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
