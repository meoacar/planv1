/**
 * Friend Requests API
 * GET /api/v1/friends/requests - Arkadaş isteklerini listele
 * POST /api/v1/friends/requests - Arkadaş isteği gönder
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';
import { sendPushToUser } from '@/lib/push-service';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'received'; // received, sent, all

    let where: any = {};

    if (type === 'received') {
      where = {
        receiverId: session.user.id,
        status: 'pending',
      };
    } else if (type === 'sent') {
      where = {
        senderId: session.user.id,
        status: 'pending',
      };
    } else if (type === 'all') {
      where = {
        OR: [
          { receiverId: session.user.id },
          { senderId: session.user.id },
        ],
      };
    }

    const requests = await prisma.friendRequest.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            level: true,
            streak: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
            level: true,
            streak: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Get friend requests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { receiverId, message } = body;

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Receiver ID required' },
        { status: 400 }
      );
    }

    // Kendine istek gönderemez
    if (receiverId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot send request to yourself' },
        { status: 400 }
      );
    }

    // Alıcının ayarlarını kontrol et
    const receiverSettings = await prisma.friendSettings.findUnique({
      where: { userId: receiverId },
    });

    if (receiverSettings && !receiverSettings.allowFriendRequests) {
      return NextResponse.json(
        { error: 'User does not accept friend requests' },
        { status: 403 }
      );
    }

    // Zaten arkadaş mı kontrol et
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: session.user.id, friendId: receiverId },
          { userId: receiverId, friendId: session.user.id },
        ],
      },
    });

    if (existingFriendship) {
      return NextResponse.json(
        { error: 'Already friends' },
        { status: 400 }
      );
    }

    // Bekleyen istek var mı kontrol et
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: session.user.id, receiverId, status: 'pending' },
          { senderId: receiverId, receiverId: session.user.id, status: 'pending' },
        ],
      },
    });

    if (existingRequest) {
      // Eğer karşı taraf zaten istek göndermişse, otomatik kabul et
      if (existingRequest.senderId === receiverId) {
        await prisma.friendRequest.update({
          where: { id: existingRequest.id },
          data: {
            status: 'accepted',
            respondedAt: new Date(),
          },
        });

        // Arkadaşlık oluştur (çift yönlü)
        await prisma.$transaction([
          prisma.friendship.create({
            data: {
              userId: session.user.id,
              friendId: receiverId,
            },
          }),
          prisma.friendship.create({
            data: {
              userId: receiverId,
              friendId: session.user.id,
            },
          }),
        ]);

        return NextResponse.json({
          success: true,
          message: 'Friend request auto-accepted',
          autoAccepted: true,
        });
      }

      return NextResponse.json(
        { error: 'Friend request already sent' },
        { status: 400 }
      );
    }

    // Yeni istek oluştur
    const request = await prisma.friendRequest.create({
      data: {
        senderId: session.user.id,
        receiverId,
        message,
        status: 'pending',
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Push notification gönder
    sendPushToUser(receiverId, 'friend_activity', {
      title: '👥 Yeni Arkadaş İsteği',
      body: `${request.sender.name || request.sender.username} sana arkadaş isteği gönderdi!`,
      icon: request.sender.image || '/icons/icon-192x192.png',
      data: { url: '/friends/requests', requestId: request.id },
      tag: 'friend-request',
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      request,
      message: 'Friend request sent',
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
