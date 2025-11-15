import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { UserService } from '@/services/user.service'
import { NotificationService } from '@/services/notification.service'

// POST /api/v1/follow - Follow user
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

    const { targetId } = await req.json()

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

    if (targetId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'CANNOT_FOLLOW_SELF',
            message: 'Kendinizi takip edemezsiniz',
          },
        },
        { status: 400 }
      )
    }

    await UserService.followUser(session.user.id, targetId)
    await NotificationService.notifyFollow(targetId, session.user.id)

    return NextResponse.json({
      success: true,
      data: { message: 'Takip edildi' },
    })
  } catch (error: any) {
    console.error('Follow error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FOLLOW_ERROR',
          message: error.message || 'Takip işlemi sırasında hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/follow - Unfollow user
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const targetId = searchParams.get('targetId')

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

    await UserService.unfollowUser(session.user.id, targetId)

    return NextResponse.json({
      success: true,
      data: { message: 'Takip bırakıldı' },
    })
  } catch (error: any) {
    console.error('Unfollow error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNFOLLOW_ERROR',
          message: error.message || 'Takip bırakma işlemi sırasında hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
