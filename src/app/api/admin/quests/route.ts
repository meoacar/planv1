import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import { z } from 'zod'

const questSchema = z.object({
  key: z.string().min(1).regex(/^[a-z0-9_]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  type: z.enum(['daily', 'weekly', 'monthly']),
  target: z.number().min(1),
  xpReward: z.number().min(0),
  coinReward: z.number().min(0),
  sortOrder: z.number().min(0),
  isActive: z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Yetkisiz erişim' } },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = questSchema.parse(body)

    // Check if key already exists
    const existing = await prisma.dailyQuest.findUnique({
      where: { key: data.key },
    })

    if (existing) {
      return NextResponse.json(
        { error: { code: 'KEY_EXISTS', message: 'Bu key zaten kullanılıyor' } },
        { status: 400 }
      )
    }

    const quest = await prisma.dailyQuest.create({
      data,
    })

    return NextResponse.json({
      success: true,
      data: quest,
    })
  } catch (error: any) {
    console.error('Create quest error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Bir hata oluştu' } },
      { status: 500 }
    )
  }
}
