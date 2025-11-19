import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Mesaj durumunu güncelle
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const { status } = await request.json()

    await db.contactMessage.update({
      where: { id: params.id },
      data: { status },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact status update error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Mesajı sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    await db.contactMessage.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact delete error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
