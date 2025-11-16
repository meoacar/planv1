# 🔔 Push Notification Sistemi - Kurulum Tamamlandı

## ✅ Kurulan Bileşenler

### 1. **VAPID Anahtarları** ✅
- `.env` dosyasına eklendi
- Public Key: `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- Private Key: `VAPID_PRIVATE_KEY`
- Subject: `VAPID_SUBJECT`

### 2. **Service Worker** ✅
- Dosya: `public/sw.js`
- Push event handler
- Notification click handler
- Background sync desteği

### 3. **PWA Manifest** ✅
- Dosya: `public/manifest.json`
- App icons: `maskot-192.png`, `maskot-512.png`
- Standalone mode

### 4. **Push Library** ✅
- Dosya: `src/lib/push.ts`
- `sendPushNotification()` - Tek kullanıcıya gönder
- `sendPushNotificationBulk()` - Toplu gönderim
- `validatePushSubscription()` - Subscription doğrulama

### 5. **API Endpoints** ✅

#### `/api/push/subscribe` (POST)
- Kullanıcı push subscription kaydı
- Otomatik upsert (güncelle veya oluştur)

#### `/api/push/unsubscribe` (POST)
- Push subscription iptal

#### `/api/admin/push/test` (POST)
- Admin test bildirimi gönderme
- Tüm aktif abonelere veya belirli kullanıcıya

### 6. **Database** ✅
- Tablo: `push_subscriptions`
- Migration: `20251116143401_add_push_subscriptions`
- Alanlar: userId, endpoint, p256dh, auth

### 7. **UI Components** ✅

#### `PushNotificationManager`
- Kullanıcı ayarlar sayfasında
- Bildirim izni isteme
- Subscribe/Unsubscribe butonları
- Otomatik durum kontrolü

#### Admin Panel
- Test bildirimi butonu
- Push notification ayarları
- Toplu gönderim desteği

### 8. **Helper Functions** ✅
- Dosya: `src/lib/notifications.ts`
- `sendNotificationToUser()` - In-app + Push
- `sendNotificationToUsers()` - Toplu bildirim

## 📦 Yüklenen Paketler

```json
{
  "dependencies": {
    "web-push": "^3.6.7"
  },
  "devDependencies": {
    "@types/web-push": "^3.6.3"
  }
}
```

## 🚀 Kullanım

### Kullanıcı Tarafı

1. **Ayarlar sayfasına git**: `/ayarlar`
2. **"Bildirimleri Aç"** butonuna tıkla
3. Tarayıcı izin iste
4. İzin ver
5. ✅ Bildirimler aktif!

### Admin Tarafı

1. **Admin paneline git**: `/admin/ayarlar`
2. **Bildirimler** sekmesi
3. **"Test Bildirimi Gönder"** butonuna tıkla
4. Tüm aktif abonelere test bildirimi gönderilir

### Kod İçinde Kullanım

```typescript
import { sendNotificationToUser } from '@/lib/notifications';

// Tek kullanıcıya bildirim
await sendNotificationToUser(userId, {
  type: 'like',
  title: 'Yeni Beğeni! 👍',
  body: 'Planın beğenildi',
  targetType: 'plan',
  targetId: planId,
});

// Toplu bildirim
import { sendNotificationToUsers } from '@/lib/notifications';

await sendNotificationToUsers([userId1, userId2], {
  type: 'comment',
  title: 'Yeni Yorum',
  body: 'Planına yorum yapıldı',
});
```

### Direkt Push Gönderimi

```typescript
import { sendPushNotification } from '@/lib/push';

const subscription = {
  endpoint: 'https://...',
  keys: {
    p256dh: '...',
    auth: '...',
  },
};

await sendPushNotification(subscription, {
  title: 'Başlık',
  body: 'Mesaj',
  icon: '/maskot/maskot-192.png',
  badge: '/maskot/maskot-192.png',
  data: { url: '/plan/123' },
});
```

## 🔧 Yapılandırma

### VAPID Anahtarları Yenileme

```bash
npx web-push generate-vapid-keys
```

Yeni anahtarları `.env` dosyasına ekle.

### Service Worker Güncelleme

Service worker'ı güncelledikten sonra:
1. Tarayıcıda `Ctrl+Shift+R` (hard refresh)
2. Veya Application > Service Workers > Unregister

## 🎯 Özellikler

- ✅ Tarayıcı push notifications
- ✅ Service worker ile offline destek
- ✅ PWA manifest
- ✅ Otomatik subscription yönetimi
- ✅ Toplu gönderim
- ✅ Admin test arayüzü
- ✅ In-app + Push entegrasyonu
- ✅ Notification click handling
- ✅ Icon ve badge desteği
- ✅ Custom data payload

## 🌐 Tarayıcı Desteği

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari 16+ (macOS & iOS)
- ✅ Opera
- ❌ IE (desteklenmiyor)

## 📝 Notlar

- Push notifications HTTPS gerektirir (localhost hariç)
- Service worker `/sw.js` root'ta olmalı
- VAPID anahtarları gizli tutulmalı
- Subscription'lar expire olabilir (410/404 hatası)
- Kullanıcı izni gereklidir

## 🐛 Sorun Giderme

### "Service Worker kayıt hatası"
- `public/sw.js` dosyasının var olduğundan emin ol
- Console'da hata mesajlarını kontrol et

### "Push gönderilmiyor"
- VAPID anahtarlarını kontrol et
- Subscription'ın geçerli olduğunu doğrula
- Network sekmesinde API çağrılarını kontrol et

### "Bildirim görünmüyor"
- Tarayıcı izinlerini kontrol et
- Service worker'ın aktif olduğunu doğrula
- `showNotification()` çağrısını kontrol et

## 🎉 Başarıyla Kuruldu!

Push notification sistemi tamamen çalışır durumda. Kullanıcılar artık tarayıcı bildirimleri alabilir!
