import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateRecommendations } from '@/lib/ai';
import { z } from 'zod';

const recommendationSchema = z.object({
  type: z.enum(['plan', 'recipe', 'group', 'guild', 'challenge']).optional(),
  limit: z.number().min(1).max(50).optional().default(10),
  refresh: z.boolean().optional().default(false),
});

/**
 * GET /api/v1/ai/recommendations
 * Get personalized AI recommendations for the user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const params = recommendationSchema.parse({
      type: searchParams.get('type') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      refresh: searchParams.get('refresh') === 'true',
    });

    // Check for existing recommendations (cache)
    if (!params.refresh) {
      const existingRecommendations = await prisma.aIRecommendation.findMany({
        where: {
          userId: session.user.id,
          dismissed: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
          ...(params.type && { recommendationType: params.type }),
        },
        orderBy: { score: 'desc' },
        take: params.limit,
      });

      if (existingRecommendations.length >= params.limit) {
        return NextResponse.json({
          success: true,
          data: {
            recommendations: existingRecommendations,
            cached: true,
          },
          meta: { version: 'v1' },
        });
      }
    }

    // Fetch user data for AI
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        currentWeight: true,
        targetWeight: true,
        height: true,
        level: true,
        xp: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    // Fetch user history
    const [completedPlans, likedRecipes, joinedGroups] = await Promise.all([
      prisma.planProgress.findMany({
        where: { userId: session.user.id },
        select: { planId: true },
        take: 10,
      }),
      prisma.recipeLike.findMany({
        where: { userId: session.user.id },
        select: { recipeId: true },
        take: 10,
      }),
      prisma.groupMember.findMany({
        where: { userId: session.user.id },
        select: { groupId: true },
        take: 5,
      }),
    ]);

    // Generate AI recommendations
    const aiRecommendations = await generateRecommendations({
      userId: session.user.id,
      userPreferences: {
        goals: user.targetWeight ? ['weight_loss'] : [],
        activityLevel: user.level > 10 ? 'high' : user.level > 5 ? 'medium' : 'low',
      },
      userHistory: {
        completedPlans: completedPlans.map((p) => p.planId),
        likedRecipes: likedRecipes.map((r) => r.recipeId),
        joinedGroups: joinedGroups.map((g) => g.groupId),
      },
      limit: params.limit,
    });

    // Save recommendations to database
    const savedRecommendations = await Promise.all(
      aiRecommendations.map((rec) =>
        prisma.aIRecommendation.create({
          data: {
            userId: session.user.id,
            recommendationType: rec.type,
            targetId: rec.targetId,
            targetTitle: rec.targetTitle,
            score: rec.score,
            reason: rec.reason,
            metadata: rec.metadata ? JSON.stringify(rec.metadata) : null,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      data: {
        recommendations: savedRecommendations,
        cached: false,
      },
      meta: { version: 'v1' },
    });
  } catch (error) {
    console.error('AI recommendations error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request parameters',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate recommendations',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/ai/recommendations/:id/feedback
 * Track user interaction with recommendations
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { recommendationId, action } = z
      .object({
        recommendationId: z.string(),
        action: z.enum(['clicked', 'dismissed']),
      })
      .parse(body);

    const recommendation = await prisma.aIRecommendation.findUnique({
      where: { id: recommendationId },
    });

    if (!recommendation || recommendation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Recommendation not found' } },
        { status: 404 }
      );
    }

    const updated = await prisma.aIRecommendation.update({
      where: { id: recommendationId },
      data:
        action === 'clicked'
          ? { clicked: true, clickedAt: new Date() }
          : { dismissed: true, dismissedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      data: { recommendation: updated },
      meta: { version: 'v1' },
    });
  } catch (error) {
    console.error('Recommendation feedback error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update recommendation',
        },
      },
      { status: 500 }
    );
  }
}
