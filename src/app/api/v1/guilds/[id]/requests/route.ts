import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

// Get join requests for a guild (leader only)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
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

    const requests = await prisma.guildJoinRequest.findMany({
      where: {
        guildId: params.id,
        status: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            level: true,
            xp: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(requests);
  } catch (error: any) {
    console.error('GET /api/v1/guilds/[id]/requests error:', error);
    return errorResponse('FETCH_ERROR', error.message || 'İstekler getirilemedi', 500);
  }
}
