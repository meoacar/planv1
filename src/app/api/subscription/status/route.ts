import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { checkUserPremiumStatus, getUserActiveSubscription } from '@/lib/subscription'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const premiumStatus = await checkUserPremiumStatus(session.user.id)
    const activeSubscription = await getUserActiveSubscription(session.user.id)

    return NextResponse.json({
      ...premiumStatus,
      subscription: activeSubscription
    })
  } catch (error: any) {
    console.error('Subscription status error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}
