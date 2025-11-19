import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// PATCH /api/v1/admin/groups/[id]/approve - Approve group
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Bu işlem için yetkiniz yok',
          },
        },
        { status: 403 }
      )
    }

    const group = await db.group.findUnique({
      where: { id: params.id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    })

    if (!group) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Grup bulunamadı',
          },
        },
        { status: 404 }
      )
    }

    // Update group status
    const updated = await db.group.update({
      where: { id: params.id },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
    })

    // Create notification for creator
    await db.notification.create({
      data: {
        userId: group.creatorId,
        type: 'plan_approved',
        title: 'Grubun Onaylandı! 🎉',
        body: `"${group.name}" grubun yayınlandı ve artık herkes katılabilir!`,
        targetType: 'plan',
        targetId: group.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Approve group error:', error)

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'APPROVE_ERROR',
          message: error.message || 'Grup onaylanırken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
