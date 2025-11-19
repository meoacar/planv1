import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const updateThemeSchema = z.object({
  name: z.string().min(3, "Tema adı en az 3 karakter olmalı").max(100, "Tema adı en fazla 100 karakter olabilir").optional(),
  category: z.string().min(1, "Kategori gerekli").optional(),
  icon: z.string().min(1, "İkon gerekli").optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir başlangıç tarihi giriniz").optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir bitiş tarihi giriniz").optional(),
  isActive: z.boolean().optional(),
});

// GET /api/admin/seasonal-themes/[id] - Tekil tema detayı
export async function GET(
  _req: NextRequest,
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

    // TODO: SeasonalTheme modeli schema'ya eklendikten sonra aktif edilecek
    // Şimdilik mock response dönüyoruz
    const theme = null;
    
    /*
    const theme = await db.seasonalTheme.findUnique({
      where: { id: params.id },
    });
    */

    if (!theme) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Tema bulunamadı" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    console.error("Error fetching seasonal theme:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Tema yüklenemedi" } },
      { status: 500 }
    );
  }
}

// PUT /api/admin/seasonal-themes/[id] - Tema güncelle
export async function PUT(
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
    const validation = updateThemeSchema.safeParse(body);

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

    const { name, category, icon, startDate, endDate, isActive } = validation.data;

    // TODO: SeasonalTheme modeli schema'ya eklendikten sonra aktif edilecek
    // Şimdilik mock response dönüyoruz
    const existingTheme: any = null;
    
    /*
    const existingTheme = await db.seasonalTheme.findUnique({
      where: { id: params.id },
    });
    */

    if (!existingTheme) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Tema bulunamadı" } },
        { status: 404 }
      );
    }

    // Güncelleme verisi hazırla
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Tarih güncellemesi varsa kontrol et
    if (startDate !== undefined || endDate !== undefined) {
      const start = startDate ? new Date(startDate) : existingTheme.startDate;
      const end = endDate ? new Date(endDate) : existingTheme.endDate;

      if (end <= start) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Bitiş tarihi başlangıç tarihinden sonra olmalı",
            },
          },
          { status: 400 }
        );
      }

      if (startDate) updateData.startDate = start;
      if (endDate) updateData.endDate = end;
    }

    // Mock response
    const theme = {
      id: params.id,
      ...updateData,
    };

    /*
    const theme = await db.seasonalTheme.update({
      where: { id: params.id },
      data: updateData,
    });
    */

    return NextResponse.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    console.error("Error updating seasonal theme:", error);
    return NextResponse.json(
      { success: false, error: { code: "UPDATE_ERROR", message: "Tema güncellenemedi" } },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/seasonal-themes/[id] - Tema sil
export async function DELETE(
  _req: NextRequest,
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

    // TODO: SeasonalTheme modeli schema'ya eklendikten sonra aktif edilecek
    const existingTheme: any = null;
    
    /*
    const existingTheme = await db.seasonalTheme.findUnique({
      where: { id: params.id },
    });
    */

    if (!existingTheme) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Tema bulunamadı" } },
        { status: 404 }
      );
    }

    /*
    await db.seasonalTheme.delete({
      where: { id: params.id },
    });
    */

    return NextResponse.json({
      success: true,
      message: "Tema başarıyla silindi",
    });
  } catch (error) {
    console.error("Error deleting seasonal theme:", error);
    return NextResponse.json(
      { success: false, error: { code: "DELETE_ERROR", message: "Tema silinemedi" } },
      { status: 500 }
    );
  }
}
