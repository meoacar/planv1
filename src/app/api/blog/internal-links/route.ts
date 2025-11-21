import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exclude = searchParams.get('exclude')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '5')

    const where: any = {
      status: 'published'
    }

    if (exclude) {
      where.id = { not: exclude }
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    // Popüler ve güncel içerikleri getir
    const links = await db.blogPost.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        views: true,
        createdAt: true
      },
      orderBy: [
        { views: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({ 
      links,
      total: links.length
    })

  } catch (error) {
    console.error('İç linkler API hatası:', error)
    return NextResponse.json(
      { error: 'İç linkler yüklenemedi' },
      { status: 500 }
    )
  }
}
