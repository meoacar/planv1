/**
 * AI Motivation API
 * GET /api/v1/ai/motivation - Günlük motivasyon mesajı
 * POST /api/v1/ai/motivation/goal - Hedef önerisi
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';
import { getDailyMotivation, suggestGoal } from '@/lib/ai-chatbot';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        level: true,
        streak: true,
        sinBadges: {
          include: {
            badge: {
              select: {
                name: true,
                icon: true,
              },
            },
          },
        },
        foodSins: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            sinType: true,
            note: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalSins = await prisma.foodSin.count({
      where: { userId: session.user.id },
    });

    const userContext = {
      level: user.level,
      streak: user.streak,
      totalSins,
      recentSins: user.foodSins.map((sin) => ({
        sinType: sin.sinType,
        note: sin.note || undefined,
        createdAt: sin.createdAt,
      })),
      badges: user.sinBadges.map((ub) => ({
        name: ub.badge.name,
        icon: ub.badge.icon,
      })),
    };

    const motivation = await getDailyMotivation(userContext);

    return NextResponse.json({
      success: true,
      motivation,
    });
  } catch (error) {
    console.error('Daily motivation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcı bilgilerini al
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        level: true,
        streak: true,
        sinBadges: {
          include: {
            badge: {
              select: {
                name: true,
                icon: true,
              },
            },
          },
        },
        foodSins: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            sinType: true,
            note: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalSins = await prisma.foodSin.count({
      where: { userId: session.user.id },
    });

    const userContext = {
      level: user.level,
      streak: user.streak,
      totalSins,
      recentSins: user.foodSins.map((sin) => ({
        sinType: sin.sinType,
        note: sin.note || undefined,
        createdAt: sin.createdAt,
      })),
      badges: user.sinBadges.map((ub) => ({
        name: ub.badge.name,
        icon: ub.badge.icon,
      })),
    };

    const goal = await suggestGoal(userContext);

    return NextResponse.json({
      success: true,
      goal,
    });
  } catch (error) {
    console.error('Suggest goal error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
