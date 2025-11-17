import { NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';

export async function GET() {
  try {
    const currentSeason = await prisma.season.findFirst({
      where: {
        isActive: true,
      },
      include: {
        leagues: {
          orderBy: {
            minPoints: 'asc',
          },
        },
      },
    });

    if (!currentSeason) {
      return NextResponse.json(
        { success: false, message: 'Aktif sezon bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: currentSeason,
    });
  } catch (error) {
    console.error('Error fetching current season:', error);
    return NextResponse.json(
      { success: false, message: 'Sezon bilgisi alınamadı' },
      { status: 500 }
    );
  }
}
