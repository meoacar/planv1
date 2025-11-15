import { NextRequest } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function GET(
  req: NextRequest,
  { params }: { params: { leagueId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const leaderboard = await gamificationService.getLeagueLeaderboard(params.leagueId, limit);
    return apiResponse.success(leaderboard);
  } catch (error: any) {
    console.error('GET /api/v1/leagues/[leagueId]/leaderboard error:', error);
    return apiResponse.error(error.message || 'Failed to fetch leaderboard', 500);
  }
}
