import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPayTRCallback } from '@/lib/payment/paytr'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const postData: any = {}
    
    formData.forEach((value, key) => {
      postData[key] = value
    })

    // PayTR callback doğrulama
    const verification = await verifyPayTRCallback(postData)

    if (!verification.success) {
      return NextResponse.json({ error: verification.error }, { status: 400 })
    }

    const orderId = verification.merchantOid

    if (verification.paid) {
      // Sipariş güncelle
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'completed' },
      })

      // TODO: Premium özellikleri aktif et

      return new NextResponse('OK', { status: 200 })
    } else {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      })

      return new NextResponse('FAILED', { status: 200 })
    }
  } catch (error: any) {
    console.error('PayTR callback error:', error)
    return new NextResponse('ERROR', { status: 500 })
  }
}
