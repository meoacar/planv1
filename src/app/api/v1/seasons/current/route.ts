import { NextRequest } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function GET(req: NextRequest) {
  try {
    const season = await gamificationService.getCurrentSeason();
    
    if (!season) {
      return apiResponse.error('No active season found', 404);
    }

    return apiResponse.success(season);
  } catch (error: any) {
    console.error('GET /api/v1/seasons/current error:', error);
    return apiResponse.error(error.message || 'Failed to fetch current season', 500);
  }
}
