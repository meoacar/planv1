import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { SUBSCRIPTION_PLANS } from '@/lib/subscription'
import { PremiumType, PaymentProvider } from '@prisma/client'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { premiumType, paymentProvider } = body as {
      premiumType: PremiumType
      paymentProvider: PaymentProvider
    }

    if (!premiumType || !paymentProvider) {
      return NextResponse.json(
        { error: 'Premium type ve payment provider gerekli' },
        { status: 400 }
      )
    }

    const plan = SUBSCRIPTION_PLANS[premiumType]
    if (!plan) {
      return NextResponse.json({ error: 'Geçersiz plan' }, { status: 400 })
    }

    // Kullanıcı bilgilerini al
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Abonelik kaydı oluştur
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + plan.duration)

    const subscription = await db.subscription.create({
      data: {
        userId: user.id,
        premiumType,
        status: 'pending',
        startDate,
        endDate,
        paymentProvider,
        amount: plan.price,
        currency: 'TRY'
      }
    })

    // Ödeme kaydı oluştur
    const payment = await db.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId: user.id,
        amount: plan.price,
        currency: 'TRY',
        status: 'pending',
        paymentProvider,
        providerOrderId: `SUB-${subscription.id}-${Date.now()}`
      }
    })

    // Ödeme sağlayıcısına göre ödeme URL'i oluştur
    let paymentUrl = ''
    let paymentData: any = null

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/payment/success?subscriptionId=${subscription.id}`
    const failUrl = `${baseUrl}/payment/fail?subscriptionId=${subscription.id}`

    if (paymentProvider === 'stripe') {
      // Stripe entegrasyonu
      const { createStripeCheckout } = await import('@/lib/payment/stripe')
      const result = await createStripeCheckout({
        amount: plan.price,
        productName: plan.name,
        userId: user.id,
        userEmail: user.email,
        successUrl,
        cancelUrl: failUrl,
        metadata: {
          subscriptionId: subscription.id,
          paymentId: payment.id
        }
      })
      
      if (result.success) {
        paymentUrl = result.url!
        paymentData = result
      }
    } else if (paymentProvider === 'iyzico') {
      // iyzico entegrasyonu
      const { createIyzicoPayment } = await import('@/lib/payment/iyzico')
      const result = await createIyzicoPayment({
        amount: plan.price,
        productId: subscription.id,
        productName: plan.name,
        userId: user.id,
        userEmail: user.email,
        userName: user.name || user.username || 'Kullanıcı',
        userPhone: '+905555555555',
        userAddress: 'Adres',
        userCity: 'Istanbul',
        userCountry: 'Turkey',
        callbackUrl: `${baseUrl}/api/payment/callback/iyzico`
      })
      
      if (result.success) {
        paymentUrl = (result as any).paymentPageUrl
        paymentData = result
        
        await db.payment.update({
          where: { id: payment.id },
          data: { providerToken: (result as any).token }
        })
      }
    } else if (paymentProvider === 'paytr') {
      // PayTR entegrasyonu
      const { createPayTRPayment } = await import('@/lib/payment/paytr')
      const result = await createPayTRPayment({
        amount: plan.price,
        productId: subscription.id,
        productName: plan.name,
        userId: user.id,
        userEmail: user.email,
        userName: user.name || user.username || 'Kullanıcı',
        userPhone: '5555555555',
        userAddress: 'Adres',
        merchantOid: payment.providerOrderId!,
        successUrl,
        failUrl
      })
      
      if (result.success) {
        paymentUrl = (result as any).paymentUrl
        paymentData = result
        
        await db.payment.update({
          where: { id: payment.id },
          data: { providerToken: (result as any).token }
        })
      }
    }

    if (!paymentUrl) {
      return NextResponse.json(
        { error: 'Ödeme oluşturulamadı', details: paymentData },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      paymentId: payment.id,
      paymentUrl,
      paymentData
    })
  } catch (error: any) {
    console.error('Subscription create error:', error)
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: error.message },
      { status: 500 }
    )
  }
}
