import { NextRequest, NextResponse } from 'next/server';
import { getServerSession, authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { checkAndAwardAllBadges } from '@/lib/badge-checker';
import { checkAndUpdateChallenges } from '@/lib/challenge-checker';
import { updateUserStreak, checkStreakMilestones } from '@/lib/streak-calculator';

// Validation schema
const createSinSchema = z.object({
  sinType: z.enum(['tatli', 'fastfood', 'gazli', 'alkol', 'diger']),
  note: z.string().optional(),
});

// GET - Kullanıcının günah geçmişi
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const sinType = searchParams.get('sinType');

    const where: any = { userId: session.user.id };
    if (sinType) {
      where.sinType = sinType;
    }

    const sins = await prisma.foodSin.findMany({
      where,
      orderBy: { sinDate: 'desc' },
      take: limit,
    });

    return NextResponse.json({ sins });
  } catch (error: any) {
    console.error('Error fetching food sins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch food sins' },
      { status: 500 }
    );
  }
}

// POST - Yeni günah ekle
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = createSinSchema.parse(body);

    // Emoji mapping
    const emojiMap: Record<string, string> = {
      tatli: '🍰',
      fastfood: '🍟',
      gazli: '🥤',
      alkol: '🍺',
      diger: '🍩',
    };

    // Random reaction seç
    const reactions = await prisma.sinReaction.findMany({
      where: {
        sinType: validated.sinType,
        isActive: true,
      },
    });

    const randomReaction = reactions.length > 0
      ? reactions[Math.floor(Math.random() * reactions.length)]
      : null;

    // Günah kaydı oluştur
    const sin = await prisma.foodSin.create({
      data: {
        userId: session.user.id,
        sinType: validated.sinType,
        note: validated.note,
        emoji: emojiMap[validated.sinType],
        reactionText: randomReaction?.reactionText || 'Kaçamak da olur 😊',
      },
    });

    // Reaction kullanım sayısını artır
    if (randomReaction) {
      await prisma.sinReaction.update({
        where: { id: randomReaction.id },
        data: { usageCount: { increment: 1 } },
      });
    }

    // Streak güncelle (günah yapıldı, streak sıfırlanacak)
    const currentStreak = await updateUserStreak(session.user.id);

    // Sadece "Gizli Tatlıcı" rozetini kontrol et (aynı gün 2 tatlı)
    // Diğer rozetler günlük kontrol ile verilir
    if (validated.sinType === 'tatli') {
      const { checkSpecificBadge } = await import('@/lib/badge-checker');
      checkSpecificBadge(session.user.id, 'gizli_tatlici').catch(console.error);
    }

    // Challenge ve Streak milestone kontrolü (async, sonucu bekleme)
    Promise.all([
      checkAndUpdateChallenges(session.user.id),
      checkStreakMilestones(session.user.id, currentStreak),
    ]).catch(console.error);

    return NextResponse.json({ 
      sin,
      reactionText: sin.reactionText 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating food sin:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create food sin' },
      { status: 500 }
    );
  }
}

// Badge kontrol fonksiyonu artık badge-checker.ts'de
