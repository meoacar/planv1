import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, authOptions } from '@/lib/auth';
import { recoverStreak } from '@/lib/streak-calculator';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { streakToRecover } = body;

    if (!streakToRecover || streakToRecover <= 0) {
      return NextResponse.json(
        { error: 'Geçersiz streak değeri' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { coins: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const coinsCost = Math.min(streakToRecover * 10, 500);

    if (user.coins < coinsCost) {
      return NextResponse.json(
        { error: 'Yetersiz coin', required: coinsCost, available: user.coins },
        { status: 400 }
      );
    }

    const success = await recoverStreak(session.user.id, streakToRecover);

    if (!success) {
      return NextResponse.json(
        { error: 'Streak geri alınamadı' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Streak geri alındı',
      streakRecovered: streakToRecover,
      coinsCost,
      remainingCoins: user.coins - coinsCost,
    });
  } catch (error) {
    console.error('Streak recovery error:', error);
    return NextResponse.json(
      { error: 'Failed to recover streak' },
      { status: 500 }
    );
  }
}
