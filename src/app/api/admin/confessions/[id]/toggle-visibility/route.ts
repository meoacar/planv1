import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const toggleSchema = z.object({
  status: z.enum(["hidden", "published"]),
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
    const validation = toggleSchema.safeParse(body);

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

    const { status } = validation.data;

    // İtirafı kontrol et
    const existingConfession = await db.confession.findUnique({
      where: { id: params.id },
      select: { id: true, status: true },
    });

    if (!existingConfession) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "İtiraf bulunamadı" } },
        { status: 404 }
      );
    }

    // İtirafın görünürlüğünü değiştir
    const confession = await db.confession.update({
      where: { id: params.id },
      data: {
        status,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: confession,
    });
  } catch (error) {
    console.error("Error toggling confession visibility:", error);
    return NextResponse.json(
      { success: false, error: { code: "TOGGLE_ERROR", message: "İşlem başarısız" } },
      { status: 500 }
    );
  }
}
