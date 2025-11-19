import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/v1/sin-badges/my - Kullanıcının kazandığı rozetler
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userBadges = await db.userSinBadge.findMany({
      where: { userId: session.user.id },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: "desc" },
    });

    return NextResponse.json({
      badges: userBadges,
      total: userBadges.length,
    });
  } catch (error) {
    console.error("Error fetching user sin badges:", error);
    return NextResponse.json(
      { error: "Rozetler yüklenemedi" },
      { status: 500 }
    );
  }
}
