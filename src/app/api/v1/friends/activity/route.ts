/**
 * Friend Activity Feed API
 * GET /api/v1/friends/activity - Arkadaş aktivitelerini getir
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Arkadaşların ID'lerini al
    const friendships = await prisma.friendship.findMany({
      where: { userId: session.user.id },
      select: { friendId: true },
    });

    const friendIds = friendships.map((f) => f.friendId);

    if (friendIds.length === 0) {
      return NextResponse.json({ activities: [] });
    }

    // Arkadaşların aktivitelerini getir
    const activities = await prisma.friendActivity.findMany({
      where: {
        userId: { in: friendIds },
        isPublic: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            level: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Activity data'yı parse et
    const parsedActivities = activities.map((activity) => ({
      ...activity,
      activityData: activity.activityData
        ? JSON.parse(activity.activityData)
        : null,
    }));

    return NextResponse.json({ activities: parsedActivities });
  } catch (error) {
    console.error('Get friend activities error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
