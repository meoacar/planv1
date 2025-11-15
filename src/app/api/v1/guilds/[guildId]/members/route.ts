import { NextRequest } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function GET(
  req: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const members = await gamificationService.getGuildMembers(params.guildId);
    return apiResponse.success(members);
  } catch (error: any) {
    console.error('GET /api/v1/guilds/[guildId]/members error:', error);
    return apiResponse.error(error.message || 'Failed to fetch guild members', 500);
  }
}
