import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Planı bul
    const plan = await db.plan.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        description: true,
        tags: true,
        difficulty: true,
      },
    })

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan bulunamadı' },
        { status: 404 }
      )
    }

    // Tag'leri çıkar
    const planTags = plan.tags
      ? plan.tags.split(',').map((t) => t.trim().toLowerCase())
      : []

    // Anahtar kelimeleri çıkar (başlık ve açıklamadan)
    const keywords = [
      ...plan.title.toLowerCase().split(' '),
      ...plan.description.toLowerCase().split(' '),
    ]
      .filter((word) => word.length > 3) // Kısa kelimeleri filtrele
      .slice(0, 10) // İlk 10 kelime

    // İlgili blog yazılarını bul
    const blogs = await db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        OR: [
          // Tag eşleşmesi
          ...(planTags.length > 0
            ? [
                {
                  blog_tags: {
                    some: {
                      name: {
                        in: planTags,
                      },
                    },
                  },
                },
              ]
            : []),
          // Başlık/içerik benzerliği
          ...keywords.map((keyword) => ({
            OR: [
              { title: { contains: keyword } },
              { content: { contains: keyword } },
              { excerpt: { contains: keyword } },
            ],
          })),
        ],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        readingTime: true,
        viewCount: true,
        category: {
          select: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: [
        { viewCount: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: 5,
    })

    return NextResponse.json({
      success: true,
      data: blogs,
    })
  } catch (error: any) {
    console.error('Get related blogs error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'İlgili blog yazıları yüklenirken hata oluştu',
      },
      { status: 500 }
    )
  }
}
