import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/v1/groups/my-groups - Kullanıcının oluşturduğu gruplar
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Giriş yapmalısınız" } },
        { status: 401 }
      );
    }

    const groups = await db.group.findMany({
      where: {
        creatorId: session.user.id,
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error("Error fetching my groups:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Gruplar yüklenemedi" } },
      { status: 500 }
    );
  }
}
