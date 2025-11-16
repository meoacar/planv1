import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const group = await db.group.update({
      where: { id: params.id },
      data: {
        status: "published",
        publishedAt: new Date(),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Bildirim gönder
    await db.notification.create({
      data: {
        userId: group.creatorId,
        type: "plan_approved",
        title: "Grubunuz Onaylandı! 🎉",
        body: `"${group.name}" grubunuz yayınlandı.`,
        targetType: "plan",
        targetId: group.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Error approving group:", error);
    return NextResponse.json(
      { success: false, error: { code: "APPROVE_ERROR", message: "Grup onaylanamadı" } },
      { status: 500 }
    );
  }
}
