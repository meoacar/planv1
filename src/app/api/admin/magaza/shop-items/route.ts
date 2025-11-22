import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.shopItem.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching shop items:', error)
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

    const item = await prisma.shopItem.create({
      data: {
        key: data.key,
        name: data.name,
        description: data.description,
        icon: data.icon,
        category: data.category,
        price: data.price,
        stock: data.stock,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder || 0,
        metadata: data.metadata,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating shop item:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
