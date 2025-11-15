import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function POST(
  req: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    await gamificationService.leaveGuild(params.guildId, session.user.id);
    return apiResponse.success({ message: 'Left guild successfully' });
  } catch (error: any) {
    console.error('POST /api/v1/guilds/[guildId]/leave error:', error);
    return apiResponse.error(error.message || 'Failed to leave guild', 500);
  }
}
