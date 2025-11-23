import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cancelPremium } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscription = await cancelPremium(session.user.id)

    if (!subscription) {
      return NextResponse.json(
        { error: 'Aktif abonelik bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Abonelik iptal edildi. Premium özellikleriniz süre bitene kadar devam edecek.',
      subscription
    })
  } catch (error: any) {
    console.error('Subscription cancel error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}
