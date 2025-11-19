# 🔔 Push Notification Sistemi - Kullanım Kılavuzu

**Durum:** ✅ Tamamlandı  
**Tarih:** 18 Kasım 2025

---

## 📋 Genel Bakış

Push notification sistemi, kullanıcılara gerçek zamanlı bildirimler göndermek için Web Push API kullanır. Sistem tamamen kuruldu ve kullanıma hazır!

### Özellikler

✅ **Web Push API** - Modern tarayıcı desteği  
✅ **VAPID Keys** - Güvenli bildirim gönderimi  
✅ **Service Worker** - Offline bildirim desteği  
✅ **Kullanıcı Tercihleri** - Bildirim ayarları  
✅ **Otomatik Cron Jobs** - Zamanlanmış bildirimler  
✅ **6 Bildirim Türü** - Farklı senaryolar için

---

## 🚀 Kurulum

### 1. Veritabanı Migration (✅ Tamamlandı)

```bash
# Migration zaten çalıştırıldı, tekrar çalıştırmaya gerek yok!
# Ama yeni bir ortamda kurulum için:
node scripts/apply-push-notification-migration.mjs
```

**Oluşturulan Tablolar:**
- `push_subscriptions` - Kullanıcı abonelikleri
- `push_notifications` - Bildirim geçmişi
- `notification_settings` - Kullanıcı tercihleri

### 2. VAPID Keys (✅ Mevcut)

VAPID keys zaten `.env` dosyasında mevcut:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BO7e_gsvY0lZS5-vT7u42Xq7QoWh9duilgThgp3cKHCZj3LltCayQsiXpiDwPtzUCaToaweI6e44YOYb3zkpUcQ
VAPID_PRIVATE_KEY=YcyUxWNgzUFq-93xCwBum4G3k_wHqT5NBELQy0Ouejc
VAPID_SUBJECT=mailto:admin@zayiflamaplan.com
```

**Yeni keys oluşturmak için:**
```bash
npm run push:generate-keys
```

### 3. Prisma Generate

```bash
# Prisma client'ı yeniden oluştur
npx prisma generate
```

---

## 📱 Bildirim Türleri

### 1. Günlük Hatırlatıcı (Daily Reminder)
- **Ne zaman:** Kullanıcının belirlediği saat
- **Amaç:** Günlük günah kaydı hatırlatması
- **Cron:** Her saat başı çalışır, kullanıcı saatlerini kontrol eder
- **Endpoint:** `/api/cron/daily-reminders`

```typescript
await sendDailyReminder(userId);
```

### 2. Haftalık Özet (Weekly Summary)
- **Ne zaman:** Her Pazar 23:00
- **Amaç:** Haftalık performans özeti
- **Cron:** Pazar 23:00
- **Endpoint:** `/api/cron/weekly-sin-summary`

```typescript
await sendWeeklySummary(userId);
```

### 3. Rozet Kazanma (Badge Earned)
- **Ne zaman:** Rozet kazanıldığında (otomatik)
- **Amaç:** Başarı kutlaması
- **Tetikleyici:** `badge-checker.ts`

```typescript
await sendBadgeEarned(userId, badgeName, badgeIcon);
```

### 4. Streak Uyarısı (Streak Warning)
- **Ne zaman:** Her gün 21:00
- **Amaç:** Streak kaybetme uyarısı
- **Cron:** Günlük 21:00
- **Endpoint:** `/api/cron/streak-warnings`

```typescript
await sendStreakWarning(userId, currentStreak);
```

### 5. Challenge Hatırlatıcısı (Challenge Reminder)
- **Ne zaman:** Challenge başladığında/devam ederken
- **Amaç:** Challenge takibi

```typescript
await sendChallengeReminder(userId, challengeTitle);
```

### 6. Özel Bildirim (Custom)
- **Ne zaman:** Manuel olarak
- **Amaç:** Test veya özel durumlar

```typescript
await sendPushToUser(userId, 'custom', {
  title: 'Başlık',
  body: 'Mesaj',
  icon: '/icons/icon-192x192.png',
  data: { url: '/gunah-sayaci' }
});
```

---

## 🔧 API Endpoints

### 1. Abonelik Yönetimi

**POST /api/v1/push/subscribe**
```typescript
// Yeni abonelik oluştur
const response = await fetch('/api/v1/push/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    endpoint: subscription.endpoint,
    keys: {
      p256dh: 'key...',
      auth: 'key...'
    },
    userAgent: navigator.userAgent
  })
});
```

**DELETE /api/v1/push/subscribe**
```typescript
// Aboneliği iptal et
await fetch(`/api/v1/push/subscribe?endpoint=${endpoint}`, {
  method: 'DELETE'
});
```

### 2. Ayarlar

**GET /api/v1/push/settings**
```typescript
// Kullanıcı ayarlarını getir
const response = await fetch('/api/v1/push/settings');
const { settings } = await response.json();
```

**PUT /api/v1/push/settings**
```typescript
// Ayarları güncelle
await fetch('/api/v1/push/settings', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dailyReminder: true,
    dailyReminderTime: '20:00',
    weeklySummary: true,
    badgeEarned: true,
    challengeReminder: true,
    streakWarning: true,
    friendActivity: false
  })
});
```

### 3. Test

**POST /api/v1/push/test**
```typescript
// Test bildirimi gönder
await fetch('/api/v1/push/test', { method: 'POST' });
```

---

## 🎨 Frontend Kullanımı

### 1. React Hook

```typescript
import { usePushNotifications } from '@/hooks/use-push-notifications';

function MyComponent() {
  const {
    isSupported,      // Tarayıcı desteği
    isSubscribed,     // Abonelik durumu
    isLoading,        // Yükleniyor
    permission,       // İzin durumu
    subscribe,        // Abone ol
    unsubscribe,      // Aboneliği iptal et
    requestPermission // İzin iste
  } = usePushNotifications();

  return (
    <button onClick={subscribe} disabled={!isSupported || isLoading}>
      {isSubscribed ? 'Bildirimleri Kapat' : 'Bildirimleri Aç'}
    </button>
  );
}
```

### 2. Ayarlar Komponenti

```typescript
import { NotificationSettingsComponent } from '@/components/push/notification-settings';

function SettingsPage() {
  return <NotificationSettingsComponent />;
}
```

---

## ⏰ Cron Jobs

### Vercel Cron Yapılandırması

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-sin-summary",
      "schedule": "0 23 * * 0"
    },
    {
      "path": "/api/cron/daily-reminders",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/streak-warnings",
      "schedule": "0 21 * * *"
    }
  ]
}
```

### Cron Schedule Açıklaması

- `0 * * * *` - Her saat başı (günlük hatırlatıcılar)
- `0 21 * * *` - Her gün 21:00 (streak uyarıları)
- `0 23 * * 0` - Her Pazar 23:00 (haftalık özet)

### Manuel Test

```bash
# Günlük hatırlatıcılar
curl -X GET http://localhost:3000/api/cron/daily-reminders \
  -H "Authorization: Bearer your-cron-secret"

# Streak uyarıları
curl -X GET http://localhost:3000/api/cron/streak-warnings \
  -H "Authorization: Bearer your-cron-secret"
```

---

## 🔒 Güvenlik

### 1. VAPID Keys
- Public key: Frontend'de kullanılır (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`)
- Private key: Backend'de kullanılır (`VAPID_PRIVATE_KEY`)
- **ÖNEMLİ:** Production'da farklı keys kullanın!

### 2. Cron Secret
- Tüm cron endpoint'leri `CRON_SECRET` ile korunur
- `.env` dosyasında tanımlı olmalı
- Vercel'de environment variable olarak ekleyin

### 3. User Authentication
- Tüm API endpoint'leri NextAuth ile korunur
- Sadece giriş yapmış kullanıcılar erişebilir

---

## 📊 Veritabanı Şeması

### PushSubscription
```prisma
model PushSubscription {
  id         String   @id @default(cuid())
  userId     String
  endpoint   String   @db.Text
  p256dh     String   @db.Text
  auth       String   @db.Text
  userAgent  String?  @db.Text
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(...)
}
```

### PushNotification
```prisma
model PushNotification {
  id           String               @id @default(cuid())
  userId       String
  type         PushNotificationType
  title        String
  body         String               @db.Text
  icon         String?
  badge        String?
  data         String?              @db.Text
  status       PushNotificationStatus
  sentAt       DateTime?
  clickedAt    DateTime?
  errorMessage String?              @db.Text
  createdAt    DateTime             @default(now())
  user         User                 @relation(...)
}
```

### NotificationSettings
```prisma
model NotificationSettings {
  id                 String   @id @default(cuid())
  userId             String   @unique
  dailyReminder      Boolean  @default(true)
  dailyReminderTime  String   @default("20:00")
  weeklySummary      Boolean  @default(true)
  badgeEarned        Boolean  @default(true)
  challengeReminder  Boolean  @default(true)
  streakWarning      Boolean  @default(true)
  friendActivity     Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  user               User     @relation(...)
}
```

---

## 🧪 Test Senaryoları

### 1. Temel Test
```typescript
// 1. Bildirimleri aktif et
await subscribe();

// 2. Test bildirimi gönder
await fetch('/api/v1/push/test', { method: 'POST' });

// 3. Bildirim geldi mi kontrol et
```

### 2. Ayarlar Testi
```typescript
// 1. Ayarları getir
const settings = await fetch('/api/v1/push/settings').then(r => r.json());

// 2. Günlük hatırlatıcıyı kapat
await fetch('/api/v1/push/settings', {
  method: 'PUT',
  body: JSON.stringify({ ...settings, dailyReminder: false })
});

// 3. Hatırlatıcı gelmemeli
```

### 3. Rozet Bildirimi Testi
```typescript
// 1. Rozet kazan (örnek: 7 gün tatlı yeme)
// 2. Otomatik bildirim gelmeli
// 3. Bildirime tıkla
// 4. Rozet sayfasına yönlendirilmeli
```

---

## 🐛 Sorun Giderme

### Bildirimler Gelmiyor

**1. Tarayıcı Desteği**
```typescript
if (!('serviceWorker' in navigator)) {
  console.error('Service Worker desteklenmiyor');
}
if (!('PushManager' in window)) {
  console.error('Push API desteklenmiyor');
}
```

**2. İzin Durumu**
```typescript
console.log('Permission:', Notification.permission);
// "granted" olmalı
```

**3. Service Worker**
```typescript
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW registered:', !!reg);
});
```

**4. Abonelik**
```typescript
const reg = await navigator.serviceWorker.ready;
const sub = await reg.pushManager.getSubscription();
console.log('Subscription:', !!sub);
```

### Cron Jobs Çalışmıyor

**1. Vercel Logs**
- Vercel dashboard'da logs kontrol edin
- Cron execution history'ye bakın

**2. Manuel Test**
```bash
curl -X GET https://your-domain.com/api/cron/daily-reminders \
  -H "Authorization: Bearer your-cron-secret"
```

**3. Environment Variables**
- `CRON_SECRET` tanımlı mı?
- VAPID keys doğru mu?

---

## 📈 İstatistikler ve Monitoring

### Bildirim İstatistikleri

```typescript
// Gönderilen bildirimler
const notifications = await prisma.pushNotification.findMany({
  where: {
    status: 'sent',
    createdAt: { gte: startDate }
  }
});

// Tıklanan bildirimler
const clicked = await prisma.pushNotification.count({
  where: {
    status: 'clicked',
    createdAt: { gte: startDate }
  }
});

// Tıklama oranı
const clickRate = (clicked / notifications.length) * 100;
```

### Aktif Abonelikler

```typescript
const activeSubscriptions = await prisma.pushSubscription.count({
  where: { isActive: true }
});

const totalUsers = await prisma.user.count();
const subscriptionRate = (activeSubscriptions / totalUsers) * 100;
```

---

## 🎯 Gelecek Geliştirmeler

### Öncelik 1: A/B Testing
- [ ] Farklı bildirim metinleri test et
- [ ] En iyi gönderim saatlerini bul
- [ ] Tıklama oranlarını optimize et

### Öncelik 2: Zengin Bildirimler
- [ ] Resim desteği
- [ ] Action buttons (Evet/Hayır)
- [ ] Inline reply

### Öncelik 3: Segmentasyon
- [ ] Kullanıcı gruplarına özel bildirimler
- [ ] Davranış bazlı bildirimler
- [ ] Coğrafi konum bazlı

### Öncelik 4: Analytics
- [ ] Bildirim dashboard'u
- [ ] Detaylı istatistikler
- [ ] Kullanıcı engagement metrikleri

---

## 📚 Kaynaklar

- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [VAPID Protocol](https://datatracker.ietf.org/doc/html/rfc8292)
- [web-push Library](https://github.com/web-push-libs/web-push)

---

## ✅ Checklist

### Kurulum
- [x] Veritabanı migration
- [x] VAPID keys oluşturma
- [x] Prisma schema güncelleme
- [x] Service worker oluşturma

### Backend
- [x] Push service (`push-service.ts`)
- [x] Subscribe API
- [x] Settings API
- [x] Test API
- [x] Cron jobs (3 adet)

### Frontend
- [x] React hook (`use-push-notifications.ts`)
- [x] Settings component
- [x] Service worker (`sw.js`)

### Entegrasyon
- [x] Badge checker entegrasyonu
- [x] Vercel cron yapılandırması
- [x] Package.json scripts

### Dokümantasyon
- [x] Kullanım kılavuzu
- [x] API dokümantasyonu
- [x] Sorun giderme rehberi

---

**Hazırlayan:** Kiro AI  
**Tarih:** 18 Kasım 2025  
**Durum:** ✅ Production Ready
