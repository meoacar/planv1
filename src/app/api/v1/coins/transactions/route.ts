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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const transactions = await gamificationService.getCoinTransactions(session.user.id, limit);
    return apiResponse.success(transactions);
  } catch (error: any) {
    console.error('GET /api/v1/coins/transactions error:', error);
    return apiResponse.error(error.message || 'Failed to fetch transactions', 500);
  }
}
