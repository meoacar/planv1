import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    const result = await gamificationService.updateStreak(session.user.id);

    // Update daily quest progress
    await gamificationService.updateQuestProgress(session.user.id, 'daily_check_in', 1);

    return apiResponse.success(result);
  } catch (error: any) {
    console.error('POST /api/v1/streak/check-in error:', error);
    return apiResponse.error(error.message || 'Failed to check in', 500);
  }
}
