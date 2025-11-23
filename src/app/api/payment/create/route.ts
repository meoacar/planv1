import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createStripeCheckout } from '@/lib/payment/stripe'
import { createIyzicoPayment } from '@/lib/payment/iyzico'
import { createPayTRPayment } from '@/lib/payment/paytr'
import { getPaymentSettings } from '@/lib/payment/settings'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, paymentMethod } = body

    // Ödeme ayarlarını kontrol et
    const paymentSettings = await getPaymentSettings()
    
    // Seçilen ödeme yönteminin aktif olup olmadığını kontrol et
    if (paymentMethod === 'paytr' && !paymentSettings.paytrEnabled) {
      return NextResponse.json({ error: 'PayTR ödeme yöntemi şu anda kullanılamıyor' }, { status: 400 })
    }
    if (paymentMethod === 'iyzico' && !paymentSettings.iyzicoEnabled) {
      return NextResponse.json({ error: 'Iyzico ödeme yöntemi şu anda kullanılamıyor' }, { status: 400 })
    }
    if (paymentMethod === 'stripe' && !paymentSettings.stripeEnabled) {
      return NextResponse.json({ error: 'Stripe ödeme yöntemi şu anda kullanılamıyor' }, { status: 400 })
    }

    // Ürünü getir
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 })
    }

    // Kullanıcı bilgilerini getir
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })
    }

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: product.price,
        status: 'pending',
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price,
          },
        },
      },
    })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/payment/success?orderId=${order.id}`
    const failUrl = `${baseUrl}/payment/fail?orderId=${order.id}`

    let paymentResult: any

    // Ödeme yöntemine göre işlem yap
    switch (paymentMethod) {
      case 'stripe':
        paymentResult = await createStripeCheckout({
          amount: product.price,
          currency: 'try',
          productId: product.id,
          userId: session.user.id,
          successUrl,
          cancelUrl: failUrl,
        })
        break

      case 'iyzico':
        paymentResult = await createIyzicoPayment({
          amount: product.price,
          productId: product.id,
          productName: product.name,
          userId: session.user.id,
          userEmail: user.email,
          userName: user.name || 'Kullanıcı',
          userPhone: '+905555555555', // Kullanıcıdan alınmalı
          userAddress: 'Adres', // Kullanıcıdan alınmalı
          userCity: 'Istanbul',
          userCountry: 'Turkey',
          callbackUrl: `${baseUrl}/api/payment/callback/iyzico?orderId=${order.id}`,
        })
        break

      case 'paytr':
        paymentResult = await createPayTRPayment({
          amount: product.price,
          productId: product.id,
          productName: product.name,
          userId: session.user.id,
          userEmail: user.email,
          userName: user.name || 'Kullanıcı',
          userPhone: '+905555555555', // Kullanıcıdan alınmalı
          userAddress: 'Adres', // Kullanıcıdan alınmalı
          merchantOid: order.id,
          successUrl,
          failUrl,
        })
        break

      default:
        return NextResponse.json({ error: 'Geçersiz ödeme yöntemi' }, { status: 400 })
    }

    if (!paymentResult.success) {
      // Sipariş iptal
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'cancelled' },
      })

      return NextResponse.json({ error: paymentResult.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      paymentUrl: paymentResult.checkoutUrl || paymentResult.paymentPageUrl || paymentResult.paymentUrl,
      token: paymentResult.token,
    })
  } catch (error: any) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
