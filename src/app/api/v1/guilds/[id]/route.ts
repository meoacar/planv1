import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Try to find by slug first, then by id
    const guild = await prisma.guild.findFirst({
      where: { 
        OR: [
          { slug: params.id },
          { id: params.id },
        ],
        status: 'published',
      },
      include: {
        leader: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
                level: true,
              },
            },
          },
          orderBy: [
            { role: 'asc' },
            { xpEarned: 'desc' },
          ],
        },
      },
    });

    if (!guild) {
      return errorResponse('NOT_FOUND', 'Lonca bulunamadı', 404);
    }

    return successResponse(guild);
  } catch (error: any) {
    console.error('GET /api/v1/guilds/[id] error:', error);
    return errorResponse('FETCH_ERROR', error.message || 'Lonca getirilemedi', 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
    
    const updatedGuild = await prisma.guild.update({
      where: { id: params.id },
      data: {
        description: body.description,
        icon: body.icon,
        color: body.color,
        isPublic: body.isPublic,
        maxMembers: body.maxMembers,
        rules: body.rules,
        monthlyGoal: body.monthlyGoal,
      },
    });

    return successResponse(updatedGuild);
  } catch (error: any) {
    console.error('PATCH /api/v1/guilds/[id] error:', error);
    return errorResponse('UPDATE_ERROR', error.message || 'Güncelleme başarısız', 500);
  }
}
