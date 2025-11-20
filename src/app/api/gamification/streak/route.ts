import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's check-in history to calculate streak
    const checkIns = await prisma.checkInHistory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        checkInDate: 'desc',
      },
      take: 365, // Last year
    })

    let currentStreak = 0
    
    if (checkIns.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let checkDate = new Date(today)
      
      for (const checkIn of checkIns) {
        const checkInDate = new Date(checkIn.checkInDate)
        checkInDate.setHours(0, 0, 0, 0)
        
        if (checkInDate.getTime() === checkDate.getTime()) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (checkInDate.getTime() < checkDate.getTime()) {
          break
        }
      }
    }

    return NextResponse.json({
      currentStreak,
      totalCheckIns: checkIns.length,
    })
  } catch (error) {
    console.error('Error fetching streak:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
