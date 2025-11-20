import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// GET /api/admin/cohorts - List all cohorts
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cohorts = await db.cohortDefinition.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ cohorts });
  } catch (error) {
    console.error('Error fetching cohorts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/cohorts - Create new cohort
const createCohortSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  filters: z.object({
    age: z.object({
      min: z.number().optional(),
      max: z.number().optional()
    }).optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    recipesCount: z.object({
      gte: z.number().optional(),
      lte: z.number().optional()
    }).optional(),
    plansCount: z.object({
      gte: z.number().optional(),
      lte: z.number().optional()
    }).optional(),
    xp: z.object({
      gte: z.number().optional(),
      lte: z.number().optional()
    }).optional(),
    level: z.object({
      gte: z.number().optional(),
      lte: z.number().optional()
    }).optional(),
    lastActiveDays: z.number().optional(),
    registeredDays: z.number().optional(),
    streak: z.object({
      gte: z.number().optional(),
      lte: z.number().optional()
    }).optional(),
    hasGuild: z.boolean().optional(),
    role: z.enum(['USER', 'STAFF', 'MODERATOR', 'ADMIN']).optional()
  })
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = createCohortSchema.parse(body);

    const cohort = await db.cohortDefinition.create({
      data: {
        name: validated.name,
        description: validated.description,
        filters: JSON.stringify(validated.filters),
        createdBy: session.user.id
      }
    });

    // Calculate and add users to cohort
    await calculateCohortUsers(cohort.id, validated.filters);

    return NextResponse.json({ cohort }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate cohort users
async function calculateCohortUsers(cohortId: string, filters: any) {
  const where: any = {};

  // XP filter
  if (filters.xp) {
    if (filters.xp.gte !== undefined) where.xp = { gte: filters.xp.gte };
    if (filters.xp.lte !== undefined) where.xp = { ...where.xp, lte: filters.xp.lte };
  }

  // Level filter
  if (filters.level) {
    if (filters.level.gte !== undefined) where.level = { gte: filters.level.gte };
    if (filters.level.lte !== undefined) where.level = { ...where.level, lte: filters.level.lte };
  }

  // Last active filter
  if (filters.lastActiveDays) {
    const date = new Date();
    date.setDate(date.getDate() - filters.lastActiveDays);
    where.updatedAt = { gte: date };
  }

  // Registered filter
  if (filters.registeredDays) {
    const date = new Date();
    date.setDate(date.getDate() - filters.registeredDays);
    where.createdAt = { gte: date };
  }

  // Streak filter
  if (filters.streak) {
    if (filters.streak.gte !== undefined) where.streak = { gte: filters.streak.gte };
    if (filters.streak.lte !== undefined) where.streak = { ...where.streak, lte: filters.streak.lte };
  }

  // Guild membership filter
  if (filters.hasGuild !== undefined) {
    if (filters.hasGuild) {
      where.guildMemberships = { some: {} };
    } else {
      where.guildMemberships = { none: {} };
    }
  }

  // Role filter
  if (filters.role) {
    where.role = filters.role;
  }

  // Find matching users
  const users = await db.user.findMany({
    where,
    select: { id: true }
  });

  // Add users to cohort
  if (users.length > 0) {
    await db.userCohort.createMany({
      data: users.map((user: any) => ({
        cohortId,
        userId: user.id
      })),
      skipDuplicates: true
    });
  }

  return users.length;
}
