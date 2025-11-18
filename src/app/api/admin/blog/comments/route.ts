import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/admin/blog/comments - Bekleyen yorumları listele
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
    const status = searchParams.get('status') || 'PENDING'
    const postId = searchParams.get('postId')

    const skip = (page - 1) * limit

    // Filtreler
    const where: any = {}

    // Status filtresi
    if (status && ['PENDING', 'APPROVED', 'REJECTED', 'SPAM'].includes(status)) {
      where.status = status
    }

    // Post ID filtresi
    if (postId) {
      where.postId = postId
    }

    const [comments, total] = await Promise.all([
      db.blogComment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              email: true,
            },
          },
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      db.blogComment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Blog yorum listesi hatası:', error)
    return NextResponse.json(
      { error: 'Yorum listesi alınırken bir hata oluştu' },
      { status: 500 }
    )
  }
}
