import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/admin/cohorts/[id]/export - Export cohort users as CSV
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || !['ADMIN', 'MODERATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cohort = await db.cohortDefinition.findUnique({
      where: { id: params.id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                username: true,
                name: true,
                xp: true,
                level: true,
                coins: true,
                streak: true,
                createdAt: true,
                updatedAt: true,
                _count: {
                  select: {
                    plans: true,
                    recipes: true,
                    followers: true,
                    following: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!cohort) {
      return NextResponse.json({ error: 'Cohort not found' }, { status: 404 });
    }

    // Generate CSV
    const headers = [
      'ID',
      'Email',
      'Username',
      'Name',
      'XP',
      'Level',
      'Coins',
      'Streak',
      'Plans',
      'Recipes',
      'Followers',
      'Following',
      'Registered',
      'Last Active'
    ];

    const rows = cohort.users.map(({ user }) => [
      user.id,
      user.email,
      user.username || '',
      user.name || '',
      user.xp,
      user.level,
      user.coins,
      user.streak,
      user._count.plans,
      user._count.recipes,
      user._count.followers,
      user._count.following,
      user.createdAt.toISOString(),
      user.updatedAt.toISOString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="cohort-${cohort.name.replace(/\s+/g, '-')}-${Date.now()}.csv"`
      }
    });
  } catch (error) {
    console.error('Error exporting cohort:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
