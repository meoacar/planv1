# 🔥 Yemek Günah Sayacı - Streak Sistemi

**Durum:** ⚠️ Rozet seed'i bekleniyor  
**Tarih:** 18 Kasım 2025  
**Versiyon:** 1.0.0

---

## 📋 Genel Bakış

Streak sistemi, kullanıcıların ardışık temiz günlerini (günah yapmadıkları günler) takip eder ve ödüllendirir. Bu sistem motivasyonu artırır ve kullanıcıları düzenli olmaya teşvik eder.

---

## 🎯 Özellikler

### 1. Streak Hesaplama

#### Mevcut Streak (Current Streak)
- Bugünden geriye doğru ardışık temiz günler
- Günah yapıldığında sıfırlanır
- Otomatik hesaplanır

#### En Uzun Streak (Longest Streak)
- Kullanıcının tüm zamanlar boyunca en uzun temiz gün serisi
- Son 365 gün içinde hesaplanır
- Referans olarak saklanır

#### Streak Seviyeleri
- 🌱 Yeni (0-6 gün)
- 🔥 Başlangıç (7-29 gün)
- 🌟 Orta (30-89 gün)
- 💎 İleri (90-179 gün)
- ⭐ Usta (180-364 gün)
- 👑 Efsane (365+ gün)

### 2. Streak Koruma Araçları

#### ❄️ Streak Freeze
- Bir günlük hata yapsan bile streak'in korunur
- Kullanıcılar sınırlı sayıda freeze'e sahip
- Mağazadan satın alınabilir (gelecek özellik)
- `User.streakFreezeCount` field'ında saklanır

#### 🔄 Streak Recovery
- Kırılan streak'i coin karşılığında geri al
- Maliyet: `streakToRecover * 10` coin (max 500)
- Sadece en uzun streak geri alınabilir
- `StreakRecovery` tablosunda kayıt tutulur

### 3. Streak Milestone Rozetleri

8 farklı milestone rozeti:

| Gün | Rozet | XP | Coin |
|-----|-------|-----|------|
| 3 | 🔥 3 Gün Ateşi | 50 | 10 |
| 7 | 🔥 1 Hafta Şampiyonu | 100 | 25 |
| 14 | 🔥 2 Hafta Efsanesi | 200 | 50 |
| 30 | 🔥 1 Ay Ustası | 500 | 100 |
| 60 | 🔥 2 Ay Titanı | 1000 | 200 |
| 90 | 🔥 3 Ay Tanrısı | 2000 | 500 |
| 180 | 🔥 6 Ay Efsanesi | 5000 | 1000 |
| 365 | 👑 1 Yıl Kralı | 10000 | 2500 |

---

## 🔌 API Endpoint'leri

### GET /api/v1/food-sins/streak

Kullanıcının streak verilerini getirir.

**Response:**
```typescript
{
  currentStreak: number;
  longestStreak: number;
  lastCleanDate: Date | null;
  streakBroken: boolean;
}
```

**Örnek:**
```json
{
  "currentStreak": 7,
  "longestStreak": 14,
  "lastCleanDate": "2025-11-18T00:00:00.000Z",
  "streakBroken": false
}
```

---

### POST /api/v1/food-sins/streak

Kullanıcının streak'ini manuel olarak günceller.

**Response:**
```typescript
{
  success: boolean;
  currentStreak: number;
  message: string;
}
```

---

### POST /api/v1/food-sins/streak/freeze

Streak freeze kullanır.

**Response:**
```typescript
{
  success: boolean;
  message: string;
  remainingFreezes: number;
}
```

**Hata Durumları:**
- 400: Streak freeze yok
- 401: Unauthorized

---

### POST /api/v1/food-sins/streak/recover

Kırılan streak'i coin karşılığında geri alır.

**Request Body:**
```typescript
{
  streakToRecover: number;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  streakRecovered: number;
  coinsCost: number;
  remainingCoins: number;
}
```

**Hata Durumları:**
- 400: Yetersiz coin
- 400: Geçersiz streak değeri
- 401: Unauthorized

---

## 🎨 Frontend Bileşeni

### SinStreak Component

**Konum:** `src/components/food-sins/sin-streak.tsx`

**Özellikler:**
- Mevcut streak gösterimi (büyük sayı + emoji)
- Streak seviyesi badge'i
- Sonraki milestone'a ilerleme barı
- En uzun streak istatistiği
- Son temiz gün tarihi
- Streak freeze kullanma butonu
- Streak recovery butonu
- 8 milestone rozeti gösterimi

**Kullanım:**
```tsx
import SinStreak from '@/components/food-sins/sin-streak';

<SinStreak />
```

---

## 📊 Hesaplama Mantığı

### Streak Hesaplama Algoritması

```typescript
// 1. Tüm günah tarihlerini al
const sins = await prisma.foodSin.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
});

// 2. Günah yapılan günleri set'e ekle (YYYY-MM-DD)
const sinDates = new Set(
  sins.map(sin => formatDate(sin.createdAt))
);

// 3. Bugünden geriye doğru temiz günleri say
let currentStreak = 0;
let checkDate = today;

while (!sinDates.has(formatDate(checkDate))) {
  currentStreak++;
  checkDate = previousDay(checkDate);
  
  if (currentStreak >= 365) break; // Max 365 gün
}

// 4. En uzun streak'i bul (son 365 gün)
let longestStreak = 0;
let tempStreak = 0;

for (let d = oneYearAgo; d <= today; d = nextDay(d)) {
  if (!sinDates.has(formatDate(d))) {
    tempStreak++;
    longestStreak = Math.max(longestStreak, tempStreak);
  } else {
    tempStreak = 0;
  }
}
```

### Otomatik Güncelleme

Streak her günah eklendiğinde otomatik güncellenir:

```typescript
// src/app/api/v1/food-sins/route.ts (POST)
const currentStreak = await updateUserStreak(session.user.id);

// Milestone kontrolü
await checkStreakMilestones(session.user.id, currentStreak);
```

---

## 💾 Veritabanı

### Mevcut Field'lar (User Tablosu)

```prisma
model User {
  streak            Int @default(0)
  streakFreezeCount Int @default(0)
  // ... diğer field'lar
}
```

### Streak Recovery Tablosu

```prisma
model StreakRecovery {
  id          String   @id @default(cuid())
  userId      String
  streakLost  Int
  coinsCost   Int
  recoveredAt DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}
```

### Streak Rozetleri (SinBadge Tablosu)

⚠️ **Henüz seed edilmedi!** Aşağıdaki script çalıştırılmalı:

```bash
node scripts/seed-streak-badges.mjs
```

Bu script 8 streak rozeti ekleyecek:
- `streak_3` - 3 Gün Ateşi
- `streak_7` - 1 Hafta Şampiyonu
- `streak_14` - 2 Hafta Efsanesi
- `streak_30` - 1 Ay Ustası
- `streak_60` - 2 Ay Titanı
- `streak_90` - 3 Ay Tanrısı
- `streak_180` - 6 Ay Efsanesi
- `streak_365` - 1 Yıl Kralı

---

## 🎮 Kullanıcı Deneyimi

### Akış

1. Kullanıcı "🔥 Streak" tabına tıklar
2. Mevcut streak ve seviye gösterilir
3. Sonraki milestone'a ilerleme görülür
4. Streak koruma araçları kullanılabilir
5. Milestone rozetleri görüntülenir

### Motivasyon Faktörleri

- 🔥 Görsel streak gösterimi (büyük sayı + emoji)
- 📈 İlerleme barı (sonraki milestone)
- 🏆 Milestone rozetleri (8 adet)
- 💰 XP ve coin ödülleri
- 🎯 Seviye sistemi (6 seviye)
- ❄️ Streak koruma araçları

---

## 🔒 Güvenlik

### Kimlik Doğrulama
- Tüm endpoint'ler NextAuth session kontrolü yapar
- Sadece kendi streak'ini görebilir/güncelleyebilir

### Veri Bütünlüğü
- Streak hesaplama tamamen sunucu tarafında
- Client-side manipülasyon mümkün değil
- Tüm işlemler transaction içinde

### Rate Limiting
- Streak freeze: Kullanıcı başına sınırlı
- Streak recovery: Coin kontrolü
- API istekleri sınırlandırılmalı (gelecek)

---

## 📈 Performans

### Optimizasyon
- Streak hesaplama cache'lenebilir (Redis)
- Son 365 gün ile sınırlı
- Index'ler: `userId`, `createdAt`

### Veritabanı Query'leri
```sql
-- Günah tarihlerini al
SELECT createdAt FROM food_sins 
WHERE userId = ? 
ORDER BY createdAt DESC;

-- Streak güncelle
UPDATE users 
SET streak = ? 
WHERE id = ?;
```

---

## 🚀 Gelecek Geliştirmeler

### Öncelik 1
- [ ] Streak freeze satın alma (mağaza)
- [ ] Günlük streak hatırlatıcısı (push notification)
- [ ] Streak kırılma bildirimi

### Öncelik 2
- [ ] Haftalık streak raporu
- [ ] Arkadaş streak karşılaştırması
- [ ] Streak liderlik tablosu

### Öncelik 3
- [ ] Streak freeze otomatik kullanım
- [ ] Streak milestone kutlaması (animasyon)
- [ ] Özel streak rozetleri (100, 200, 500 gün)

---

## 🧪 Test Senaryoları

### Backend Test
```bash
# Streak verilerini al
curl -X GET "http://localhost:3000/api/v1/food-sins/streak" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Streak freeze kullan
curl -X POST "http://localhost:3000/api/v1/food-sins/streak/freeze" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Streak geri al
curl -X POST "http://localhost:3000/api/v1/food-sins/streak/recover" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"streakToRecover": 7}'
```

### Frontend Test
1. Streak sayfasını aç
2. Mevcut streak'i kontrol et
3. Günah ekle ve streak'in sıfırlandığını gör
4. Streak freeze kullan
5. Streak recovery dene
6. Milestone rozetlerini kontrol et

---

## 📝 Notlar

- ⚠️ Streak rozetleri henüz seed edilmedi
- Streak hesaplama her günah eklendiğinde otomatik yapılır
- Streak freeze sayısı User tablosunda saklanır
- Recovery işlemleri StreakRecovery tablosunda loglanır
- Maksimum streak: 365 gün (performans için)

---

## 🔗 İlgili Dosyalar

```
src/
├── lib/
│   └── streak-calculator.ts (✅ Hesaplama mantığı)
├── app/
│   └── api/
│       └── v1/
│           └── food-sins/
│               ├── route.ts (✅ Güncellenmiş - streak update)
│               └── streak/
│                   ├── route.ts (✅ GET, POST)
│                   ├── freeze/
│                   │   └── route.ts (✅ POST)
│                   └── recover/
│                       └── route.ts (✅ POST)
└── components/
    └── food-sins/
        └── sin-streak.tsx (✅ Frontend bileşeni)

scripts/
└── seed-streak-badges.mjs (⚠️ Çalıştırılmadı)
```

---

## 📚 İlgili Dökümanlar

- `GUNAH_ILERLEME.md` - Genel proje durumu
- `günah.md` - Orijinal konsept
- `GUNAH_SAYACI_LIDERLIK_TABLOSU.md` - Liderlik tablosu
- `DATABASE_MIGRATION_RULES.md` - Migration kuralları

---

## ⚠️ SONRAKI ADIM

**Streak rozetlerini eklemek için:**

```bash
node scripts/seed-streak-badges.mjs
```

Bu script çalıştırıldıktan sonra sistem tamamen çalışır hale gelecek!

---

**Hazırlayan:** Kiro AI  
**Tarih:** 18 Kasım 2025  
**Durum:** ⚠️ Rozet seed'i bekleniyor

