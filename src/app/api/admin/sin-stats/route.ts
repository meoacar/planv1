import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Günah sistemi istatistikleri
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 403 })
    }

    const [
      totalSins,
      totalUsers,
      totalBadgesEarned,
      totalChallengeParticipants,
      sinsByType,
      recentSins,
      topUsers,
    ] = await Promise.all([
      // Toplam günah sayısı
      prisma.foodSin.count(),
      
      // En az 1 günah ekleyen kullanıcı sayısı
      prisma.foodSin.groupBy({
        by: ['userId'],
      }).then(result => result.length),
      
      // Kazanılan rozet sayısı
      prisma.userSinBadge.count(),
      
      // Challenge'a katılan kullanıcı sayısı
      prisma.userSinChallenge.count(),
      
      // Günah türlerine göre dağılım
      prisma.foodSin.groupBy({
        by: ['sinType'],
        _count: true,
      }),
      
      // Son 10 günah
      prisma.foodSin.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      }),
      
      // En çok günah ekleyen kullanıcılar
      prisma.foodSin.groupBy({
        by: ['userId'],
        _count: true,
        orderBy: {
          _count: {
            userId: 'desc',
          },
        },
        take: 5,
      }).then(async (results) => {
        const userIds = results.map(r => r.userId)
        const users = await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, username: true },
        })
        
        return results.map(r => ({
          user: users.find(u => u.id === r.userId),
          count: r._count,
        }))
      }),
    ])

    return NextResponse.json({
      totalSins,
      totalUsers,
      totalBadgesEarned,
      totalChallengeParticipants,
      sinsByType,
      recentSins,
      topUsers,
    })
  } catch (error) {
    console.error('Sin stats fetch error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}
