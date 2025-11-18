import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { createBlogPostSchema } from '@/validations/blog.schema'
import { generateSlug } from '@/lib/blog/slug-generator'
import { calculateReadingTime } from '@/lib/blog/reading-time'

// POST /api/admin/blog - Blog oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const body = await req.json()
    
    // Validation
    const validatedData = createBlogPostSchema.parse(body)

    // Slug oluştur
    const slug = validatedData.slug || generateSlug(validatedData.title)

    // Slug kontrolü (sadece silinmemiş yazılar)
    const existingPost = await db.blogPost.findFirst({
      where: { 
        slug,
        deletedAt: null,
      },
      select: { id: true },
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor', details: 'Lütfen farklı bir başlık deneyin' },
        { status: 400 }
      )
    }

    // Okuma süresi
    const readingTime = calculateReadingTime(validatedData.content)

    // Excerpt
    const excerpt = validatedData.excerpt || 
      validatedData.content.substring(0, 300).replace(/<[^>]*>/g, '').trim()

    // Blog oluştur (transaction OLMADAN - daha hızlı)
    const blogPost = await db.blogPost.create({
      data: {
        title: validatedData.title,
        slug,
        content: validatedData.content,
        excerpt,
        coverImage: validatedData.coverImage,
        coverImageAlt: validatedData.coverImageAlt,
        metaTitle: validatedData.metaTitle || validatedData.title,
        metaDescription: validatedData.metaDescription || excerpt,
        status: validatedData.status || 'DRAFT',
        featured: validatedData.featured || false,
        featuredOrder: validatedData.featuredOrder,
        readingTime,
        authorId: session.user.id,
        categoryId: validatedData.categoryId,
        publishedAt: validatedData.status === 'PUBLISHED' ? new Date() : null,
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
      },
    })

    // Tags ekle (varsa)
    if (validatedData.tags && validatedData.tags.length > 0) {
      for (const tagName of validatedData.tags) {
        const tagSlug = generateSlug(tagName)
        
        // Tag var mı kontrol et, yoksa oluştur
        let tag = await db.blogTag.findUnique({
          where: { slug: tagSlug },
        })

        if (!tag) {
          tag = await db.blogTag.create({
            data: {
              name: tagName,
              slug: tagSlug,
            },
          })
        }

        // Blog'a bağla
        await db.blogPost.update({
          where: { id: blogPost.id },
          data: {
            blog_tags: {
              connect: { id: tag.id },
            },
          },
        })
      }
    }

    // Final blog'u getir (tags ile)
    const finalBlogPost = await db.blogPost.findUnique({
      where: { id: blogPost.id },
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
      data: finalBlogPost,
    }, { status: 201 })

  } catch (error: any) {
    console.error('Blog oluşturma hatası:', error)

    // Zod validation hatası
    if (error.name === 'ZodError') {
      const firstError = error.errors[0]
      return NextResponse.json(
        { 
          error: 'Geçersiz veri', 
          details: firstError?.message || 'Lütfen tüm zorunlu alanları doldurun',
          field: firstError?.path?.join('.'),
          allErrors: error.errors 
        },
        { status: 400 }
      )
    }

    // Prisma hatası
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Database bağlantı hatası
    if (error.code === 'P1001' || error.code === 'P1017' || error.code === 'P2024') {
      return NextResponse.json(
        { error: 'Veritabanı bağlantısı kesildi', details: 'MySQL servisini yeniden başlatın' },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Blog oluşturulurken bir hata oluştu',
        details: error.message || 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}

// GET /api/admin/blog - Admin blog listesi
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    // Admin kontrolü
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    // Filtreler
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ]
    }

    // Soft delete kontrolü
    where.deletedAt = null

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      db.blogPost.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

  } catch (error: any) {
    console.error('Blog listesi hatası:', error)
    return NextResponse.json(
      { error: 'Blog listesi alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
