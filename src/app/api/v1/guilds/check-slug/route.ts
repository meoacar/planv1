import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { db as prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return errorResponse('MISSING_SLUG', 'Slug parametresi gerekli', 400);
    }

    const existingGuild = await prisma.guild.findUnique({
      where: { slug },
      select: { id: true },
    });

    return successResponse({
      available: !existingGuild,
      slug,
    });
  } catch (error: any) {
    console.error('GET /api/v1/guilds/check-slug error:', error);
    return errorResponse('CHECK_ERROR', error.message || 'Slug kontrolü başarısız', 500);
  }
}
