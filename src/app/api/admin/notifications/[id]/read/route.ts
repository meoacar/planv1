import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    await prisma.notification.update({
      where: {
        id: id,
        userId: session.user.id
      },
      data: {
        read: true
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
