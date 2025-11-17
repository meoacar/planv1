import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/confessions/analytics - Detaylı analitik
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
    const days = parseInt(searchParams.get("days") || "30");

    // Tarih aralığı
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // TODO: Confession modeli schema'ya eklendikten sonra bu kısım aktif edilecek
    // Şimdilik mock data dönüyoruz
    
    // Mock data
    const dailyStatsArray: Array<{ date: string; count: number }> = [];
    const categoryDistribution: Record<string, number> = {};
    const statusDistribution: Record<string, number> = {};
    const totalConfessions = 0;
    const aiResponseSuccessRate = 0;
    const averageResponseTime = 0;
    const telafiAcceptanceRate = 0;
    const totalEmpathies = 0;
    const totalReports = 0;
    const popularConfessionsCount = 0;

    /* 
    // Gerçek implementasyon (Confession modeli eklendikten sonra):
    const confessions = await db.confession.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        id: true,
        category: true,
        status: true,
        aiResponse: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    const dailyStats: Record<string, number> = {};
    confessions.forEach((confession: any) => {
      const date = confession.createdAt.toISOString().split("T")[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    const dailyStatsArray = Object.entries(dailyStats)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const categoryDistribution: Record<string, number> = {};
    confessions.forEach((confession: any) => {
      categoryDistribution[confession.category] = (categoryDistribution[confession.category] || 0) + 1;
    });

    const totalConfessions = confessions.length;
    const confessionsWithAI = confessions.filter((c: any) => c.aiResponse).length;
    const aiResponseSuccessRate = totalConfessions > 0 ? (confessionsWithAI / totalConfessions) * 100 : 0;

    const publishedConfessions = confessions.filter((c: any) => c.publishedAt);
    const totalResponseTime = publishedConfessions.reduce((sum: number, confession: any) => {
      if (confession.publishedAt) {
        const responseTime = confession.publishedAt.getTime() - confession.createdAt.getTime();
        return sum + responseTime;
      }
      return sum;
    }, 0);
    const averageResponseTime = publishedConfessions.length > 0 
      ? totalResponseTime / publishedConfessions.length / 1000
      : 0;

    const telafiAcceptanceRate = 0;

    const statusDistribution: Record<string, number> = {};
    confessions.forEach((confession: any) => {
      statusDistribution[confession.status] = (statusDistribution[confession.status] || 0) + 1;
    });

    const totalEmpathies = await db.confessionEmpathy.count({
      where: {
        confession: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    });

    const totalReports = await db.confessionReport.count({
      where: {
        confession: {
          createdAt: {
            gte: startDate,
          },
        },
      },
    });

    const popularConfessionsCount = await db.confession.count({
      where: {
        isPopular: true,
        createdAt: {
          gte: startDate,
        },
      },
    });
    */

    return NextResponse.json({
      success: true,
      data: {
        dailyStats: dailyStatsArray,
        categoryDistribution,
        statusDistribution,
        aiResponseSuccessRate: Math.round(aiResponseSuccessRate * 100) / 100,
        averageResponseTime: Math.round(averageResponseTime * 100) / 100,
        telafiAcceptanceRate,
        summary: {
          totalConfessions,
          totalEmpathies,
          totalReports,
          popularConfessionsCount,
          averageEmpathyPerConfession: totalConfessions > 0 
            ? Math.round((totalEmpathies / totalConfessions) * 100) / 100 
            : 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching confession analytics:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Analitik verileri yüklenemedi" } },
      { status: 500 }
    );
  }
}
