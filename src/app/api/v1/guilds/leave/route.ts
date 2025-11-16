import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401);
    }

    // Find user's guild membership
    const membership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
      include: { guild: true },
    });

    if (!membership) {
      return errorResponse('NOT_IN_GUILD', 'Bir loncada değilsiniz', 400);
    }

    // Leaders cannot leave (must transfer leadership first)
    if (membership.role === 'leader') {
      return errorResponse(
        'LEADER_CANNOT_LEAVE',
        'Lider loncadan ayrılamaz. Önce liderliği devretmelisiniz.',
        400
      );
    }

    // Delete membership
    await prisma.guildMember.delete({
      where: { id: membership.id },
    });

    // Update guild member count
    await prisma.guild.update({
      where: { id: membership.guildId },
      data: { memberCount: { decrement: 1 } },
    });

    // Create notification for guild leader
    await prisma.notification.create({
      data: {
        userId: membership.guild.leaderId,
        type: 'message',
        title: '👋 Üye Ayrıldı',
        body: `Bir üye ${membership.guild.name} loncasından ayrıldı.`,
      },
    });

    return successResponse({ success: true, message: 'Loncadan ayrıldınız' });
  } catch (error: any) {
    console.error('POST /api/v1/guilds/leave error:', error);
    return errorResponse('LEAVE_ERROR', error.message || 'Ayrılma başarısız', 500);
  }
}
