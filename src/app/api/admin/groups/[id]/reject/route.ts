import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(10).max(500),
});

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

    const body = await req.json();
    const validated = rejectSchema.parse(body);

    const group = await db.group.update({
      where: { id: params.id },
      data: {
        status: "rejected",
        rejectionReason: validated.reason,
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
        type: "plan_rejected",
        title: "Grubunuz Reddedildi",
        body: `"${group.name}" grubunuz reddedildi. Sebep: ${validated.reason}`,
        targetType: "plan",
        targetId: group.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: group,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: error.errors } },
        { status: 400 }
      );
    }
    console.error("Error rejecting group:", error);
    return NextResponse.json(
      { success: false, error: { code: "REJECT_ERROR", message: "Grup reddedilemedi" } },
      { status: 500 }
    );
  }
}
