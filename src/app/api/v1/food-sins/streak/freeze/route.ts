import { NextResponse } from 'next/server';
import { getServerSession, authOptions } from '@/lib/auth';
import { useStreakFreeze } from '@/lib/streak-calculator';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { streakFreezeCount: true, streak: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.streakFreezeCount <= 0) {
      return NextResponse.json(
        { error: 'Streak freeze yok' },
        { status: 400 }
      );
    }

    const success = await useStreakFreeze(session.user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Streak freeze kullanılamadı' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Streak freeze kullanıldı',
      remainingFreezes: user.streakFreezeCount - 1,
    });
  } catch (error) {
    console.error('Streak freeze error:', error);
    return NextResponse.json(
      { error: 'Failed to use streak freeze' },
      { status: 500 }
    );
  }
}
