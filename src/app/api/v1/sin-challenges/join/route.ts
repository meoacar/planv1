import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const joinSchema = z.object({
  challengeId: z.string(),
});

/**
 * POST /api/v1/sin-challenges/join
 * Challenge'a katıl
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId } = joinSchema.parse(body);

    // Challenge var mı ve aktif mi?
    const challenge = await db.sinChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge bulunamadı" },
        { status: 404 }
      );
    }

    if (!challenge.isActive) {
      return NextResponse.json(
        { error: "Challenge aktif değil" },
        { status: 400 }
      );
    }

    const now = new Date();
    if (now < challenge.startDate || now > challenge.endDate) {
      return NextResponse.json(
        { error: "Challenge süresi dolmuş veya henüz başlamamış" },
        { status: 400 }
      );
    }

    // Zaten katılmış mı?
    const existing = await db.userSinChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: session.user.id,
          challengeId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Bu challenge'a zaten katıldın" },
        { status: 400 }
      );
    }

    // Katıl
    const participation = await db.userSinChallenge.create({
      data: {
        userId: session.user.id,
        challengeId,
        progress: 0,
        isCompleted: false,
      },
      include: {
        challenge: true,
      },
    });

    return NextResponse.json({
      success: true,
      participation,
      message: `${challenge.title} challenge'ına katıldın! 🎯`,
    });
  } catch (error) {
    console.error("Error joining sin challenge:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Challenge'a katılma başarısız" },
      { status: 500 }
    );
  }
}
