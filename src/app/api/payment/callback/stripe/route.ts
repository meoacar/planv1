import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyStripeWebhook } from '@/lib/payment/stripe'
import { grantPremium } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const result = await verifyStripeWebhook(body, signature)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    const event = result.event

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const subscriptionId = session.metadata?.subscriptionId
      const paymentId = session.metadata?.paymentId

      if (subscriptionId && paymentId) {
        // Ödeme kaydını güncelle
        const payment = await db.payment.update({
          where: { id: paymentId },
          data: {
            status: 'completed',
            paidAt: new Date(),
            providerToken: session.id
          }
        })

        // Aboneliği getir
        const subscription = await db.subscription.findUnique({
          where: { id: subscriptionId }
        })

        if (subscription) {
          // Kullanıcıya premium ver
          await grantPremium(
            subscription.userId,
            subscription.premiumType,
            subscriptionId
          )
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook error', details: error.message },
      { status: 500 }
    )
  }
}
