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

    const stats = await gamificationService.getReferralStats(session.user.id);
    return apiResponse.success(stats);
  } catch (error: any) {
    console.error('GET /api/v1/referrals/my-code error:', error);
    return apiResponse.error(error.message || 'Failed to fetch referral code', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    const code = await gamificationService.createReferralCode(session.user.id);
    return apiResponse.success(code);
  } catch (error: any) {
    console.error('POST /api/v1/referrals/my-code error:', error);
    return apiResponse.error(error.message || 'Failed to create referral code', 500);
  }
}
