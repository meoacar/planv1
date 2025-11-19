import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// GET /api/admin/notifications - Get admin notifications
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // TODO: Implement real admin notifications
    // For now, return empty array
    return NextResponse.json({
      notifications: [],
    })
  } catch (error: any) {
    console.error('Get admin notifications error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
