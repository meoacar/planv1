import { NextResponse } from 'next/server';
import { getServerSession, authOptions } from '@/lib/auth';
import { calculateUserStreak, updateUserStreak } from '@/lib/streak-calculator';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const streakData = await calculateUserStreak(session.user.id);

    // Kazanılmış streak milestone rozetlerini al
    const { prisma } = await import('@/lib/prisma');
    const achievedBadges = await prisma.userBadge.findMany({
      where: {
        userId: session.user.id,
        badge: {
          key: {
            startsWith: 'streak_',
          },
        },
      },
      include: {
        badge: true,
      },
    });

    // Badge key'lerinden milestone günlerini çıkar (örn: "streak_7" -> 7)
    const achievedMilestones = achievedBadges
      .map((ub) => {
        const match = ub.badge.key.match(/streak_(\d+)/);
        return match ? parseInt(match[1]) : null;
      })
      .filter((day): day is number => day !== null);

    return NextResponse.json({
      ...streakData,
      achievedMilestones,
    });
  } catch (error) {
    console.error('Streak calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate streak' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentStreak = await updateUserStreak(session.user.id);

    return NextResponse.json({
      success: true,
      currentStreak,
      message: 'Streak güncellendi',
    });
  } catch (error) {
    console.error('Streak update error:', error);
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    );
  }
}
