import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    const badges = await gamificationService.getUserBadges(session.user.id);
    return apiResponse.success(badges);
  } catch (error: any) {
    console.error('GET /api/v1/badges/my error:', error);
    return apiResponse.error(error.message || 'Failed to fetch user badges', 500);
  }
}
