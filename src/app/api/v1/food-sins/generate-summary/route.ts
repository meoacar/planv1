import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateWeeklySummary } from '@/lib/ai-service'
import { startOfWeek, endOfWeek } from 'date-fns'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Bu haftanın başlangıç ve bitiş tarihleri
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Pazartesi
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Pazar

    // Haftalık verileri topla
    const [sins, badges, challenges] = await Promise.all([
      // Bu haftaki günahlar
      prisma.foodSin.findMany({
        where: {
          userId,
          createdAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
        orderBy: { createdAt: 'asc' },
      }),

      // Bu hafta kazanılan rozetler
      prisma.userSinBadge.count({
        where: {
          userId,
          earnedAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      }),

      // Bu hafta tamamlanan challenge'lar
      prisma.userSinChallenge.count({
        where: {
          userId,
          completedAt: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      }),
    ])

    // Günah türlerine göre grupla
    const sinsByType = {
      tatli: sins.filter(s => s.sinType === 'tatli').length,
      fastfood: sins.filter(s => s.sinType === 'fastfood').length,
      gazli: sins.filter(s => s.sinType === 'gazli').length,
      alkol: sins.filter(s => s.sinType === 'alkol').length,
      diger: sins.filter(s => s.sinType === 'diger').length,
    }

    // Temiz günleri hesapla
    const sinDates = new Set(
      sins.map(s => s.createdAt.toISOString().split('T')[0])
    )
    const cleanDays = 7 - sinDates.size

    // En uzun temiz seriyi hesapla
    let longestStreak = 0
    let currentStreak = 0
    const allDates: string[] = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(date.getDate() + i)
      allDates.push(date.toISOString().split('T')[0])
    }

    for (const date of allDates) {
      if (!sinDates.has(date)) {
        currentStreak++
        longestStreak = Math.max(longestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }

    // AI ile özet oluştur
    const aiSummary = await generateWeeklySummary({
      totalSins: sins.length,
      sinsByType,
      cleanDays,
      longestStreak,
      badgesEarned: badges,
      challengesCompleted: challenges,
    })

    // Veritabanına kaydet
    const summary = await prisma.sinWeeklySummary.create({
      data: {
        userId,
        weekStart,
        weekEnd,
        totalSins: sins.length,
        cleanDays,
        longestStreak,
        badgesEarned: badges,
        challengesCompleted: challenges,
        aiSummary,
        sinsByType: sinsByType as any,
      },
    })

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Generate summary error:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
