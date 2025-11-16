import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; requestId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401);
    }

    const guild = await prisma.guild.findUnique({
      where: { id: params.id },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    if (guild.leaderId !== session.user.id) {
      return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403);
    }

    const request = await prisma.guildJoinRequest.findUnique({
      where: { id: params.requestId },
    });

    if (!request || request.guildId !== params.id) {
      return errorResponse('NOT_FOUND', 'İstek bulunamadı', 404);
    }

    if (request.status !== 'pending') {
      return errorResponse('INVALID_STATUS', 'İstek zaten işleme alınmış', 400);
    }

    // Update request status
    await prisma.guildJoinRequest.update({
      where: { id: params.requestId },
      data: { status: 'rejected' },
    });

    // Notify user
    await prisma.notification.create({
      data: {
        userId: request.userId,
        type: 'message',
        title: '❌ Başvurunuz Reddedildi',
        body: `${guild.name} loncasına katılma başvurunuz reddedildi.`,
      },
    });

    return successResponse({ success: true });
  } catch (error: any) {
    console.error('POST /api/v1/guilds/[id]/requests/[requestId]/reject error:', error);
    return errorResponse('REJECT_ERROR', error.message || 'Reddetme başarısız', 500);
  }
}
