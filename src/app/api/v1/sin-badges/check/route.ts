import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkAndAwardAllBadges } from "@/lib/badge-checker";

/**
 * POST /api/v1/sin-badges/check
 * Manuel rozet kontrolü - Kullanıcının tüm rozetlerini kontrol eder
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tüm rozetleri kontrol et
    const awarded = await checkAndAwardAllBadges(session.user.id);

    return NextResponse.json({
      success: true,
      awarded: awarded.filter(Boolean),
      message:
        awarded.length > 0
          ? `${awarded.length} yeni rozet kazandın! 🎉`
          : "Henüz yeni rozet kazanmadın, devam et! 💪",
    });
  } catch (error) {
    console.error("Error checking badges:", error);
    return NextResponse.json(
      { error: "Rozet kontrolü başarısız" },
      { status: 500 }
    );
  }
}
