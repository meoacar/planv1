import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error('Error fetching coupons:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minPurchase: data.minPurchase,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        usageCount: 0,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        isActive: data.isActive ?? true,
      },
    })

    return NextResponse.json(coupon)
  } catch (error) {
    console.error('Error creating coupon:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
