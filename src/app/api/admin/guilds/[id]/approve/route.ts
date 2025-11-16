import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403);
    }

    const guild = await prisma.guild.findUnique({
      where: { id: params.id },
      include: { leader: true },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    // Update guild status
    const updatedGuild = await prisma.guild.update({
      where: { id: params.id },
      data: {
        status: 'published',
        publishedAt: new Date(),
      },
    });

    // Create notification for guild leader
    await prisma.notification.create({
      data: {
        userId: guild.leaderId,
        type: 'plan_approved', // Yeni tip eklenebilir: guild_approved
        title: '🎉 Loncanız Onaylandı!',
        body: `"${guild.name}" loncanız yayınlandı. Artık herkes katılabilir!`,
        targetType: 'plan', // Guild için yeni tip eklenebilir
        targetId: guild.id,
      },
    });

    return successResponse(updatedGuild);
  } catch (error: any) {
    console.error('POST /api/admin/guilds/[id]/approve error:', error);
    return errorResponse('APPROVE_ERROR', error.message || 'Onaylama başarısız', 500);
  }
}
