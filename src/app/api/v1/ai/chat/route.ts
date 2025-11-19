/**
 * AI Chatbot API
 * POST /api/v1/ai/chat - AI ile sohbet et
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';
import { chatWithAI, getQuickAnswer } from '@/lib/ai-chatbot';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { messages, quickQuestion } = body;

    // Kullanıcı context'ini al
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
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
      name: user.name || undefined,
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

    let response: string;

    console.log('[AI Chat] Request type:', quickQuestion ? 'Quick' : 'Normal');
    console.log('[AI Chat] GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);

    if (quickQuestion) {
      // Hızlı soru
      console.log('[AI Chat] Quick question:', quickQuestion);
      response = await getQuickAnswer(quickQuestion, userContext);
    } else if (messages && Array.isArray(messages)) {
      // Normal sohbet
      console.log('[AI Chat] Messages count:', messages.length);
      response = await chatWithAI(messages, userContext);
    } else {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    console.log('[AI Chat] Response length:', response.length);

    return NextResponse.json({
      success: true,
      response,
      userContext: {
        level: user.level,
        streak: user.streak,
        badgeCount: user.sinBadges.length,
      },
    });
  } catch (error: any) {
    console.error('[AI Chat] Error:', error.message);
    console.error('[AI Chat] Stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
