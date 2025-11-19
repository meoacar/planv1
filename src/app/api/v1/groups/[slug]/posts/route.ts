import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1, 'Gönderi içeriği gerekli').max(5000),
  images: z.array(z.string().url()).max(4).optional(),
})

// GET /api/v1/groups/[slug]/posts - List group posts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const group = await db.group.findUnique({
      where: { slug: params.slug },
    })

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Grup bulunamadı' },
        },
        { status: 404 }
      )
    }

    const [posts, total] = await Promise.all([
      db.groupPost.findMany({
        where: {
          groupId: group.id,
          status: 'visible',
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
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      db.groupPost.count({
        where: {
          groupId: group.id,
          status: 'visible',
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching group posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'FETCH_ERROR', message: 'Gönderiler yüklenemedi' },
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/groups/[slug]/posts - Create group post
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Giriş yapmalısınız' },
        },
        { status: 401 }
      )
    }

    const group = await db.group.findUnique({
      where: { slug: params.slug },
    })

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Grup bulunamadı' },
        },
        { status: 404 }
      )
    }

    // Check if user is member
    const member = await db.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: group.id,
          userId: session.user.id,
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'FORBIDDEN', message: 'Bu grubun üyesi değilsiniz' },
        },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validated = createPostSchema.parse(body)

    const post = await db.groupPost.create({
      data: {
        groupId: group.id,
        authorId: session.user.id,
        title: validated.title,
        body: validated.body,
        images: validated.images ? JSON.stringify(validated.images) : null,
        status: 'visible',
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
      },
    })

    // Increment post count
    await db.group.update({
      where: { id: group.id },
      data: { postCount: { increment: 1 } },
    })

    // Add Guild XP
    try {
      const { addGuildXP, GuildXPAction } = await import('@/services/guild-xp.service')
      await addGuildXP(session.user.id, GuildXPAction.COMMENT)
    } catch (error) {
      console.error('Guild XP error:', error)
    }

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: error.errors[0].message },
        },
        { status: 400 }
      )
    }
    console.error('Error creating group post:', error)
    return NextResponse.json(
      {
        success: false,
        error: { code: 'CREATE_ERROR', message: 'Gönderi oluşturulamadı' },
      },
      { status: 500 }
    )
  }
}
