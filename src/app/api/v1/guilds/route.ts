import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { createGuildSchema } from '@/validations/gamification.schema';
import { db as prisma } from '@/lib/db';
import { notifyAdmins } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const [guilds, total] = await Promise.all([
      prisma.guild.findMany({
        where: { 
          status: 'published', // Sadece onaylanmış loncalar (public ve private)
        },
        include: {
          leader: { select: { id: true, username: true, name: true, image: true } },
          _count: { select: { members: true } },
        },
        orderBy: { totalXP: 'desc' },
        skip,
        take: limit,
      }),
      prisma.guild.count({ where: { status: 'published' } }),
    ]);

    return successResponse(guilds, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('GET /api/v1/guilds error:', error);
    return errorResponse('FETCH_ERROR', error.message || 'Failed to fetch guilds', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return errorResponse('UNAUTHORIZED', 'Giriş yapmalısınız', 401);
    }

    const body = await req.json();
    const validated = createGuildSchema.parse(body);

    // Check if user is already in a guild
    const existingMembership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
    });

    if (existingMembership) {
      return errorResponse('ALREADY_IN_GUILD', 'Zaten bir loncadasınız', 400);
    }

    // Create guild with all fields
    const guild = await prisma.guild.create({
      data: {
        name: validated.name,
        slug: validated.slug,
        leaderId: session.user.id,
        description: validated.description,
        icon: validated.icon,
        color: validated.color,
        category: validated.category,
        isPublic: validated.isPublic,
        maxMembers: validated.maxMembers,
        rules: validated.rules,
        monthlyGoal: validated.monthlyGoal,
        status: 'pending', // Admin onayı bekliyor
      },
    });

    // Add leader as member
    await prisma.guildMember.create({
      data: {
        guildId: guild.id,
        userId: session.user.id,
        role: 'leader',
      },
    });

    // Update member count
    await prisma.guild.update({
      where: { id: guild.id },
      data: { memberCount: 1 },
    });

    // Admin'lere bildirim gönder
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, username: true }
    })
    
    await notifyAdmins({
      type: 'guild_pending',
      title: 'Yeni Lonca Onay Bekliyor',
      message: `${user?.name || user?.username} tarafından "${guild.name}" loncası oluşturuldu`,
      link: `/admin/loncalar`,
      metadata: {
        guildId: guild.id,
        leaderId: session.user.id,
      }
    })

    return successResponse(guild);
  } catch (error: any) {
    console.error('POST /api/v1/guilds error:', error);
    if (error.name === 'ZodError') {
      return errorResponse('VALIDATION_ERROR', 'Geçersiz veri', 400);
    }
    return errorResponse('CREATE_ERROR', error.message || 'Lonca oluşturulamadı', 500);
  }
}
