import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/v1/sin-challenges
 * Aktif challenge'ları listele
 */
export async function GET(request: NextRequest) {
  try {
    const now = new Date();

    const challenges = await db.sinChallenge.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "desc" },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    return NextResponse.json({
      challenges: challenges.map((c) => ({
        ...c,
        participantCount: c._count.participants,
      })),
      total: challenges.length,
    });
  } catch (error) {
    console.error("Error fetching sin challenges:", error);
    return NextResponse.json(
      { error: "Challenge'lar yüklenemedi" },
      { status: 500 }
    );
  }
}
