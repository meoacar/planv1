import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { getSetting } from '@/lib/settings'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const session = await auth()
    const siteName = await getSetting('siteName', 'ZayiflamaPlan')

    if (!session?.user?.id) {
      return NextResponse.json({ 
        user: null,
        siteName 
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        role: true,
        coins: true,
        xp: true,
        level: true,
      },
    })

    return NextResponse.json({ 
      user,
      siteName 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Session bilgisi alınamadı' },
      { status: 500 }
    )
  }
}
