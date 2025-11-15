import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { createQuestSchema } from '@/validations/gamification.schema';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    const quests = await prisma.dailyQuest.findMany({
      orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }],
      include: {
        _count: {
          select: { userQuests: true },
        },
      },
    });

    return apiResponse.success(quests);
  } catch (error: any) {
    console.error('GET /api/v1/admin/quests error:', error);
    return apiResponse.error(error.message || 'Failed to fetch quests', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    const body = await req.json();
    const validated = createQuestSchema.parse(body);

    const quest = await prisma.dailyQuest.create({
      data: validated,
    });

    return apiResponse.success(quest, undefined, 201);
  } catch (error: any) {
    console.error('POST /api/v1/admin/quests error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to create quest', 500);
  }
}
