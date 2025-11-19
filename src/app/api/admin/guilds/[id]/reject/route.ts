import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';
import { z } from 'zod';

const rejectSchema = z.object({
  reason: z.string().min(10, 'Red nedeni en az 10 karakter olmalı').max(500),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return errorResponse('FORBIDDEN', 'Bu işlem için yetkiniz yok', 403);
    }

    const body = await req.json();
    const { reason } = rejectSchema.parse(body);

    const guild = await prisma.guild.findUnique({
      where: { id: params.id },
      include: { leader: true },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    // Update guild status
    const updatedGuild = await prisma.guild.update({
      where: { id: params.id },
      data: {
        status: 'rejected',
        rejectionReason: reason,
      },
    });

    // Create notification for guild leader
    await prisma.notification.create({
      data: {
        userId: guild.leaderId,
        type: 'plan_rejected', // Yeni tip eklenebilir: guild_rejected
        title: '❌ Loncanız Reddedildi',
        body: `"${guild.name}" loncanız reddedildi. Nedeni: ${reason}`,
        targetType: 'plan',
        targetId: guild.id,
      },
    });

    return successResponse(updatedGuild);
  } catch (error: any) {
    console.error('POST /api/admin/guilds/[id]/reject error:', error);
    if (error.name === 'ZodError') {
      return errorResponse('VALIDATION_ERROR', 'Geçersiz veri', 400);
    }
    return errorResponse('REJECT_ERROR', error.message || 'Reddetme başarısız', 500);
  }
}
