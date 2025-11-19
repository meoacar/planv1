import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/v1/sin-badges - Tüm rozetleri listele
export async function GET(request: NextRequest) {
  try {
    const badges = await db.sinBadge.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      badges,
      total: badges.length,
    });
  } catch (error) {
    console.error("Error fetching sin badges:", error);
    return NextResponse.json(
      { error: "Rozetler yüklenemedi" },
      { status: 500 }
    );
  }
}
