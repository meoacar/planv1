import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/v1/sin-challenges/my
 * Kullanıcının katıldığı challenge'lar
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // active, completed, failed

    const where: any = { userId: session.user.id };

    if (status === "completed") {
      where.isCompleted = true;
    } else if (status === "active") {
      where.isCompleted = false;
      where.challenge = {
        isActive: true,
        endDate: { gte: new Date() },
      };
    }

    const participations = await db.userSinChallenge.findMany({
      where,
      include: {
        challenge: true,
      },
      orderBy: { joinedAt: "desc" },
    });

    return NextResponse.json({
      participations,
      total: participations.length,
    });
  } catch (error) {
    console.error("Error fetching user sin challenges:", error);
    return NextResponse.json(
      { error: "Challenge'lar yüklenemedi" },
      { status: 500 }
    );
  }
}
