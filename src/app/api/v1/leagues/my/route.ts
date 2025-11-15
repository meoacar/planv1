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

    const season = await gamificationService.getCurrentSeason();
    if (!season) {
      return apiResponse.error('No active season', 404);
    }

    const userLeague = await gamificationService.getUserLeague(session.user.id, season.id);
    
    if (!userLeague) {
      return apiResponse.success(null);
    }

    return apiResponse.success(userLeague);
  } catch (error: any) {
    console.error('GET /api/v1/leagues/my error:', error);
    return apiResponse.error(error.message || 'Failed to fetch user league', 500);
  }
}
