import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Tüm badge'leri listele
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const badges = await prisma.sinBadge.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(badges)
  } catch (error) {
    console.error('Sin badges fetch error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST - Yeni badge ekle
const createSchema = z.object({
  key: z.string().min(1, 'Key gerekli'),
  name: z.string().min(3, 'İsim en az 3 karakter olmalı'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  icon: z.string().min(1, 'Icon gerekli'),
  requirement: z.string().min(1, 'Requirement gerekli'),
  xpReward: z.number().min(0, 'XP 0 veya daha büyük olmalı'),
  coinReward: z.number().min(0, 'Coin 0 veya daha büyük olmalı'),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await req.json()
    const validated = createSchema.parse(body)

    const badge = await prisma.sinBadge.create({
      data: validated,
    })

    return NextResponse.json(badge, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Sin badge create error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
