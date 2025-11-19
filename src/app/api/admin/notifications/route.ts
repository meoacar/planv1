import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        type: {
          in: [
            'recipe_pending',
            'comment_reported',
            'user_reported',
            'confession_pending',
            'appeal_pending',
            'system_alert'
          ]
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    return NextResponse.json({
      success: true,
      notifications
    })
  } catch (error) {
    console.error('Bildirimler yüklenirken hata:', error)
    return NextResponse.json(
      { error: 'Bildirimler yüklenemedi' },
      { status: 500 }
    )
  }
}
