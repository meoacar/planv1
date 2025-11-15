import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { createShopItemSchema } from '@/validations/gamification.schema';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    const items = await prisma.shopItem.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      include: {
        _count: {
          select: { purchases: true },
        },
      },
    });

    return apiResponse.success(items);
  } catch (error: any) {
    console.error('GET /api/v1/admin/shop error:', error);
    return apiResponse.error(error.message || 'Failed to fetch shop items', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    const body = await req.json();
    const validated = createShopItemSchema.parse(body);

    const item = await prisma.shopItem.create({
      data: {
        ...validated,
        metadata: validated.metadata ? JSON.stringify(validated.metadata) : null,
      },
    });

    return apiResponse.success(item, undefined, 201);
  } catch (error: any) {
    console.error('POST /api/v1/admin/shop error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to create shop item', 500);
  }
}
