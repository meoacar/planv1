# 👥 Arkadaş Sistemi - Kullanım Kılavuzu

**Durum:** ✅ Tamamlandı  
**Tarih:** 18 Kasım 2025

---

## 📋 Genel Bakış

Arkadaş sistemi, kullanıcıların birbirleriyle bağlantı kurmasını, karşılaştırma yapmasını ve aktivitelerini takip etmesini sağlar.

### Özellikler

✅ **Arkadaş İstekleri** - İstek gönderme/kabul etme/reddetme  
✅ **Arkadaş Listesi** - Tüm arkadaşları görüntüleme  
✅ **Karşılaştırma** - Arkadaşla istatistik karşılaştırma  
✅ **Aktivite Feed** - Arkadaş aktivitelerini takip  
✅ **Gizlilik Ayarları** - Neyin paylaşılacağını kontrol  
✅ **Push Notification** - Arkadaş istekleri için bildirim  
✅ **Kullanıcı Arama** - İsim/username ile arama

---

## 🚀 Kurulum

### 1. Veritabanı Migration (✅ Tamamlandı)

```bash
# Migration zaten çalıştırıldı!
# Yeni ortamda kurulum için:
node scripts/apply-friend-system-migration.mjs
```

**Oluşturulan Tablolar:**
- `friend_requests` - Arkadaş istekleri
- `friendships` - Kabul edilmiş arkadaşlıklar
- `friend_activities` - Aktivite feed'i
- `friend_settings` - Gizlilik ayarları

### 2. Prisma Generate

```bash
npx prisma generate
```

---

## 📱 Özellikler

### 1. Arkadaş İstekleri

**İstek Gönderme:**
- Kullanıcı arama ile arkadaş bul
- "Ekle" butonuna tıkla
- Opsiyonel mesaj ekle
- Push notification gönderilir

**İstek Alma:**
- Gelen istekler listesi
- Kabul et / Reddet
- Otomatik kabul (karşılıklı istek varsa)

**İstek İptal:**
- Gönderilen istekleri iptal et
- Sadece pending istekler iptal edilebilir

### 2. Arkadaş Listesi

**Görüntüleme:**
- Tüm arkadaşlar
- Avatar, level, streak, rozet sayısı
- Arama özelliği

**Yönetim:**
- Arkadaşlığı sonlandır
- Karşılaştırma sayfasına git

### 3. Karşılaştırma

**Metrikler:**
- Level
- XP
- Streak
- Coins
- Haftalık günah sayısı
- Aylık günah sayısı
- Rozetler

**Gizlilik:**
- Arkadaş gizlilik ayarlarına göre
- Gizli bilgiler kilit ikonu ile gösterilir

### 4. Aktivite Feed

**Aktivite Türleri:**
- 🍪 Günah eklendi
- 🏆 Rozet kazanıldı
- 🔥 Streak milestone
- 🎯 Challenge tamamlandı
- 📈 Level atlandı

**Görüntüleme:**
- Son 20 aktivite
- Zaman damgası (kaç dakika/saat önce)
- Kullanıcı bilgileri

### 5. Gizlilik Ayarları

**Kontrol Edilebilir:**
- Arkadaş isteklerini kabul et
- Streak'i göster
- Rozetleri göster
- İstatistikleri göster
- Aktiviteleri paylaş

---

## 🔧 API Endpoints

### Arkadaş İstekleri

**GET /api/v1/friends/requests**
```typescript
// Gelen istekler
GET /api/v1/friends/requests?type=received

// Gönderilen istekler
GET /api/v1/friends/requests?type=sent

// Tüm istekler
GET /api/v1/friends/requests?type=all
```

**POST /api/v1/friends/requests**
```typescript
{
  "receiverId": "user_id",
  "message": "Arkadaş olalım mı?" // opsiyonel
}
```

**PUT /api/v1/friends/requests/[id]**
```typescript
// Kabul et
{ "action": "accept" }

// Reddet
{ "action": "reject" }
```

**DELETE /api/v1/friends/requests/[id]**
```typescript
// İsteği iptal et (sadece gönderen)
```

### Arkadaş Listesi

**GET /api/v1/friends**
```typescript
// Tüm arkadaşlar
GET /api/v1/friends

// Arama ile
GET /api/v1/friends?search=john
```

**DELETE /api/v1/friends**
```typescript
// Arkadaşlığı sonlandır
DELETE /api/v1/friends?friendId=user_id
```

### Karşılaştırma

**GET /api/v1/friends/compare**
```typescript
GET /api/v1/friends/compare?friendId=user_id
```

### Aktivite Feed

**GET /api/v1/friends/activity**
```typescript
// Son 20 aktivite
GET /api/v1/friends/activity

// Limit ile
GET /api/v1/friends/activity?limit=50
```

### Gizlilik Ayarları

**GET /api/v1/friends/settings**
```typescript
// Kullanıcının ayarlarını getir
```

**PUT /api/v1/friends/settings**
```typescript
{
  "allowFriendRequests": true,
  "showStreak": true,
  "showBadges": true,
  "showStats": true,
  "showActivity": true
}
```

### Kullanıcı Arama

**GET /api/v1/users/search**
```typescript
GET /api/v1/users/search?q=john
```

---

## 🎨 Frontend Bileşenleri

### 1. FriendList
```typescript
import { FriendList } from '@/components/friends/friend-list';

<FriendList />
```

### 2. FriendRequests
```typescript
import { FriendRequests } from '@/components/friends/friend-requests';

<FriendRequests />
```

### 3. FriendCompare
```typescript
import { FriendCompare } from '@/components/friends/friend-compare';

<FriendCompare friendId="user_id" />
```

### 4. FriendActivityFeed
```typescript
import { FriendActivityFeed } from '@/components/friends/friend-activity-feed';

<FriendActivityFeed />
```

### 5. FriendSearch
```typescript
import { FriendSearch } from '@/components/friends/friend-search';

<FriendSearch />
```

---

## 🔄 Aktivite Kaydetme

### Otomatik Kayıt

Aktiviteler otomatik olarak kaydedilir:

```typescript
import {
  logSinAdded,
  logBadgeEarned,
  logStreakMilestone,
  logChallengeCompleted,
  logLevelUp,
} from '@/lib/friend-activity-logger';

// Günah eklendiğinde
await logSinAdded(userId, 'tatli', 'Çikolata yedim');

// Rozet kazanıldığında
await logBadgeEarned(userId, 'Glukozsuz Kahraman', '🥇');

// Streak milestone
await logStreakMilestone(userId, 7); // Sadece önemli milestone'lar

// Challenge tamamlandığında
await logChallengeCompleted(userId, '7 Gün Challenge', { xp: 100, coins: 50 });

// Level atlandığında
await logLevelUp(userId, 5);
```

### Manuel Kayıt

```typescript
import { logFriendActivity } from '@/lib/friend-activity-logger';

await logFriendActivity(
  userId,
  'custom_activity',
  { customData: 'value' },
  true // isPublic
);
```

---

## 🔒 Gizlilik

### Varsayılan Ayarlar

Yeni kullanıcılar için:
```typescript
{
  allowFriendRequests: true,
  showStreak: true,
  showBadges: true,
  showStats: true,
  showActivity: true
}
```

### Gizlilik Kontrolü

API'ler otomatik olarak gizlilik ayarlarını kontrol eder:
- Karşılaştırma: Gizli bilgiler null döner
- Aktivite: showActivity=false ise kayıt yapılmaz
- İstek: allowFriendRequests=false ise hata döner

---

## 📊 Veritabanı Şeması

### FriendRequest
```prisma
model FriendRequest {
  id          String              @id @default(cuid())
  senderId    String
  receiverId  String
  status      FriendRequestStatus @default(pending)
  message     String?             @db.Text
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
  respondedAt DateTime?
  sender      User                @relation(...)
  receiver    User                @relation(...)
}

enum FriendRequestStatus {
  pending
  accepted
  rejected
  cancelled
}
```

### Friendship
```prisma
model Friendship {
  id        String   @id @default(cuid())
  userId    String
  friendId  String
  createdAt DateTime @default(now())
  user      User     @relation(...)
  friend    User     @relation(...)
}
```

### FriendActivity
```prisma
model FriendActivity {
  id           String               @id @default(cuid())
  userId       String
  activityType FriendActivityType
  activityData String?              @db.Text
  isPublic     Boolean              @default(true)
  createdAt    DateTime             @default(now())
  user         User                 @relation(...)
}

enum FriendActivityType {
  sin_added
  badge_earned
  streak_milestone
  challenge_completed
  level_up
}
```

### FriendSettings
```prisma
model FriendSettings {
  id                  String   @id @default(cuid())
  userId              String   @unique
  allowFriendRequests Boolean  @default(true)
  showStreak          Boolean  @default(true)
  showBadges          Boolean  @default(true)
  showStats           Boolean  @default(true)
  showActivity        Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  user                User     @relation(...)
}
```

---

## 🧪 Test Senaryoları

### 1. Arkadaş Ekleme
```typescript
// 1. Kullanıcı ara
const users = await fetch('/api/v1/users/search?q=john');

// 2. İstek gönder
await fetch('/api/v1/friends/requests', {
  method: 'POST',
  body: JSON.stringify({ receiverId: 'user_id' })
});

// 3. Karşı taraf kabul etsin
await fetch('/api/v1/friends/requests/request_id', {
  method: 'PUT',
  body: JSON.stringify({ action: 'accept' })
});

// 4. Arkadaş listesinde görünmeli
```

### 2. Karşılaştırma
```typescript
// 1. Arkadaş listesinden seç
// 2. "Karşılaştır" butonuna tıkla
// 3. İstatistikler görünmeli
// 4. Gizlilik ayarlarına göre bazıları gizli olabilir
```

### 3. Aktivite Feed
```typescript
// 1. Arkadaş bir rozet kazansın
// 2. Aktivite feed'de görünmeli
// 3. "X rozet kazandı" mesajı
// 4. Zaman damgası doğru olmalı
```

---

## 🐛 Sorun Giderme

### Arkadaş İsteği Gönderilemiyor

**1. Gizlilik Ayarları**
```typescript
// Karşı tarafın ayarlarını kontrol et
const settings = await prisma.friendSettings.findUnique({
  where: { userId: receiverId }
});

if (!settings.allowFriendRequests) {
  // İstek gönderilemez
}
```

**2. Zaten Arkadaş**
```typescript
// Arkadaşlık kontrolü
const friendship = await prisma.friendship.findFirst({
  where: {
    OR: [
      { userId: senderId, friendId: receiverId },
      { userId: receiverId, friendId: senderId }
    ]
  }
});
```

### Aktiviteler Görünmüyor

**1. Gizlilik Kontrolü**
```typescript
const settings = await prisma.friendSettings.findUnique({
  where: { userId }
});

if (!settings.showActivity) {
  // Aktiviteler kaydedilmez
}
```

**2. Arkadaş Kontrolü**
```typescript
// Sadece arkadaşların aktiviteleri görünür
const friendIds = await prisma.friendship.findMany({
  where: { userId: currentUserId },
  select: { friendId: true }
});
```

---

## 📈 İstatistikler

### Arkadaş Sayısı
```typescript
const friendCount = await prisma.friendship.count({
  where: { userId }
});
```

### Bekleyen İstekler
```typescript
const pendingCount = await prisma.friendRequest.count({
  where: {
    receiverId: userId,
    status: 'pending'
  }
});
```

### Aktivite Sayısı
```typescript
const activityCount = await prisma.friendActivity.count({
  where: {
    userId,
    isPublic: true
  }
});
```

---

## 🎯 Gelecek Geliştirmeler

### Öncelik 1: Grup Aktiviteleri
- [ ] Arkadaş grupları oluşturma
- [ ] Grup challenge'ları
- [ ] Grup liderlik tablosu

### Öncelik 2: Sosyal Özellikler
- [ ] Arkadaş önerileri (AI bazlı)
- [ ] Ortak arkadaşlar
- [ ] Arkadaş aktivite bildirimleri

### Öncelik 3: Gamification
- [ ] Arkadaş challenge'ları
- [ ] Takım yarışmaları
- [ ] Sosyal rozetler

---

## ✅ Checklist

### Backend
- [x] Veritabanı migration
- [x] Friend request API
- [x] Friendship API
- [x] Compare API
- [x] Activity feed API
- [x] Settings API
- [x] User search API
- [x] Activity logger

### Frontend
- [x] Friend list component
- [x] Friend requests component
- [x] Friend compare component
- [x] Activity feed component
- [x] Friend search component

### Entegrasyon
- [x] Badge checker entegrasyonu
- [x] Push notification entegrasyonu
- [x] Gizlilik kontrolleri

### Dokümantasyon
- [x] Kullanım kılavuzu
- [x] API dokümantasyonu
- [x] Test senaryoları

---

**Hazırlayan:** Kiro AI  
**Tarih:** 18 Kasım 2025  
**Durum:** ✅ Production Ready
