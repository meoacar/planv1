import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { purchaseItemSchema } from '@/validations/gamification.schema';
import * as gamificationService from '@/services/gamification.service';
import { redis } from '@/lib/redis';

// Rate limit: 10 purchases per minute per user
async function checkRateLimit(userId: string): Promise<boolean> {
  const key = `rate:shop_purchase:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60);
  }
  return count <= 10;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    // Rate limiting
    const allowed = await checkRateLimit(session.user.id);
    if (!allowed) {
      return apiResponse.error('Too many requests. Please try again later.', 429);
    }

    const body = await req.json();
    const validated = purchaseItemSchema.parse(body);

    const purchase = await gamificationService.purchaseItem(
      session.user.id,
      validated.itemKey,
      validated.quantity
    );

    return apiResponse.success(purchase);
  } catch (error: any) {
    console.error('POST /api/v1/shop/purchase error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to purchase item', 500);
  }
}
