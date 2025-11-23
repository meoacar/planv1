import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = status
    }

    if (provider) {
      where.paymentProvider = provider
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              name: true
            }
          },
          subscription: {
            select: {
              id: true,
              premiumType: true,
              status: true
            }
          }
        }
      }),
      db.payment.count({ where })
    ])

    // İstatistikler
    const stats = await db.payment.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      },
      _count: true
    })

    return NextResponse.json({
      payments,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error: any) {
    console.error('Admin payments error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}
