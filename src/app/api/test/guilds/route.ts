import { NextRequest } from 'next/server';
import { db as prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const guilds = await prisma.guild.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        publishedAt: true,
        isPublic: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({ guilds });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
