import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    await prisma.notification.update({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: {
        isRead: true
      }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Bildirim güncellenirken hata:', error)
    return NextResponse.json(
      { error: 'Bildirim güncellenemedi' },
      { status: 500 }
    )
  }
}
