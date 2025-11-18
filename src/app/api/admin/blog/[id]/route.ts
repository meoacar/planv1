import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateBlogPostSchema } from '@/validations/blog.schema'
import { generateSlug } from '@/lib/blog/slug-generator'
import { calculateReadingTime } from '@/lib/blog/reading-time'

// GET /api/admin/blog/[id] - Blog detay
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let retryCount = 0
  const maxRetries = 2

  while (retryCount <= maxRetries) {
    try {
      const session = await auth()

      // Admin kontrolü
      if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
      }

      const { id } = await params
      
      const blogPost = await db.blogPost.findUnique({
        where: { 
          id,
          deletedAt: null,
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
      })

      if (!blogPost) {
        return NextResponse.json(
          { error: 'Blog yazısı bulunamadı' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: blogPost,
      })

    } catch (error: any) {
      console.error(`Blog detay hatası (deneme ${retryCount + 1}/${maxRetries + 1}):`, error)

      // Prisma connection errors - retry
      const isConnectionError = 
        error.code === 'P1001' || 
        error.code === 'P1017' ||
        error.message?.includes('Server has closed the connection') ||
        error.message?.includes('Connection pool timeout')

      if (isConnectionError && retryCount < maxRetries) {
        retryCount++
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        
        try {
          await db.$connect()
        } catch (reconnectError) {
          console.error('Yeniden bağlanma hatası:', reconnectError)
        }
        
        continue
      }

      if (isConnectionError) {
        return NextResponse.json(
          { error: 'Veritabanı bağlantı hatası' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: 'Blog detayı alınırken bir hata oluştu' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'İşlem tamamlanamadı' },
    { status: 500 }
  )
}

// PUT /api/admin/blog/[id] - Blog güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Read body once before retry loop
  let body: any
  try {
    body = await req.json()
  } catch (error) {
    return NextResponse.json(
      { error: 'Geçersiz istek verisi' },
      { status: 400 }
    )
  }

  const { id } = await params

  let retryCount = 0
  const maxRetries = 2

  while (retryCount <= maxRetries) {
    try {
      const session = await auth()

      // Admin kontrolü
      if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
      }
      
      // Validation
      const validatedData = updateBlogPostSchema.parse({ ...body, id })

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

      // Slug değiştiriliyorsa benzersizlik kontrolü
      if (validatedData.slug && validatedData.slug !== existingPost.slug) {
        const slugExists = await db.blogPost.findUnique({
          where: { slug: validatedData.slug },
        })

        if (slugExists) {
          return NextResponse.json(
            { error: 'Bu slug zaten kullanılıyor' },
            { status: 400 }
          )
        }
      }

      // Okuma süresi hesapla (içerik değiştiyse)
      const readingTime = validatedData.content 
        ? calculateReadingTime(validatedData.content)
        : existingPost.readingTime

      // Excerpt oluştur (eğer yoksa ve içerik değiştiyse)
      let excerpt = validatedData.excerpt
      if (!excerpt && validatedData.content) {
        excerpt = validatedData.content.substring(0, 300).replace(/<[^>]*>/g, '').trim()
      }

      // publishedAt güncelle (status PUBLISHED'a değiştiyse ve daha önce yayınlanmadıysa)
      let publishedAt = existingPost.publishedAt
      if (validatedData.status === 'PUBLISHED' && !existingPost.publishedAt) {
        publishedAt = new Date()
      } else if (validatedData.status && validatedData.status !== 'PUBLISHED') {
        publishedAt = null
      }

      // Blog post güncelle
      const blogPost = await db.blogPost.update({
        where: { id },
        data: {
          ...(validatedData.title && { title: validatedData.title }),
          ...(validatedData.slug && { slug: validatedData.slug }),
          ...(validatedData.content && { content: validatedData.content }),
          ...(excerpt && { excerpt }),
          ...(validatedData.coverImage !== undefined && { coverImage: validatedData.coverImage }),
          ...(validatedData.coverImageAlt !== undefined && { coverImageAlt: validatedData.coverImageAlt }),
          ...(validatedData.metaTitle !== undefined && { metaTitle: validatedData.metaTitle }),
          ...(validatedData.metaDescription !== undefined && { metaDescription: validatedData.metaDescription }),
          ...(validatedData.status && { status: validatedData.status }),
          ...(validatedData.featured !== undefined && { featured: validatedData.featured }),
          ...(validatedData.featuredOrder !== undefined && { featuredOrder: validatedData.featuredOrder }),
          ...(validatedData.categoryId && { categoryId: validatedData.categoryId }),
          readingTime,
          publishedAt,
          ...(validatedData.tags && {
            blog_tags: {
              set: [], // Önce mevcut etiketleri temizle
              connectOrCreate: validatedData.tags.map(tagName => ({
                where: { slug: generateSlug(tagName) },
                create: {
                  name: tagName,
                  slug: generateSlug(tagName),
                },
              })),
            },
          }),
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
        data: blogPost,
      })

    } catch (error: any) {
      console.error(`Blog güncelleme hatası (deneme ${retryCount + 1}/${maxRetries + 1}):`, error)

      if (error.name === 'ZodError') {
        const firstError = error.errors[0]
        console.error('Validation hatası:', error.errors)
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

      // Prisma connection errors - retry
      const isConnectionError = 
        error.code === 'P1001' || 
        error.code === 'P1017' ||
        error.message?.includes('Server has closed the connection') ||
        error.message?.includes('Connection pool timeout') ||
        error.message?.includes('Can\'t reach database server')

      if (isConnectionError && retryCount < maxRetries) {
        retryCount++
        console.log(`Veritabanı bağlantısı yeniden deneniyor... (${retryCount}/${maxRetries})`)
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        
        // Try to reconnect
        try {
          await db.$connect()
        } catch (reconnectError) {
          console.error('Yeniden bağlanma hatası:', reconnectError)
        }
        
        continue // Retry the operation
      }

      if (isConnectionError) {
        console.error('Veritabanı bağlantı hatası detayı:', {
          code: error.code,
          message: error.message,
          meta: error.meta
        })
        
        return NextResponse.json(
          { 
            error: 'Veritabanı bağlantı hatası',
            details: 'Veritabanı bağlantısı kurulamadı. Lütfen tekrar deneyin.',
            code: error.code
          },
          { status: 503 }
        )
      }

      console.error('Blog güncelleme hatası detayı:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      })

      return NextResponse.json(
        { 
          error: 'Blog güncellenirken bir hata oluştu',
          details: error.message || error.toString(),
          code: error.code
        },
        { status: 500 }
      )
    }
  }

  // Should never reach here, but just in case
  return NextResponse.json(
    { error: 'İşlem tamamlanamadı' },
    { status: 500 }
  )
}

// DELETE /api/admin/blog/[id] - Blog sil (soft delete)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  let retryCount = 0
  const maxRetries = 2

  while (retryCount <= maxRetries) {
    try {
      const session = await auth()

      // Admin kontrolü
      if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
      }

      // Blog var mı kontrol et
      const existingPost = await db.blogPost.findUnique({
        where: { 
          id,
          deletedAt: null,
        },
      })

      if (!existingPost) {
        return NextResponse.json(
          { error: 'Blog yazısı bulunamadı' },
          { status: 404 }
        )
      }

      // Soft delete
      await db.blogPost.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: 'ARCHIVED',
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Blog yazısı başarıyla silindi',
      })

    } catch (error: any) {
      console.error(`Blog silme hatası (deneme ${retryCount + 1}/${maxRetries + 1}):`, error)

      const isConnectionError = 
        error.code === 'P1001' || 
        error.code === 'P1017' ||
        error.message?.includes('Server has closed the connection')

      if (isConnectionError && retryCount < maxRetries) {
        retryCount++
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount))
        
        try {
          await db.$connect()
        } catch (reconnectError) {
          console.error('Yeniden bağlanma hatası:', reconnectError)
        }
        
        continue
      }

      if (isConnectionError) {
        return NextResponse.json(
          { error: 'Veritabanı bağlantı hatası' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { error: 'Blog silinirken bir hata oluştu' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json(
    { error: 'İşlem tamamlanamadı' },
    { status: 500 }
  )
}
