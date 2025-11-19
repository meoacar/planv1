/**
 * Service Worker - Push Notifications
 * Web Push API için service worker
 */

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(clients.claim());
});

// Push notification alındığında
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);

  if (!event.data) {
    console.log('[SW] No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('[SW] Push data:', data);
    
    const { title, body, icon, badge, data: customData, tag, requireInteraction } = data;

    const options = {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: badge || '/icons/badge-72x72.png',
      tag: tag || 'default',
      requireInteraction: requireInteraction || false,
      data: customData || {},
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Aç',
        },
        {
          action: 'close',
          title: 'Kapat',
        },
      ],
    };

    console.log('[SW] Showing notification:', title, options);

    event.waitUntil(
      self.registration.showNotification(title, options).then(() => {
        console.log('[SW] Notification shown successfully!');
      }).catch((error) => {
        console.error('[SW] Error showing notification:', error);
      })
    );
  } catch (error) {
    console.error('[SW] Error processing push:', error);
  }
});

// Notification tıklandığında
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/gunah-sayaci';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Zaten açık bir pencere varsa, onu kullan
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // Yoksa yeni pencere aç
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification kapatıldığında
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});
