import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/confessions/reports - Rapor edilen itiraflar
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

    // Rapor edilen itirafları getir (en az 1 rapor olan)
    const reportedConfessions = await db.confession.findMany({
      where: {
        reports: {
          some: {},
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
        reports: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            empathies: true,
            reports: true,
          },
        },
      },
      orderBy: [
        {
          reports: {
            _count: "desc",
          },
        },
        { createdAt: "desc" },
      ],
      skip,
      take: limit,
    });

    const total = await db.confession.count({
      where: {
        reports: {
          some: {},
        },
      },
    });

    // Rapor sayısına göre grupla
    const confessionsWithReportCount = reportedConfessions.map((confession) => ({
      confession: {
        ...confession,
        reports: undefined, // Reports'u ayrı göstereceğiz
      },
      reportCount: confession._count.reports,
      reports: confession.reports,
    }));

    return NextResponse.json({
      success: true,
      data: confessionsWithReportCount,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reported confessions:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Rapor edilen itiraflar yüklenemedi" } },
      { status: 500 }
    );
  }
}
