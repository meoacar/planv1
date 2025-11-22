/**
 * Service Worker for Push Notifications
 * Zayıflama Planı - Push Notification Handler
 */

// Service Worker versiyonu
const CACHE_VERSION = 'v1';
const CACHE_NAME = `zayiflamaplan-${CACHE_VERSION}`;

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    clients.claim().then(() => {
      console.log('[SW] Service worker activated');
    })
  );
});

// Push event - Bildirim geldiğinde
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);

  let data = {
    title: 'Zayıflama Planı',
    body: 'Yeni bir bildiriminiz var!',
    icon: '/maskot/maskot-192.png',
    badge: '/maskot/maskot-192.png',
    data: { url: '/' },
  };

  try {
    if (event.data) {
      data = event.data.json();
      console.log('[SW] Push data:', data);
    }
  } catch (error) {
    console.error('[SW] Error parsing push data:', error);
  }

  const options = {
    body: data.body,
    icon: data.icon || '/maskot/maskot-192.png',
    badge: data.badge || '/maskot/maskot-192.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
    data: data.data || {},
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

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event - Bildirime tıklandığında
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Zaten açık bir pencere var mı?
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus().then(() => {
            if ('navigate' in client) {
              return client.navigate(urlToOpen);
            }
          });
        }
      }

      // Yeni pencere aç
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed:', event);
});

// Message event - Client'tan mesaj geldiğinde
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - Offline support için (opsiyonel)
self.addEventListener('fetch', (event) => {
  // Sadece GET isteklerini cache'le
  if (event.request.method !== 'GET') {
    return;
  }

  // API isteklerini cache'leme
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

console.log('[SW] Service worker loaded');
