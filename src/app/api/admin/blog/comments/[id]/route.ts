import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { moderateBlogCommentSchema } from '@/validations/blog.schema'

// PUT /api/admin/blog/comments/[id] - Yorum durumunu güncelle (Onayla/Reddet/Spam)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = await auth()

    // Admin kontrolü
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    // Yorum var mı kontrol et
    const existingComment = await db.blogComment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Yorum bulunamadı' },
        { status: 404 }
      )
    }

    const body = await req.json()

    // Validation
    const validatedData = moderateBlogCommentSchema.parse(body)

    // Yorum durumunu güncelle
    const updatedComment = await db.blogComment.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    // Başarı mesajı
    let message = 'Yorum durumu güncellendi'
    switch (validatedData.status) {
      case 'APPROVED':
        message = 'Yorum onaylandı'
        break
      case 'REJECTED':
        message = 'Yorum reddedildi'
        break
      case 'SPAM':
        message = 'Yorum spam olarak işaretlendi'
        break
      case 'PENDING':
        message = 'Yorum beklemeye alındı'
        break
    }

    return NextResponse.json({
      success: true,
      data: updatedComment,
      message,
    })
  } catch (error: any) {
    console.error('Blog yorum güncelleme hatası:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Yorum güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
