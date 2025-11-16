import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403);
    }

    const guilds = await prisma.guild.findMany({
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            email: true,
          },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: [
        { status: 'asc' }, // pending first
        { createdAt: 'desc' },
      ],
    });

    return successResponse(guilds);
  } catch (error: any) {
    console.error('GET /api/admin/guilds/all error:', error);
    return errorResponse('FETCH_ERROR', error.message || 'Loncalar getirilemedi', 500);
  }
}
