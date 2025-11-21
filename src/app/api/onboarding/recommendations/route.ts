import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user's onboarding data
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        goal: true,
        biggestChallenge: true,
        activityLevel: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Recommend plans based on goal
    const plans = await db.plan.findMany({
      where: {
        status: 'published',
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        duration: true,
        difficulty: true,
        likesCount: true,
        author: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
      },
      orderBy: {
        likesCount: 'desc',
      },
      take: 3,
    })

    // Recommend groups based on challenge
    const challengeGroupMap: { [key: string]: string[] } = {
      sweets: ['tatlı', 'şeker', 'detoks'],
      night_snacking: ['gece', 'atıştırma', 'disiplin'],
      motivation: ['motivasyon', 'başarı', 'destek'],
      eating_out: ['sosyal', 'restoran', 'dışarı'],
      time_management: ['hızlı', 'pratik', 'kolay'],
    }

    const searchTerms = challengeGroupMap[user.biggestChallenge || ''] || []
    
    const groups = await db.group.findMany({
      where: {
        status: 'published',
        isPublic: true,
        OR: searchTerms.length > 0 ? searchTerms.map(term => ({
          OR: [
            { name: { contains: term } },
            { description: { contains: term } },
          ],
        })) : undefined,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        memberCount: true,
        postCount: true,
        category: true,
      },
      orderBy: {
        memberCount: 'desc',
      },
      take: 2,
    })

    // If no specific groups found, get popular ones
    let finalGroups = groups
    if (groups.length === 0) {
      finalGroups = await db.group.findMany({
        where: {
          status: 'published',
          isPublic: true,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
          memberCount: true,
          postCount: true,
          category: true,
        },
        orderBy: {
          memberCount: 'desc',
        },
        take: 2,
      })
    }

    // Recommend a guild
    const guild = await db.guild.findFirst({
      where: {
        status: 'published',
        isPublic: true,
      },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        memberCount: true,
        level: true,
        totalXP: true,
      },
      orderBy: {
        memberCount: 'desc',
      },
    })

    return NextResponse.json({
      plans,
      groups: finalGroups,
      guild,
    })
  } catch (error) {
    console.error('Recommendations error:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    )
  }
}
