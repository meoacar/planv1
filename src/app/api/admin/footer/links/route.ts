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

    const { links } = await request.json()

    // Tüm linkleri güncelle/oluştur
    for (const link of links) {
      if (link.id.startsWith('new-')) {
        // Yeni link oluştur
        await db.footerLink.create({
          data: {
            title: link.title,
            url: link.url,
            column: link.column,
            sortOrder: link.sortOrder,
            isActive: link.isActive,
            openInNew: link.openInNew,
          },
        })
      } else {
        // Mevcut linki güncelle
        await db.footerLink.update({
          where: { id: link.id },
          data: {
            title: link.title,
            url: link.url,
            column: link.column,
            sortOrder: link.sortOrder,
            isActive: link.isActive,
            openInNew: link.openInNew,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Footer links save error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
