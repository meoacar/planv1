import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { apiResponse } from '@/lib/api-response';
import { createGuildSchema } from '@/validations/gamification.schema';
import * as gamificationService from '@/services/gamification.service';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [guilds, total] = await Promise.all([
      prisma.guild.findMany({
        where: { isPublic: true },
        include: {
          leader: { select: { id: true, username: true, name: true, image: true } },
          _count: { select: { members: true } },
        },
        orderBy: { totalXP: 'desc' },
        skip,
        take: limit,
      }),
      prisma.guild.count({ where: { isPublic: true } }),
    ]);

    return apiResponse.success(guilds, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('GET /api/v1/guilds error:', error);
    return apiResponse.error(error.message || 'Failed to fetch guilds', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return apiResponse.error('Unauthorized', 401);
    }

    const body = await req.json();
    const validated = createGuildSchema.parse(body);

    // Check if user is already in a guild
    const existingMembership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
    });

    if (existingMembership) {
      return apiResponse.error('You are already in a guild', 400);
    }

    const guild = await gamificationService.createGuild(
      validated.name,
      validated.slug,
      session.user.id,
      validated.description
    );

    return apiResponse.success(guild, undefined, 201);
  } catch (error: any) {
    console.error('POST /api/v1/guilds error:', error);
    if (error.name === 'ZodError') {
      return apiResponse.error('Invalid input', 400, error.errors);
    }
    return apiResponse.error(error.message || 'Failed to create guild', 500);
  }
}
