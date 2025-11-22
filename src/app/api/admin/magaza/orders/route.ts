import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where = status && status !== 'all' ? { status } : {}

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      userId: order.userId,
      userName: order.user.name || 'Bilinmeyen',
      userEmail: order.user.email || '',
      items: order.items.map(item => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    }))

    return NextResponse.json(formattedOrders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
