import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function DELETE(
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
      where: { id: id },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    if (guild.leaderId !== session.user.id) {
      return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403);
    }

    // Delete member
    await prisma.guildMember.deleteMany({
      where: {
        guildId: id,
        userId: memberId,
      },
    });

    // Update member count
    await prisma.guild.update({
      where: { id: id },
      data: { memberCount: { decrement: 1 } },
    });

    return successResponse({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/v1/guilds/[id]/members/[memberId] error:', error);
    return errorResponse('DELETE_ERROR', error.message || 'Üye çıkarılamadı', 500);
  }
}
