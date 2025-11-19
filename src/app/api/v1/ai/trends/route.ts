/**
 * AI Trend Analysis API
 * GET /api/v1/ai/trends - 4 haftalık trend analizi
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

import { analyzeTrends, getQuickTrendSummary } from '@/lib/ai-trend-analyzer';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const quick = searchParams.get('quick') === 'true';

    if (quick) {
      // Hızlı özet
      const summary = await getQuickTrendSummary(session.user.id);
      return NextResponse.json({ summary });
    }

    // Detaylı analiz
    const analysis = await analyzeTrends(session.user.id);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Trend analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
