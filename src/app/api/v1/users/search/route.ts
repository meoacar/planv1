/**
 * User Search API
 * GET /api/v1/users/search - Kullanıcı ara
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
    const query = searchParams.get('q');

    console.log('[User Search] Query:', query);
    console.log('[User Search] Current user:', session.user.id);

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] });
    }

    // Kullanıcıları ara (kendisi hariç)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: session.user.id } },
          {
            OR: [
              { name: { contains: query } },
              { username: { contains: query } },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        level: true,
        streak: true,
      },
      take: 20,
    });

    console.log('[User Search] Found users:', users.length);

    // Arkadaşlık durumlarını kontrol et
    const friendships = await prisma.friendship.findMany({
      where: {
        userId: session.user.id,
        friendId: { in: users.map((u) => u.id) },
      },
      select: { friendId: true },
    });

    const friendIds = new Set(friendships.map((f) => f.friendId));

    // Bekleyen istekleri kontrol et
    const pendingRequests = await prisma.friendRequest.findMany({
      where: {
        senderId: session.user.id,
        receiverId: { in: users.map((u) => u.id) },
        status: 'pending',
      },
      select: { receiverId: true },
    });

    const pendingIds = new Set(pendingRequests.map((r) => r.receiverId));

    // Sonuçları birleştir
    const results = users.map((user) => ({
      ...user,
      isFriend: friendIds.has(user.id),
      hasPendingRequest: pendingIds.has(user.id),
    }));

    return NextResponse.json({ users: results });
  } catch (error) {
    console.error('User search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
