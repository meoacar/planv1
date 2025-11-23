import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyStripePayment } from '@/lib/payment/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID gerekli' }, { status: 400 })
    }

    // Stripe ödeme doğrulama
    const verification = await verifyStripePayment(sessionId)

    if (!verification.success || !verification.paid) {
      return NextResponse.json({ error: 'Ödeme doğrulanamadı' }, { status: 400 })
    }

    // Sipariş güncelle
    const order = await prisma.order.findFirst({
      where: {
        userId: verification.metadata?.userId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'completed' },
    })

    // TODO: Premium özellikleri aktif et

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error: any) {
    console.error('Stripe callback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
