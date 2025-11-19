import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { generateWeeklySummary } from '@/lib/ai-service'
import { startOfWeek, endOfWeek, subWeeks } from 'date-fns'

const prisma = new PrismaClient()

// Vercel Cron Job - Her Pazar 23:00'da çalışır
// vercel.json'da tanımlanmalı: "cron": "0 23 * * 0"

interface FoodSin {
  id: string
  userId: string
  sinType: string
  createdAt: Date
}

export async function GET(req: NextRequest) {
  try {
    // Güvenlik: Sadece Vercel Cron veya belirli bir secret key ile çalışsın
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Geçen haftanın başlangıç ve bitiş tarihleri
    const lastWeekEnd = endOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })
    const lastWeekStart = startOfWeek(subWeeks(new Date(), 1), { weekStartsOn: 1 })

    // En az 1 günah ekleyen tüm kullanıcıları bul
    const usersWithSins = await prisma.foodSin.findMany({
      where: {
        createdAt: {
          gte: lastWeekStart,
          lte: lastWeekEnd,
        },
      },
      select: { userId: true },
      distinct: ['userId'],
    })

    const userIds = usersWithSins.map((u: { userId: string }) => u.userId)
    let successCount = 0
    let errorCount = 0

    // Her kullanıcı için özet oluştur
    for (const userId of userIds) {
      try {
        // Kullanıcının haftalık verilerini topla
        const [sins, badges, challenges] = await Promise.all([
          prisma.foodSin.findMany({
            where: {
              userId,
              createdAt: {
                gte: lastWeekStart,
                lte: lastWeekEnd,
              },
            },
            orderBy: { createdAt: 'asc' },
          }) as Promise<FoodSin[]>,

          prisma.userSinBadge.count({
            where: {
              userId,
              earnedAt: {
                gte: lastWeekStart,
                lte: lastWeekEnd,
              },
            },
          }),

          prisma.userSinChallenge.count({
            where: {
              userId,
              completedAt: {
                gte: lastWeekStart,
                lte: lastWeekEnd,
              },
            },
          }),
        ])

        // Günah türlerine göre grupla
        const sinsByType = {
          tatli: sins.filter((s) => s.sinType === 'tatli').length,
          fastfood: sins.filter((s) => s.sinType === 'fastfood').length,
          gazli: sins.filter((s) => s.sinType === 'gazli').length,
          alkol: sins.filter((s) => s.sinType === 'alkol').length,
          diger: sins.filter((s) => s.sinType === 'diger').length,
        }

        // Temiz günleri hesapla
        const sinDates = new Set(
          sins.map((s) => s.createdAt.toISOString().split('T')[0])
        )
        const cleanDays = 7 - sinDates.size

        // En uzun temiz seriyi hesapla
        let longestStreak = 0
        let currentStreak = 0
        const allDates: string[] = []
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(lastWeekStart)
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
        await prisma.sinWeeklySummary.create({
          data: {
            userId,
            weekStart: lastWeekStart,
            weekEnd: lastWeekEnd,
            totalSins: sins.length,
            cleanDays,
            longestStreak,
            badgesEarned: badges,
            challengesCompleted: challenges,
            aiSummary,
            sinsByType: sinsByType as any,
          },
        })

        successCount++
      } catch (error) {
        console.error(`Failed to generate summary for user ${userId}:`, error)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Weekly summaries generated`,
      stats: {
        totalUsers: userIds.length,
        successCount,
        errorCount,
        weekStart: lastWeekStart.toISOString(),
        weekEnd: lastWeekEnd.toISOString(),
      },
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}
