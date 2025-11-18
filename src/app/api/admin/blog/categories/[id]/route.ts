import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateBlogCategorySchema } from '@/validations/blog.schema'
import { generateSlug } from '@/lib/blog/slug-generator'

// PUT /api/admin/blog/categories/[id] - Kategori güncelle
export async function PUT(
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
    
    // Validation
    const validatedData = updateBlogCategorySchema.parse({
      ...body,
      id: params.id,
    })

    // Kategori var mı kontrol et
    const existingCategory = await db.blogCategory.findUnique({
      where: { id: params.id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    // Slug güncelleniyorsa benzersizlik kontrolü
    if (validatedData.slug) {
      const slugExists = await db.blogCategory.findFirst({
        where: {
          slug: validatedData.slug,
          id: { not: params.id },
        },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Bu slug zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    // İsim güncelleniyorsa benzersizlik kontrolü
    if (validatedData.name) {
      const nameExists = await db.blogCategory.findFirst({
        where: {
          name: validatedData.name,
          id: { not: params.id },
        },
      })

      if (nameExists) {
        return NextResponse.json(
          { error: 'Bu kategori adı zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    // Slug oluştur (isim değiştiyse ve slug verilmediyse)
    const updateData: any = { ...validatedData }
    if (validatedData.name && !validatedData.slug) {
      updateData.slug = generateSlug(validatedData.name)
    }

    // ID'yi kaldır (Prisma update'te kullanılmaz)
    delete updateData.id

    // Kategori güncelle
    const category = await db.blogCategory.update({
      where: { id: params.id },
      data: updateData,
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
      data: category,
    })

  } catch (error: any) {
    console.error('Kategori güncelleme hatası:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Kategori güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/blog/categories/[id] - Kategori sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    // Admin kontrolü
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    // Kategori var mı kontrol et
    const category = await db.blogCategory.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    // Kategoriye ait blog yazısı varsa silmeyi engelle
    if (category._count.posts > 0) {
      return NextResponse.json(
        { 
          error: 'Bu kategoriye ait blog yazıları var. Önce blog yazılarını silmeniz veya başka bir kategoriye taşımanız gerekiyor.',
          postCount: category._count.posts,
        },
        { status: 400 }
      )
    }

    // Kategoriyi sil
    await db.blogCategory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla silindi',
    })

  } catch (error: any) {
    console.error('Kategori silme hatası:', error)
    return NextResponse.json(
      { error: 'Kategori silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
