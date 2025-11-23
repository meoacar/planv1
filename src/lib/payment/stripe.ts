// Stripe ödeme entegrasyonu
export interface StripeCheckoutData {
  amount: number
  productName: string
  userId: string
  userEmail: string
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export async function createStripeCheckout(data: StripeCheckoutData) {
  try {
    // Admin panelinden ayarları al
    const { db } = await import('@/lib/db')
    const settings = await db.setting.findMany({
      where: {
        category: 'payment',
        key: {
          in: ['stripeSecretKey', 'stripePublishableKey']
        }
      }
    })
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)
    
    const secretKey = settingsMap.stripeSecretKey || process.env.STRIPE_SECRET_KEY
    
    if (!secretKey) {
      throw new Error('Stripe API anahtarı bulunamadı')
    }

    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16'
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'try',
            product_data: {
              name: data.productName,
            },
            unit_amount: Math.round(data.amount * 100), // Kuruş cinsinden
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      customer_email: data.userEmail,
      metadata: data.metadata || {},
    })

    return {
      success: true,
      url: session.url,
      sessionId: session.id,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function verifyStripeWebhook(payload: string, signature: string) {
  try {
    const { db } = await import('@/lib/db')
    const settings = await db.setting.findMany({
      where: {
        category: 'payment',
        key: {
          in: ['stripeSecretKey', 'stripeWebhookSecret']
        }
      }
    })
    
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)
    
    const secretKey = settingsMap.stripeSecretKey || process.env.STRIPE_SECRET_KEY
    const webhookSecret = settingsMap.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET
    
    if (!secretKey || !webhookSecret) {
      throw new Error('Stripe API bilgileri bulunamadı')
    }

    const Stripe = require('stripe')
    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16'
    })

    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)

    return {
      success: true,
      event,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
