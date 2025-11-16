import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/guilds - Admin lonca listesi (tüm statuslar)
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
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    const [guilds, total, pendingCount] = await Promise.all([
      db.guild.findMany({
        where,
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.guild.count({ where }),
      db.guild.count({ where: { status: "pending" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: guilds,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        pendingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching admin guilds:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Loncalar yüklenemedi" } },
      { status: 500 }
    );
  }
}
