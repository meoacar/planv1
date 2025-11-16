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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [guilds, total] = await Promise.all([
      prisma.guild.findMany({
        where: { status: 'pending' },
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.guild.count({ where: { status: 'pending' } }),
    ]);

    return successResponse(guilds, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('GET /api/admin/guilds/pending error:', error);
    return errorResponse('FETCH_ERROR', error.message || 'Loncalar getirilemedi', 500);
  }
}
