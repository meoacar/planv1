import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  try {
    const { id, requestId } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401);
    }

    const guild = await prisma.guild.findUnique({
      where: { id: id },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    if (guild.leaderId !== session.user.id) {
      return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403);
    }

    const request = await prisma.guildJoinRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request || request.guildId !== id) {
      return errorResponse('NOT_FOUND', 'İstek bulunamadı', 404);
    }

    if (request.status !== 'pending') {
      return errorResponse('INVALID_STATUS', 'İstek zaten işleme alınmış', 400);
    }

    // Check if guild is full
    if (guild.memberCount >= guild.maxMembers) {
      return errorResponse('GUILD_FULL', 'Lonca dolu', 400);
    }

    // Add member
    await prisma.guildMember.create({
      data: {
        guildId: guild.id,
        userId: request.userId,
        role: 'member',
      },
    });

    // Update member count
    await prisma.guild.update({
      where: { id: guild.id },
      data: { memberCount: { increment: 1 } },
    });

    // Update request status
    await prisma.guildJoinRequest.update({
      where: { id: requestId },
      data: { status: 'approved' },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: request.userId,
        type: 'message',
        title: '✅ Başvurunuz Onaylandı!',
        body: `${guild.name} loncasına katıldınız!`,
      },
    });

    return successResponse({ success: true });
  } catch (error: any) {
    console.error('POST /api/v1/guilds/[id]/requests/[requestId]/approve error:', error);
    return errorResponse('APPROVE_ERROR', error.message || 'Onaylama başarısız', 500);
  }
}
