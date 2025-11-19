import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// POST /api/admin/cohorts/[id]/refresh - Recalculate cohort users
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cohort = await db.cohortDefinition.findUnique({
      where: { id: params.id }
    });

    if (!cohort) {
      return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
    }

    // Delete existing users
    await db.userCohort.deleteMany({
      where: { cohortId: params.id }
    });

    // Recalculate users
    const filters = cohort.filters as any;
    const where: any = {};

    // Apply filters (same logic as creation)
    if (filters.xp) {
      if (filters.xp.gte !== undefined) where.xp = { gte: filters.xp.gte };
      if (filters.xp.lte !== undefined) where.xp = { ...where.xp, lte: filters.xp.lte };
    }

    if (filters.level) {
      if (filters.level.gte !== undefined) where.level = { gte: filters.level.gte };
      if (filters.level.lte !== undefined) where.level = { ...where.level, lte: filters.level.lte };
    }

    if (filters.lastActiveDays) {
      const date = new Date();
      date.setDate(date.getDate() - filters.lastActiveDays);
      where.updatedAt = { gte: date };
    }

    if (filters.registeredDays) {
      const date = new Date();
      date.setDate(date.getDate() - filters.registeredDays);
      where.createdAt = { gte: date };
    }

    if (filters.streak) {
      if (filters.streak.gte !== undefined) where.streak = { gte: filters.streak.gte };
      if (filters.streak.lte !== undefined) where.streak = { ...where.streak, lte: filters.streak.lte };
    }

    if (filters.hasGuild !== undefined) {
      if (filters.hasGuild) {
        where.guildMemberships = { some: {} };
      } else {
        where.guildMemberships = { none: {} };
      }
    }

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
        data: users.map(user => ({
          cohortId: params.id,
          userId: user.id
        })),
        skipDuplicates: true
      });
    }

    return NextResponse.json({
      success: true,
      userCount: users.length
    });
  } catch (error) {
    console.error('Error refreshing cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
