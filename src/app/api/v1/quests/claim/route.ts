import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Unauthorized', 401);
    }

    const body = await req.json();
    const { questId } = body;

    if (!questId) {
      return errorResponse('VALIDATION_ERROR', 'Quest ID is required', 400);
    }

    const result = await gamificationService.completeQuest(session.user.id, questId);

    if (!result) {
      return errorResponse('ALREADY_CLAIMED', 'Quest already claimed or not completed', 400);
    }

    // Get quest details for rewards
    const quest = await gamificationService.getQuestById(questId);

    return successResponse({ 
      message: 'Quest claimed successfully',
      xpReward: quest?.xpReward || 0,
      coinReward: quest?.coinReward || 0,
    });
  } catch (error: any) {
    console.error('POST /api/v1/quests/claim error:', error);
    return errorResponse('SERVER_ERROR', error.message || 'Failed to claim quest', 500);
  }
}
