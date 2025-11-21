import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth';
import { db as prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's streak from database
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        streak: true,
        lastCheckIn: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      currentStreak: user.streak || 0,
      lastCheckIn: user.lastCheckIn,
    })
  } catch (error) {
    console.error('Error fetching streak:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
