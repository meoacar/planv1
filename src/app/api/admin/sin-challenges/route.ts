import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET - Tüm challenge'ları listele
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const challenges = await prisma.sinChallenge.findMany({
      include: {
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(challenges)
  } catch (error) {
    console.error('Sin challenges fetch error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// POST - Yeni challenge ekle
const createSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalı'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  targetDays: z.number().min(1, 'Hedef gün sayısı en az 1 olmalı'),
  maxSins: z.number().min(0, 'Max günah sayısı 0 veya daha büyük olmalı'),
  sinType: z.enum(['tatli', 'fastfood', 'gazli', 'alkol', 'diger']),
  xpReward: z.number().min(0, 'XP 0 veya daha büyük olmalı'),
  coinReward: z.number().min(0, 'Coin 0 veya daha büyük olmalı'),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await req.json()
    const validated = createSchema.parse(body)

    const challenge = await prisma.sinChallenge.create({
      data: validated,
    })

    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Sin challenge create error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
