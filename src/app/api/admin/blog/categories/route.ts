import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createBlogCategorySchema } from '@/validations/blog.schema'
import { generateSlug } from '@/lib/blog/slug-generator'

// POST /api/admin/blog/categories - Kategori oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    // Admin kontrolü
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const body = await req.json()
    
    // Validation
    const validatedData = createBlogCategorySchema.parse(body)

    // Slug oluştur (eğer yoksa)
    const slug = validatedData.slug || generateSlug(validatedData.name)

    // Slug benzersizliği kontrolü
    const existingCategory = await db.blogCategory.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // İsim benzersizliği kontrolü
    const existingName = await db.blogCategory.findUnique({
      where: { name: validatedData.name },
    })

    if (existingName) {
      return NextResponse.json(
        { error: 'Bu kategori adı zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Kategori oluştur
    const category = await db.blogCategory.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        icon: validatedData.icon,
        color: validatedData.color,
        order: validatedData.order ?? 0,
      },
    })

    return NextResponse.json({
      success: true,
      data: category,
    }, { status: 201 })

  } catch (error: any) {
    console.error('Kategori oluşturma hatası:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Kategori oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// GET /api/admin/blog/categories - Kategori listesi
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    // Admin kontrolü
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const categories = await db.blogCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: categories,
    })

  } catch (error: any) {
    console.error('Kategori listesi hatası:', error)
    return NextResponse.json(
      { error: 'Kategori listesi alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
