import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// POST /api/admin/blog/[id]/publish - Blog yayınla
export async function POST(
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

    // Blog var mı kontrol et
    const existingPost = await db.blogPost.findUnique({
      where: { 
        id: id,
        deletedAt: null,
      },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      )
    }

    // Zaten yayınlanmış mı kontrol et
    if (existingPost.status === 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Blog yazısı zaten yayınlanmış' },
        { status: 400 }
      )
    }

    // Blog yayınla
    const blogPost = await db.blogPost.update({
      where: { id: id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        category: true,
        blog_tags: true,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Blog yazısı başarıyla yayınlandı',
      data: blogPost,
    })

  } catch (error: any) {
    console.error('Blog yayınlama hatası:', error)
    return NextResponse.json(
      { error: 'Blog yayınlanırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
