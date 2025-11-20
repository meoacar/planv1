import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401);
    }

    const body = await req.json().catch(() => ({}));
    const message = body.message || null;

    // Check if guild exists and is published
    const guild = await prisma.guild.findUnique({
      where: { id: id },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    if (guild.status !== 'published') {
      return errorResponse('NOT_PUBLISHED', 'Bu lonca henüz yayında değil', 400);
    }

    // Check if user is already in a guild
    const existingMembership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
    });

    if (existingMembership) {
      return errorResponse('ALREADY_IN_GUILD', 'Zaten bir loncadasınız', 400);
    }

    // Check if guild is full
    if (guild.memberCount >= guild.maxMembers) {
      return errorResponse('GUILD_FULL', 'Lonca dolu', 400);
    }

    // Check if there's already a pending request
    const existingRequest = await prisma.guildJoinRequest.findUnique({
      where: {
        guildId_userId: {
          guildId: guild.id,
          userId: session.user.id,
        },
      },
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return errorResponse('REQUEST_PENDING', 'Başvurunuz zaten beklemede', 400);
      }
      if (existingRequest.status === 'rejected') {
        return errorResponse('REQUEST_REJECTED', 'Başvurunuz reddedildi', 400);
      }
    }

    // If guild is PRIVATE, create join request
    if (!guild.isPublic) {
      const joinRequest = await prisma.guildJoinRequest.create({
        data: {
          guildId: guild.id,
          userId: session.user.id,
          message,
          status: 'pending',
        },
      });

      // Notify guild leader
      await prisma.notification.create({
        data: {
          userId: guild.leaderId,
          type: 'message',
          title: '📩 Yeni Katılma İsteği',
          body: `Birisi ${guild.name} loncasına katılmak istiyor.`,
        },
      });

      return successResponse({ 
        type: 'request_created',
        message: 'Başvurunuz gönderildi. Lider onayını bekleyin.',
        request: joinRequest 
      });
    }

    // If guild is PUBLIC, add member directly
    const membership = await prisma.guildMember.create({
      data: {
        guildId: guild.id,
        userId: session.user.id,
        role: 'member',
      },
    });

    // Update member count
    await prisma.guild.update({
      where: { id: guild.id },
      data: { memberCount: { increment: 1 } },
    });

    return successResponse({ 
      type: 'joined',
      message: 'Loncaya katıldınız!',
      membership 
    });
  } catch (error: any) {
    console.error('POST /api/v1/guilds/[id]/join error:', error);
    return errorResponse('JOIN_ERROR', error.message || 'Katılma başarısız', 500);
  }
}
