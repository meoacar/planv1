import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        image: true,
        role: true,
        coins: true,
        xp: true,
        level: true,
        streak: true,
        reputationScore: true,
      },
    });

    if (!user) {
      return apiResponse.error('User not found', 404);
    }

    return apiResponse.success(user);
  } catch (error: any) {
    console.error('GET /api/user/me error:', error);
    return apiResponse.error(error.message || 'Failed to fetch user', 500);
  }
}
