import { NextResponse } from 'next/server';
import { getServerSession, authOptions } from '@/lib/auth';
import { checkAndAwardAllBadges } from '@/lib/badge-checker';

/**
 * Kullanıcının rozetlerini kontrol eder
 * Bu endpoint günlük olarak çağrılmalı veya kullanıcı profil sayfasını açtığında
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const awarded = await checkAndAwardAllBadges(session.user.id);

    return NextResponse.json({
      success: true,
      badgesAwarded: awarded.length,
      badges: awarded,
    });
  } catch (error) {
    console.error('Badge check error:', error);
    return NextResponse.json(
      { error: 'Failed to check badges' },
      { status: 500 }
    );
  }
}
