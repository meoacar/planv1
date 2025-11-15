import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { guildId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    // Check if user is already in a guild
    const existingMembership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
    });

    if (existingMembership) {
      return apiResponse.error('You are already in a guild', 400);
    }

    const member = await gamificationService.joinGuild(params.guildId, session.user.id);
    return apiResponse.success(member);
  } catch (error: any) {
    console.error('POST /api/v1/guilds/[guildId]/join error:', error);
    return apiResponse.error(error.message || 'Failed to join guild', 500);
  }
}
