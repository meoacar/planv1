import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { grantPremium } from '@/lib/subscription'
import { PremiumType } from '@prisma/client'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { premiumType } = body as { premiumType: PremiumType }

    if (!premiumType) {
      return NextResponse.json(
        { error: 'Premium type gerekli' },
        { status: 400 }
      )
    }

    const result = await grantPremium(params.id, premiumType)

    return NextResponse.json({
      success: true,
      message: 'Premium başarıyla verildi',
      ...result
    })
  } catch (error: any) {
    console.error('Grant premium error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}
