/**
 * Friend Request Actions API
 * PUT /api/v1/friends/requests/[id] - İsteği kabul et veya reddet
 * DELETE /api/v1/friends/requests/[id] - İsteği iptal et
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendPushToUser } from '@/lib/push-service';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // İsteği bul
    const request = await prisma.friendRequest.findUnique({
      where: { id: params.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      );
    }

    // Sadece alıcı kabul/red edebilir
    if (request.receiverId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (request.status !== 'pending') {
      return NextResponse.json(
        { error: 'Request already processed' },
        { status: 400 }
      );
    }

    if (action === 'accept') {
      // İsteği kabul et
      await prisma.friendRequest.update({
        where: { id: params.id },
        data: {
          status: 'accepted',
          respondedAt: new Date(),
        },
      });

      // Arkadaşlık oluştur (çift yönlü)
      await prisma.$transaction([
        prisma.friendship.create({
          data: {
            userId: request.senderId,
            friendId: request.receiverId,
          },
        }),
        prisma.friendship.create({
          data: {
            userId: request.receiverId,
            friendId: request.senderId,
          },
        }),
      ]);

      // Gönderene bildirim
      sendPushToUser(request.senderId, 'friend_activity', {
        title: '✅ Arkadaş İsteği Kabul Edildi',
        body: `${request.receiver.name || request.receiver.username} arkadaş isteğini kabul etti!`,
        icon: request.receiver.image || '/icons/icon-192x192.png',
        data: { url: '/friends', userId: request.receiverId },
        tag: 'friend-accepted',
      }).catch(console.error);

      return NextResponse.json({
        success: true,
        message: 'Friend request accepted',
      });
    } else {
      // İsteği reddet
      await prisma.friendRequest.update({
        where: { id: params.id },
        data: {
          status: 'rejected',
          respondedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Friend request rejected',
      });
    }
  } catch (error) {
    console.error('Process friend request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // İsteği bul
    const request = await prisma.friendRequest.findUnique({
      where: { id: params.id },
    });

    if (!request) {
      return NextResponse.json(
        { error: 'Friend request not found' },
        { status: 404 }
      );
    }

    // Sadece gönderen iptal edebilir
    if (request.senderId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (request.status !== 'pending') {
      return NextResponse.json(
        { error: 'Cannot cancel processed request' },
        { status: 400 }
      );
    }

    // İsteği iptal et
    await prisma.friendRequest.update({
      where: { id: params.id },
      data: {
        status: 'cancelled',
        respondedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Friend request cancelled',
    });
  } catch (error) {
    console.error('Cancel friend request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
