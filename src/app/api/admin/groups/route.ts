import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/groups - Admin grup listesi (tüm statuslar)
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

    const [groups, total, pendingCount] = await Promise.all([
      db.group.findMany({
        where,
        include: {
          creator: {
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
              posts: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.group.count({ where }),
      db.group.count({ where: { status: "pending" } }),
    ]);

    return NextResponse.json({
      success: true,
      data: groups,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        pendingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching admin groups:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Gruplar yüklenemedi" } },
      { status: 500 }
    );
  }
}
