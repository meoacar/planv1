import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const featureSchema = z.object({
  featured: z.boolean(),
  featuredOrder: z.number().int().min(0).max(10).optional(),
})

// POST /api/admin/blog/[id]/feature - Blog öne çıkar
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    // Admin kontrolü
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = featureSchema.parse(body)

    // Blog var mı kontrol et
    const existingPost = await db.blogPost.findUnique({
      where: { 
        id: params.id,
        deletedAt: null,
      },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      )
    }

    // Yayınlanmış mı kontrol et
    if (existingPost.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Sadece yayınlanmış blog yazıları öne çıkarılabilir' },
        { status: 400 }
      )
    }

    // Öne çıkarılıyorsa, maksimum 3 featured post kontrolü
    if (validatedData.featured) {
      const featuredCount = await db.blogPost.count({
        where: {
          featured: true,
          deletedAt: null,
          id: { not: params.id },
        },
      })

      if (featuredCount >= 3) {
        return NextResponse.json(
          { error: 'Maksimum 3 blog yazısı öne çıkarılabilir. Önce başka bir yazıyı kaldırın.' },
          { status: 400 }
        )
      }
    }

    // Blog öne çıkar/kaldır
    const blogPost = await db.blogPost.update({
      where: { id: params.id },
      data: {
        featured: validatedData.featured,
        featuredOrder: validatedData.featured ? validatedData.featuredOrder : null,
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
      message: validatedData.featured 
        ? 'Blog yazısı öne çıkarıldı' 
        : 'Blog yazısı öne çıkarılmış listesinden kaldırıldı',
      data: blogPost,
    })

  } catch (error: any) {
    console.error('Blog öne çıkarma hatası:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'İşlem sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
