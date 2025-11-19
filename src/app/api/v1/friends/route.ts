/**
 * Friends List API
 * GET /api/v1/friends - Arkadaş listesini getir
 * DELETE /api/v1/friends - Arkadaşlığı sonlandır
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
    const search = searchParams.get('search') || '';

    // Arkadaşları getir
    const friendships = await prisma.friendship.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            level: true,
            xp: true,
            streak: true,
            coins: true,
            createdAt: true,
            sinBadges: {
              include: {
                badge: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    let friends = friendships.map((f) => f.friend);

    // Arama filtresi
    if (search) {
      friends = friends.filter(
        (f) =>
          f.name?.toLowerCase().includes(search.toLowerCase()) ||
          f.username?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      friends,
      total: friends.length,
    });
  } catch (error) {
    console.error('Get friends error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const friendId = searchParams.get('friendId');

    if (!friendId) {
      return NextResponse.json(
        { error: 'Friend ID required' },
        { status: 400 }
      );
    }

    // Arkadaşlığı sil (çift yönlü)
    await prisma.$transaction([
      prisma.friendship.deleteMany({
        where: {
          userId: session.user.id,
          friendId,
        },
      }),
      prisma.friendship.deleteMany({
        where: {
          userId: friendId,
          friendId: session.user.id,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Friendship removed',
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
