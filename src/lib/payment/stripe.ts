// Stripe ödeme entegrasyonu
// Not: stripe paketini yüklemek için: npm install stripe

export interface StripePaymentData {
  amount: number
  currency: string
  productId: string
  userId: string
  successUrl: string
  cancelUrl: string
}

export async function createStripeCheckout(data: StripePaymentData) {
  try {
    // Stripe henüz yüklü değil, yüklendiğinde aktif olacak
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe API key bulunamadı')
    }

    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ['card'],
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: data.currency,
    //         product_data: {
    //           name: 'Premium Ürün',
    //         },
    //         unit_amount: Math.round(data.amount * 100), // Stripe kuruş cinsinden çalışır
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: 'payment',
    //   success_url: data.successUrl,
    //   cancel_url: data.cancelUrl,
    //   metadata: {
    //     productId: data.productId,
    //     userId: data.userId,
    //   },
    // })

    // return {
    //   success: true,
    //   checkoutUrl: session.url,
    //   sessionId: session.id,
    // }

    return {
      success: false,
      error: 'Stripe entegrasyonu henüz aktif değil. Lütfen STRIPE_SECRET_KEY ekleyin.',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

export async function verifyStripePayment(sessionId: string) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe API key bulunamadı')
    }

    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const session = await stripe.checkout.sessions.retrieve(sessionId)

    // return {
    //   success: true,
    //   paid: session.payment_status === 'paid',
    //   metadata: session.metadata,
    // }

    return {
      success: false,
      error: 'Stripe entegrasyonu henüz aktif değil',
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
