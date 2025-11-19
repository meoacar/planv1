import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { updateBadgeSchema } from '@/validations/gamification.schema';
import { prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ badgeId: string }> }
) {
  try {
    const { badgeId } = await params;
    
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    const body = await req.json();
    const validated = updateBadgeSchema.parse(body);

    const badge = await prisma.badge.update({
      where: { id: params.badgeId },
      data: validated,
    });

    return apiResponse.success(badge);
  } catch (error: any) {
    console.error('PATCH /api/v1/admin/badges/[badgeId] error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to update badge', 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ badgeId: string }> }
) {
  try {
    const { badgeId } = await params;
    
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return apiResponse.error('Unauthorized', 403);
    }

    await prisma.badge.delete({
      where: { id: params.badgeId },
    });

    return apiResponse.success({ message: 'Badge deleted successfully' });
  } catch (error: any) {
    console.error('DELETE /api/v1/admin/badges/[badgeId] error:', error);
    return apiResponse.error(error.message || 'Failed to delete badge', 500);
  }
}
