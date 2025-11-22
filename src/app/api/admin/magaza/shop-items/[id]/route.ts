import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    const item = await prisma.shopItem.update({
      where: { id: params.id },
      data: {
        key: data.key,
        name: data.name,
        description: data.description,
        icon: data.icon,
        category: data.category,
        price: data.price,
        stock: data.stock,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        metadata: data.metadata,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating shop item:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.shopItem.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shop item:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
