import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(3, 'İsim en az 3 karakter olmalı').optional(),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı').optional(),
  icon: z.string().min(1, 'Icon gerekli').optional(),
  xpReward: z.number().min(0, 'XP 0 veya daha büyük olmalı').optional(),
  coinReward: z.number().min(0, 'Coin 0 veya daha büyük olmalı').optional(),
})

// PUT - Badge güncelle
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const body = await req.json()
    const validated = updateSchema.parse(body)

    const badge = await prisma.sinBadge.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(badge)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Sin badge update error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

// DELETE - Badge sil
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    // Önce kullanıcı ilişkilerini sil
    await prisma.userSinBadge.deleteMany({
      where: { badgeId: params.id },
    })

    // Sonra badge'i sil
    await prisma.sinBadge.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sin badge delete error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
