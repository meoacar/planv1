import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    const badges = await gamificationService.getAllBadges();

    // If user is logged in, include their earned badges
    if (session?.user?.id) {
      const userBadges = await gamificationService.getUserBadges(session.user.id);
      const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badgeId));

      const badgesWithStatus = badges.map((badge) => ({
        ...badge,
        earned: earnedBadgeIds.has(badge.id),
        earnedAt: userBadges.find((ub) => ub.badgeId === badge.id)?.earnedAt || null,
      }));

      return apiResponse.success(badgesWithStatus);
    }

    return apiResponse.success(badges);
  } catch (error: any) {
    console.error('GET /api/v1/badges error:', error);
    return apiResponse.error(error.message || 'Failed to fetch badges', 500);
  }
}
