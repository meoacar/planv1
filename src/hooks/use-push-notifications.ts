/**
 * Push Notifications Hook
 * Web Push API ile bildirim yönetimi
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  permission: NotificationPermission;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  requestPermission: () => Promise<NotificationPermission>;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Browser desteğini kontrol et
    const supported =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setIsSupported(supported);

    if (supported) {
      setPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Check subscription error:', error);
    }
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      toast.error('Tarayıcınız bildirimleri desteklemiyor');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Permission request error:', error);
      toast.error('İzin alınamadı');
      return 'denied';
    }
  };

  const subscribe = async () => {
    if (!isSupported) {
      toast.error('Tarayıcınız bildirimleri desteklemiyor');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[Push] Starting subscription...');
      console.log('[Push] Current permission:', permission);
      
      // İzin kontrolü
      let perm = permission;
      if (perm === 'default') {
        console.log('[Push] Requesting permission...');
        perm = await requestPermission();
        console.log('[Push] Permission result:', perm);
      }

      if (perm !== 'granted') {
        console.log('[Push] Permission denied');
        toast.error('Bildirim izni verilmedi');
        return;
      }

      // Service worker kaydet
      console.log('[Push] Registering service worker...');
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[Push] Service worker registered');
      await navigator.serviceWorker.ready;
      console.log('[Push] Service worker ready');

      // Push subscription oluştur
      console.log('[Push] Creating push subscription...');
      console.log('[Push] VAPID key:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.substring(0, 20) + '...');
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });
      
      console.log('[Push] Subscription created:', subscription.endpoint);

      // Backend'e gönder
      console.log('[Push] Sending to backend...');
      const response = await fetch('/api/v1/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
            auth: arrayBufferToBase64(subscription.getKey('auth')!),
          },
          userAgent: navigator.userAgent,
        }),
      });

      console.log('[Push] Backend response:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Push] Backend error:', errorData);
        throw new Error('Subscription failed: ' + (errorData.error || response.statusText));
      }

      setIsSubscribed(true);
      console.log('[Push] Subscription complete!');
      toast.success('Bildirimler aktif edildi! 🔔');
    } catch (error: any) {
      console.error('[Push] Subscribe error:', error);
      toast.error('Bildirim aboneliği başarısız: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!isSupported) return;

    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Backend'den sil
        await fetch(
          `/api/v1/push/subscribe?endpoint=${encodeURIComponent(subscription.endpoint)}`,
          { method: 'DELETE' }
        );

        // Browser'dan sil
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      toast.success('Bildirimler kapatıldı');
    } catch (error) {
      console.error('Unsubscribe error:', error);
      toast.error('Abonelik iptal edilemedi');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
    requestPermission,
  };
}

// Helper functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
