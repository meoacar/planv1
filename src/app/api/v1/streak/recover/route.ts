import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { recoverStreakSchema } from '@/validations/gamification.schema';
import * as gamificationService from '@/services/gamification.service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    const body = await req.json();
    const validated = recoverStreakSchema.parse(body);

    const result = await gamificationService.recoverStreak(session.user.id, validated.daysLost);
    return apiResponse.success(result);
  } catch (error: any) {
    console.error('POST /api/v1/streak/recover error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to recover streak', 500);
  }
}
