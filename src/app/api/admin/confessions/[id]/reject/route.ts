import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(10, "Reddetme sebebi en az 10 karakter olmalı").max(500, "Reddetme sebebi en fazla 500 karakter olabilir"),
});

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

    // Body'yi parse et
    const body = await req.json();
    const validation = rejectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validation.error.errors[0].message,
          },
        },
        { status: 400 }
      );
    }

    const { reason } = validation.data;

    // İtirafı kontrol et
    const existingConfession = await db.confession.findUnique({
      where: { id: id },
      select: { userId: true, status: true, content: true },
    });

    if (!existingConfession) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "İtiraf bulunamadı" } },
        { status: 404 }
      );
    }

    // İtirafı reddet
    const confession = await db.confession.update({
      where: { id: id },
      data: {
        status: "rejected",
        rejectionReason: reason,
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
        type: "confession_rejected",
        title: "İtirafınız Reddedildi",
        body: `İtirafınız yayınlanamadı. Sebep: ${reason}`,
        targetType: "confession",
        targetId: confession.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: confession,
    });
  } catch (error) {
    console.error("Error rejecting confession:", error);
    return NextResponse.json(
      { success: false, error: { code: "REJECT_ERROR", message: "İtiraf reddedilemedi" } },
      { status: 500 }
    );
  }
}
