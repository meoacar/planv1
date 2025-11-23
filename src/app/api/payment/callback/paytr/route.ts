import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyPayTRCallback } from '@/lib/payment/paytr'
import { grantPremium } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const result = await verifyPayTRCallback(body)

    if (!result.success) {
      return new NextResponse('OK', { status: 200 }) // PayTR her zaman OK bekler
    }

    if (result.paid) {
      // merchant_oid ile payment kaydını bul
      const payment = await db.payment.findFirst({
        where: { providerOrderId: result.merchantOid }
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

    return new NextResponse('OK', { status: 200 })
  } catch (error: any) {
    console.error('PayTR callback error:', error)
    return new NextResponse('OK', { status: 200 }) // PayTR her zaman OK bekler
  }
}
