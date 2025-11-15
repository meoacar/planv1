import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { awardBadgeSchema } from '@/validations/gamification.schema';
import * as gamificationService from '@/services/gamification.service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    const body = await req.json();
    const validated = awardBadgeSchema.parse(body);

    const userBadge = await gamificationService.awardBadge(
      validated.userId,
      validated.badgeKey
    );

    if (!userBadge) {
      return apiResponse.error('User already has this badge', 400);
    }

    return apiResponse.success(userBadge);
  } catch (error: any) {
    console.error('POST /api/v1/admin/badges/award error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to award badge', 500);
  }
}
