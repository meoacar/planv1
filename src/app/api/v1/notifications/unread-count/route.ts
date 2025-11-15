import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { NotificationService } from '@/services/notification.service'

// GET /api/v1/notifications/unread-count
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

    const count = await NotificationService.getUnreadCount(session.user.id)

    return NextResponse.json({
      success: true,
      data: { count },
    })
  } catch (error: any) {
    console.error('Get unread count error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'GET_UNREAD_COUNT_ERROR',
          message: error.message || 'Okunmamış bildirim sayısı alınırken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
