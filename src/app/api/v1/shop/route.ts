import { NextRequest } from 'next/server';
import { apiResponse } from '@/lib/api-response';
import * as gamificationService from '@/services/gamification.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as any;

    const items = await gamificationService.getShopItems(category);
    return apiResponse.success(items);
  } catch (error: any) {
    console.error('GET /api/v1/shop error:', error);
    return apiResponse.error(error.message || 'Failed to fetch shop items', 500);
  }
}
