import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { NotificationService } from '@/services/notification.service'

// GET /api/v1/notifications - Get notifications
export async function GET(req: NextRequest) {
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const result = await NotificationService.getNotifications(session.user.id, page, limit)

    return NextResponse.json({
      success: true,
      data: result.items,
      meta: {
        ...result.pagination,
        unreadCount: result.unreadCount,
      },
    })
  } catch (error: any) {
    console.error('Get notifications error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_NOTIFICATIONS_ERROR',
          message: error.message || 'Bildirimler yüklenirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
