import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { CommentService } from '@/services/comment.service'
import { NotificationService } from '@/services/notification.service'
import { commentSchema } from '@/validations/plan.schema'
import { rateLimit } from '@/lib/redis'

// GET /api/v1/comments - Get comments
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const targetType = searchParams.get('targetType') || 'plan'
    const targetId = searchParams.get('targetId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!targetId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_TARGET_ID',
            message: 'targetId gerekli',
          },
        },
        { status: 400 }
      )
    }

    const result = await CommentService.getComments(targetType, targetId, page, limit)

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.pagination,
    })
  } catch (error: any) {
    console.error('Get comments error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_COMMENTS_ERROR',
          message: error.message || 'Yorumlar yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/comments - Create comment
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Giriş yapmalısınız',
          },
        },
        { status: 401 }
      )
    }

    // Rate limiting
    const rateLimitKey = `comment:${session.user.id}`
    const { success } = await rateLimit(rateLimitKey, 20, 3600) // 20 comments per hour

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT',
            message: 'Çok fazla yorum denemesi. Lütfen 1 saat sonra tekrar deneyin.',
          },
        },
        { status: 429 }
      )
    }

    const body = await req.json()

    // Validate
    const validatedData = commentSchema.parse(body)

    // Create comment
    const comment = await CommentService.createComment(session.user.id, validatedData)

    // Send notification
    if (validatedData.targetType === 'plan') {
      await NotificationService.notifyComment(validatedData.targetId, session.user.id)
    }

    return NextResponse.json({
      success: true,
      data: comment,
    })
  } catch (error: any) {
    console.error('Create comment error:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_COMMENT_ERROR',
          message: error.message || 'Yorum oluşturulurken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
