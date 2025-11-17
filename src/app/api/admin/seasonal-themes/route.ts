import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const createThemeSchema = z.object({
  name: z.string().min(3, "Tema adı en az 3 karakter olmalı").max(100, "Tema adı en fazla 100 karakter olabilir"),
  category: z.string().min(1, "Kategori gerekli"),
  icon: z.string().min(1, "İkon gerekli"),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir başlangıç tarihi giriniz"),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Geçerli bir bitiş tarihi giriniz"),
});

// GET /api/admin/seasonal-themes - Tüm sezonluk temaları listele
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
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    // TODO: SeasonalTheme modeli schema'ya eklendikten sonra aktif edilecek
    // Şimdilik boş array dönüyoruz
    const themes: any[] = [];
    
    /*
    const themes = await db.seasonalTheme.findMany({
      where,
      orderBy: [
        { isActive: "desc" },
        { startDate: "desc" },
      ],
    });
    */

    return NextResponse.json({
      success: true,
      data: themes,
    });
  } catch (error) {
    console.error("Error fetching seasonal themes:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Sezonluk temalar yüklenemedi" } },
      { status: 500 }
    );
  }
}

// POST /api/admin/seasonal-themes - Yeni sezonluk tema oluştur
export async function POST(req: NextRequest) {
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

    // Body'yi parse et
    const body = await req.json();
    const validation = createThemeSchema.safeParse(body);

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

    const { name, category, icon, startDate, endDate } = validation.data;

    // Tarih kontrolü
    const start = new Date(startDate);
    const end = new Date(endDate);

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

    // TODO: SeasonalTheme modeli schema'ya eklendikten sonra aktif edilecek
    // Şimdilik mock response dönüyoruz
    const theme = {
      id: "mock-id",
      name,
      category,
      icon,
      startDate: start,
      endDate: end,
      isActive: true,
      createdAt: new Date(),
    };
    
    /*
    const theme = await db.seasonalTheme.create({
      data: {
        name,
        category,
        icon,
        startDate: start,
        endDate: end,
        isActive: true,
      },
    });
    */

    return NextResponse.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    console.error("Error creating seasonal theme:", error);
    return NextResponse.json(
      { success: false, error: { code: "CREATE_ERROR", message: "Sezonluk tema oluşturulamadı" } },
      { status: 500 }
    );
  }
}
