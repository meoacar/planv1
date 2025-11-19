/**
 * Push Notification Test API
 * POST /api/v1/push/test - Test bildirimi gönder
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sendPushToUser } from '@/lib/push-service';

export async function POST(req: NextRequest) {
  try {
    console.log('[Push Test] Starting test notification...');
    
    const session = await auth();
    console.log('[Push Test] Session:', session?.user?.id ? 'Found' : 'Not found');
    
    if (!session?.user?.id) {
      console.log('[Push Test] Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Push Test] Sending to user:', session.user.id);
    
    const result = await sendPushToUser(session.user.id, 'custom', {
      title: '🔔 Test Bildirimi',
      body: 'Push notification sistemi çalışıyor! 🎉',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: { url: '/gunah-sayaci', test: true },
      tag: 'test-notification',
    });

    console.log('[Push Test] Result:', result);

    // Abonelik yoksa kullanıcıya bilgi ver
    if (!result.success && result.reason === 'no_subscriptions') {
      console.log('[Push Test] No subscriptions found');
      return NextResponse.json({
        success: false,
        error: 'Aktif bildirim aboneliği bulunamadı. Lütfen önce bildirimleri aktif edin.',
        reason: result.reason,
      }, { status: 400 });
    }

    if (!result.success && result.reason === 'vapid_not_configured') {
      console.log('[Push Test] VAPID not configured');
      return NextResponse.json({
        success: false,
        error: 'Push notification sistemi yapılandırılmamış.',
        reason: result.reason,
      }, { status: 500 });
    }

    console.log('[Push Test] Success!');
    return NextResponse.json({
      success: true,
      result,
      message: 'Test notification sent',
    });
  } catch (error: any) {
    console.error('[Push Test] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
