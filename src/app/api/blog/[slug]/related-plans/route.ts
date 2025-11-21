import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Blog yazısını bul
    const post = await db.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        categoryId: true,
        blog_tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog yazısı bulunamadı' },
        { status: 404 }
      )
    }

    // Tag'leri çıkar
    const tagNames = post.blog_tags.map((t) => t.name.toLowerCase())

    // İlgili planları bul
    // 1. Aynı tag'lere sahip planlar
    // 2. Benzer başlık/açıklama içeren planlar
    const plans = await db.plan.findMany({
      where: {
        status: 'published',
        OR: [
          // Tag eşleşmesi
          ...(tagNames.length > 0
            ? tagNames.map((tag) => ({
                tags: {
                  contains: tag,
                },
              }))
            : []),
          // Başlık/açıklama benzerliği
          {
            OR: [
              { title: { contains: post.title.split(' ')[0] } },
              { description: { contains: post.title.split(' ')[0] } },
            ],
          },
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        duration: true,
        difficulty: true,
        targetWeightLoss: true,
        authorWeightLoss: true,
        averageRating: true,
        likesCount: true,
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },
      orderBy: [
        { averageRating: 'desc' },
        { likesCount: 'desc' },
      ],
      take: 5,
    })

    return NextResponse.json({
      success: true,
      data: plans,
    })
  } catch (error: any) {
    console.error('Get related plans error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'İlgili planlar yüklenirken hata oluştu',
      },
      { status: 500 }
    )
  }
}
