import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfWeek, endOfWeek } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const weekOffset = parseInt(searchParams.get('weekOffset') || '0')

    // Hafta başlangıç ve bitiş tarihleri
    const now = new Date()
    now.setDate(now.getDate() + (weekOffset * 7))
    
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    // Bu haftanın özetini getir
    const summary = await prisma.sinWeeklySummary.findFirst({
      where: {
        userId,
        weekStart: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!summary) {
      return NextResponse.json(
        { error: 'No summary found for this week' },
        { status: 404 }
      )
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Get weekly summary error:', error)
    return NextResponse.json(
      { error: 'Failed to get summary' },
      { status: 500 }
    )
  }
}
