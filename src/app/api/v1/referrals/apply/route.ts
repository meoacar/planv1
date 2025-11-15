import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { applyReferralCodeSchema } from '@/validations/gamification.schema';
import * as gamificationService from '@/services/gamification.service';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    const body = await req.json();
    const validated = applyReferralCodeSchema.parse(body);

    const referral = await gamificationService.applyReferralCode(session.user.id, validated.code);
    
    // Auto-complete referral after applying
    await gamificationService.completeReferral(referral.id);

    return apiResponse.success(referral);
  } catch (error: any) {
    console.error('POST /api/v1/referrals/apply error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to apply referral code', 500);
  }
}
