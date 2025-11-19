import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { z } from 'zod'

const rejectSchema = z.object({
  reason: z.string().min(10, 'Reddetme sebebi en az 10 karakter olmalı'),
})

// PATCH /api/v1/admin/groups/[id]/reject - Reject group
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

    const body = await req.json()
    const { reason } = rejectSchema.parse(body)

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
        status: 'rejected',
        rejectionReason: reason,
      },
    })

    // Create notification for creator
    await db.notification.create({
      data: {
        userId: group.creatorId,
        type: 'plan_rejected',
        title: 'Grubun Reddedildi',
        body: `"${group.name}" grubun reddedildi. Sebep: ${reason}`,
        targetType: 'plan',
        targetId: group.id,
      },
    })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error: any) {
    console.error('Reject group error:', error)

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
          code: 'REJECT_ERROR',
          message: error.message || 'Grup reddedilirken hata oluştu',
        },
      },
      { status: 500 }
    )
  }
}
