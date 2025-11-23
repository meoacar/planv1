import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyIyzicoPayment } from '@/lib/payment/iyzico'

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')
    const body = await req.json()
    const { token } = body

    if (!token || !orderId) {
      return NextResponse.json({ error: 'Token ve Order ID gerekli' }, { status: 400 })
    }

    // iyzico ödeme doğrulama
    const verification = await verifyIyzicoPayment(token)

    if (!verification.success || verification.paymentStatus !== 'SUCCESS') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      })
      return NextResponse.json({ error: 'Ödeme başarısız' }, { status: 400 })
    }

    // Sipariş güncelle
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'completed' },
    })

    // TODO: Premium özellikleri aktif et

    return NextResponse.json({ success: true, orderId })
  } catch (error: any) {
    console.error('iyzico callback error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
