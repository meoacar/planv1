import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const pageSchema = z.object({
  slug: z.string().min(1, 'Slug gerekli'),
  title: z.string().min(1, 'Başlık gerekli'),
  content: z.string().min(1, 'İçerik gerekli'),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  isPublished: z.boolean().default(false),
  sortOrder: z.number().default(0),
})

// Sayfa güncelle
export async function PUT(
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

    const body = await request.json()
    const data = pageSchema.parse(body)

    // Mevcut sayfayı kontrol et
    const existingPage = await db.page.findUnique({
      where: { id: id },
    })

    if (!existingPage) {
      return NextResponse.json(
        { message: 'Sayfa bulunamadı' },
        { status: 404 }
      )
    }

    // Slug kontrolü (başka bir sayfa kullanıyor mu?)
    if (data.slug !== existingPage.slug) {
      const slugInUse = await db.page.findUnique({
        where: { slug: data.slug },
      })

      if (slugInUse) {
        return NextResponse.json(
          { message: 'Bu slug zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    const page = await db.page.update({
      where: { id: id },
      data: {
        ...data,
        status: data.isPublished ? 'published' : 'draft',
        publishedAt: data.isPublished && !existingPage.publishedAt 
          ? new Date() 
          : existingPage.publishedAt,
      },
    })

    return NextResponse.json(page)
  } catch (error: any) {
    console.error('Page update error:', error)
    return NextResponse.json(
      { message: error.message || 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Sayfa sil
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

    await db.page.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Page delete error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
