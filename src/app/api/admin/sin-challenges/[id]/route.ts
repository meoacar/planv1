import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalı').optional(),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı').optional(),
  targetDays: z.number().min(1, 'Hedef gün sayısı en az 1 olmalı').optional(),
  sinType: z.enum(['tatli', 'fastfood', 'gazli', 'alkol', 'diger']).optional(),
  xpReward: z.number().min(0, 'XP 0 veya daha büyük olmalı').optional(),
  coinReward: z.number().min(0, 'Coin 0 veya daha büyük olmalı').optional(),
  startDate: z.string().transform(str => new Date(str)).optional(),
  endDate: z.string().transform(str => new Date(str)).optional(),
})

// PUT - Challenge güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await req.json()
    const validated = updateSchema.parse(body)

    const challenge = await prisma.sinChallenge.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(challenge)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Sin challenge update error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE - Challenge sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    // Önce katılımcıları sil
    await prisma.userSinChallenge.deleteMany({
      where: { challengeId: params.id },
    })

    // Sonra challenge'ı sil
    await prisma.sinChallenge.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sin challenge delete error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
