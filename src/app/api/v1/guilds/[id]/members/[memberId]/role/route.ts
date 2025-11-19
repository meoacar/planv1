import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params;
    
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401);
    }

    const guild = await prisma.guild.findUnique({
      where: { id: params.id },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    if (guild.leaderId !== session.user.id) {
      return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403);
    }

    const body = await req.json();
    const { role } = body;

    if (!['officer', 'member'].includes(role)) {
      return errorResponse('INVALID_ROLE', 'Geçersiz rol', 400);
    }

    const updatedMember = await prisma.guildMember.updateMany({
      where: {
        guildId: params.id,
        userId: params.memberId,
      },
      data: { role },
    });

    return successResponse(updatedMember);
  } catch (error: any) {
    console.error('PATCH /api/v1/guilds/[id]/members/[memberId]/role error:', error);
    return errorResponse('UPDATE_ERROR', error.message || 'Rol güncellenemedi', 500);
  }
}
