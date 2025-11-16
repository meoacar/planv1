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

// Yeni sayfa oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = pageSchema.parse(body)

    // Slug kontrolü
    const existingPage = await db.page.findUnique({
      where: { slug: data.slug },
    })

    if (existingPage) {
      return NextResponse.json(
        { message: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      )
    }

    const page = await db.page.create({
      data: {
        ...data,
        status: data.isPublished ? 'published' : 'draft',
        publishedAt: data.isPublished ? new Date() : null,
      },
    })

    return NextResponse.json(page)
  } catch (error: any) {
    console.error('Page create error:', error)
    return NextResponse.json(
      { message: error.message || 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}

// Tüm sayfaları listele
export async function GET() {
  try {
    const pages = await db.page.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Pages fetch error:', error)
    return NextResponse.json(
      { message: 'Bir hata oluştu' },
      { status: 500 }
    )
  }
}
