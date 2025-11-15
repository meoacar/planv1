import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { updateQuestProgressSchema } from '@/validations/gamification.schema';
import * as gamificationService from '@/services/gamification.service';
import { redis } from '@/lib/redis';

// Rate limit: 10 requests per minute per user
async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate:quest_progress:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60);
  }
  return count <= 10;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    // Rate limiting
    const allowed = await checkRateLimit(session.user.id);
    if (!allowed) {
      return apiResponse.error('Too many requests. Please try again later.', 429);
    }

    const body = await req.json();
    const validated = updateQuestProgressSchema.parse(body);

    const userQuest = await gamificationService.updateQuestProgress(
      session.user.id,
      validated.questKey,
      validated.increment
    );

    return apiResponse.success(userQuest);
  } catch (error: any) {
    console.error('POST /api/v1/quests/progress error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to update quest progress', 500);
  }
}
