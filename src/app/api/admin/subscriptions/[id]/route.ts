import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await db.subscription.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            name: true,
            image: true,
            isPremium: true,
            premiumUntil: true
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!subscription) {
      return NextResponse.json(
        { error: 'Abonelik bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json(subscription)
  } catch (error: any) {
    console.error('Admin subscription detail error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { status, endDate } = body

    const updateData: any = {}
    
    if (status) updateData.status = status
    if (endDate) updateData.endDate = new Date(endDate)

    const subscription = await db.subscription.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: true
      }
    })

    // Eğer abonelik iptal edildiyse kullanıcının premium durumunu güncelle
    if (status === 'cancelled' || status === 'expired') {
      await db.user.update({
        where: { id: subscription.userId },
        data: {
          isPremium: false,
          premiumType: null
        }
      })
    }

    return NextResponse.json(subscription)
  } catch (error: any) {
    console.error('Admin subscription update error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}
