import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false
      },
      data: {
        read: true
      }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Bildirimler güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Bildirimler güncellenemedi' },
      { status: 500 }
    )
  }
}
