import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyIyzicoPayment } from '@/lib/payment/iyzico'
import { grantPremium } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token = body.token

    if (!token) {
      return NextResponse.json({ error: 'Token gerekli' }, { status: 400 })
    }

    const result = await verifyIyzicoPayment(token)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const paymentResult = result as any

    if (paymentResult.paymentStatus === 'SUCCESS') {
      // Token ile payment kaydını bul
      const payment = await db.payment.findFirst({
        where: { providerToken: token }
      })

      if (payment) {
        // Ödeme kaydını güncelle
        await db.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            paidAt: new Date()
          }
        })

        // Aboneliği getir
        if (payment.subscriptionId) {
          const subscription = await db.subscription.findUnique({
            where: { id: payment.subscriptionId }
          })

          if (subscription) {
            // Kullanıcıya premium ver
            await grantPremium(
              subscription.userId,
              subscription.premiumType,
              payment.subscriptionId
            )
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('iyzico callback error:', error)
    return NextResponse.json(
      { error: 'Callback error', details: error.message },
      { status: 500 }
    )
  }
}
