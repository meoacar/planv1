import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401);
    }

    // Kullanıcının üyesi olduğu lonca (herhangi bir durumda)
    const membership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
      include: {
        guild: {
          include: {
            leader: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: { members: true },
            },
          },
        },
      },
    });

    if (!membership) {
      return successResponse({ guild: null, membership: null });
    }

    return successResponse({
      guild: membership.guild,
      membership: {
        role: membership.role,
        joinedAt: membership.joinedAt,
        xpEarned: membership.xpEarned,
      },
    });
  } catch (error: any) {
    console.error('GET /api/v1/guilds/my-guild error:', error);
    return errorResponse('FETCH_ERROR', error.message || 'Lonca bilgisi alınamadı', 500);
  }
}
