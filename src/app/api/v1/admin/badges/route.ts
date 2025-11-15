import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { createBadgeSchema } from '@/validations/gamification.schema';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    const body = await req.json();
    const validated = createBadgeSchema.parse(body);

    const badge = await prisma.badge.create({
      data: validated,
    });

    return apiResponse.success(badge, undefined, 201);
  } catch (error: any) {
    console.error('POST /api/v1/admin/badges error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to create badge', 500);
  }
}
