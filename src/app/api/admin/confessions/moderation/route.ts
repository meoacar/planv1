import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/confessions/moderation - Moderasyon kuyruğu
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Giriş yapmalısınız" } },
        { status: 401 }
      );
    }

    // Admin kontrolü
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Bu işlem için yetkiniz yok" } },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const skip = (page - 1) * limit;

    // Pending ve hidden statusundaki itirafları getir
    const [confessions, total, pendingCount, hiddenCount] = await Promise.all([
      db.confession.findMany({
        where: {
          status: {
            in: ["pending", "hidden"],
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          _count: {
            select: {
              empathies: true,
              reports: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.confession.count({
        where: {
          status: {
            in: ["pending", "hidden"],
          },
        },
      }),
      db.confession.count({ where: { status: "pending" } }),
      db.confession.count({ where: { status: "hidden" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: confessions,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        pendingCount,
        hiddenCount,
      },
    });
  } catch (error) {
    console.error("Error fetching moderation queue:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Moderasyon kuyruğu yüklenemedi" } },
      { status: 500 }
    );
  }
}
