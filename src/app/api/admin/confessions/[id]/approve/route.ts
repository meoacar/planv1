import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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

    // İtirafı kontrol et
    const existingConfession = await db.confession.findUnique({
      where: { id: params.id },
      select: { userId: true, status: true },
    });

    if (!existingConfession) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "İtiraf bulunamadı" } },
        { status: 404 }
      );
    }

    // İtirafı onayla
    const confession = await db.confession.update({
      where: { id: params.id },
      data: {
        status: "published",
        publishedAt: new Date(),
        rejectionReason: null, // Önceki red sebebini temizle
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
      },
    });

    // Kullanıcıya bildirim gönder
    await db.notification.create({
      data: {
        userId: existingConfession.userId,
        type: "confession_approved",
        title: "İtirafınız Onaylandı! 🎉",
        body: "İtirafınız yayınlandı ve artık diğer kullanıcılar tarafından görülebilir.",
        targetType: "confession",
        targetId: confession.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: confession,
    });
  } catch (error) {
    console.error("Error approving confession:", error);
    return NextResponse.json(
      { success: false, error: { code: "APPROVE_ERROR", message: "İtiraf onaylanamadı" } },
      { status: 500 }
    );
  }
}
