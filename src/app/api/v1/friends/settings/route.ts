/**
 * Friend Settings API
 * GET /api/v1/friends/settings - Gizlilik ayarlarını getir
 * PUT /api/v1/friends/settings - Ayarları güncelle
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.friendSettings.findUnique({
      where: { userId: session.user.id },
    });

    // Yoksa default oluştur
    if (!settings) {
      settings = await prisma.friendSettings.create({
        data: {
          userId: session.user.id,
          allowFriendRequests: true,
          showStreak: true,
          showBadges: true,
          showStats: true,
          showActivity: true,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Get friend settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      allowFriendRequests,
      showStreak,
      showBadges,
      showStats,
      showActivity,
    } = body;

    const settings = await prisma.friendSettings.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        allowFriendRequests: allowFriendRequests ?? true,
        showStreak: showStreak ?? true,
        showBadges: showBadges ?? true,
        showStats: showStats ?? true,
        showActivity: showActivity ?? true,
      },
      update: {
        allowFriendRequests,
        showStreak,
        showBadges,
        showStats,
        showActivity,
      },
    });

    return NextResponse.json({
      success: true,
      settings,
      message: 'Settings updated',
    });
  } catch (error) {
    console.error('Update friend settings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
