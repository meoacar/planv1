import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Tüm reaction'ları listele
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const sinType = searchParams.get('sinType')

    const reactions = await prisma.sinReaction.findMany({
      where: sinType ? { sinType } : undefined,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reactions)
  } catch (error) {
    console.error('Sin reactions fetch error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST - Yeni reaction ekle
const createSchema = z.object({
  message: z.string().min(5, 'Mesaj en az 5 karakter olmalı'),
  sinType: z.enum(['tatli', 'fastfood', 'gazli', 'alkol', 'diger']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await req.json()
    const validated = createSchema.parse(body)

    const reaction = await prisma.sinReaction.create({
      data: validated,
    })

    return NextResponse.json(reaction, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Sin reaction create error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
