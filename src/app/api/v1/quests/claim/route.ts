import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';
import { redis } from '@/lib/redis';

// Rate limit: 5 requests per minute per user
async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate:quest_claim:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60);
  }
  return count <= 5;
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
    const { questId } = body;

    if (!questId) {
      return apiResponse.error('Quest ID is required', 400);
    }

    const result = await gamificationService.completeQuest(session.user.id, questId);

    if (!result) {
      return apiResponse.error('Quest already claimed or not completed', 400);
    }

    return apiResponse.success({ message: 'Quest claimed successfully' });
  } catch (error: any) {
    console.error('POST /api/v1/quests/claim error:', error);
    return apiResponse.error(error.message || 'Failed to claim quest', 500);
  }
}
