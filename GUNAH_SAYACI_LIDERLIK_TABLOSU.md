# 🏆 Yemek Günah Sayacı - Liderlik Tablosu Sistemi

**Durum:** ✅ Tamamlandı  
**Tarih:** 18 Kasım 2025  
**Versiyon:** 1.0.0

---

## 📋 Genel Bakış

Liderlik Tablosu sistemi, kullanıcılar arasında sağlıklı rekabet yaratarak motivasyonu artıran bir gamification özelliğidir. Kullanıcılar farklı metriklerde birbirleriyle yarışabilir ve başarılarını karşılaştırabilir.

---

## 🎯 Özellikler

### 1. Metrik Türleri

#### 🗓️ Temiz Günler (Clean Days)
- Günah yapılmayan gün sayısı
- En yüksek temiz gün sayısına sahip kullanıcılar öne çıkar
- Motivasyon için en önemli metrik

#### 📉 En Az Günah (Least Sins)
- Toplam günah sayısı (en az olan kazanır)
- Disiplinli kullanıcıları ödüllendirir
- Dönem bazlı karşılaştırma

#### 💪 Motivasyon Skoru (Motivation)
- Temiz gün oranı (0-100%)
- Formül: `(Temiz Günler / Toplam Günler) * 100`
- Genel başarı göstergesi

### 2. Dönem Filtreleme

- **Bugün** - Günlük performans
- **Bu Hafta** - Haftalık karşılaştırma (Pazar-Cumartesi)
- **Bu Ay** - Aylık sıralama
- **Tüm Zamanlar** - Genel liderlik

### 3. Kullanıcı Bilgileri

Her kullanıcı kartında:
- 🏅 Sıralama (🥇🥈🥉 veya #4, #5...)
- 👤 Avatar ve isim
- 📊 Level ve XP
- 🏆 Kazanılan rozetler (ilk 3)
- 📈 Metrik değeri

### 4. Mevcut Kullanıcı Vurgulama

- Özel renk vurgusu (primary border)
- "Sen" badge'i
- Üst kısımda ayrı kart gösterimi
- Toplam kullanıcı sayısı içinde pozisyon

---

## 🔌 API Endpoint'leri

### GET /api/v1/food-sins/leaderboard

Liderlik tablosu verilerini getirir.

**Query Parameters:**
```typescript
{
  period?: 'daily' | 'weekly' | 'monthly' | 'alltime'; // default: 'weekly'
  metric?: 'cleanDays' | 'leastSins' | 'motivation'; // default: 'cleanDays'
}
```

**Response:**
```typescript
{
  leaderboard: Array<{
    userId: string;
    name: string;
    username: string | null;
    image: string | null;
    level: number;
    xp: number;
    totalSins: number;
    cleanDays: number;
    motivationScore: number;
    badges: Array<{ emoji: string; name: string }>;
    isCurrentUser: boolean;
    rank: number;
  }>;
  currentUser: LeaderboardUser | null;
  period: string;
  metric: string;
  totalUsers: number;
}
```

**Örnek İstek:**
```bash
GET /api/v1/food-sins/leaderboard?period=weekly&metric=cleanDays
```

**Örnek Yanıt:**
```json
{
  "leaderboard": [
    {
      "userId": "user123",
      "name": "Ahmet Yılmaz",
      "username": "ahmet",
      "image": "/avatars/ahmet.jpg",
      "level": 5,
      "xp": 1250,
      "totalSins": 3,
      "cleanDays": 6,
      "motivationScore": 85,
      "badges": [
        { "emoji": "🥇", "name": "Glukozsuz Kahraman" },
        { "emoji": "😇", "name": "Motivasyon Meleği" }
      ],
      "isCurrentUser": false,
      "rank": 1
    }
  ],
  "currentUser": {
    "rank": 5,
    "cleanDays": 4,
    "totalSins": 5,
    "motivationScore": 70
  },
  "period": "weekly",
  "metric": "cleanDays",
  "totalUsers": 42
}
```

---

### GET /api/admin/sin-leaderboard-stats

Admin için liderlik tablosu istatistikleri.

**Response:**
```typescript
{
  totalActiveUsers: number;
  weeklyActiveUsers: number;
  engagementRate: number; // 0-100
  topUsers: Array<{
    id: string;
    name: string;
    image: string | null;
    level: number;
    xp: number;
    weeklySins: number;
    badges: Array<{ emoji: string; name: string }>;
  }>;
  topBadgeEarners: Array<{
    id: string;
    name: string;
    image: string | null;
    badgeCount: number;
  }>;
  sinTypeDistribution: Array<{
    type: string;
    count: number;
  }>;
}
```

---

## 🎨 Frontend Bileşeni

### SinLeaderboard Component

**Konum:** `src/components/food-sins/sin-leaderboard.tsx`

**Özellikler:**
- Tab navigasyonu (3 metrik)
- Dönem seçimi butonları
- Real-time veri yenileme
- Loading state'leri
- Responsive tasarım
- Toast bildirimleri

**Kullanım:**
```tsx
import SinLeaderboard from '@/components/food-sins/sin-leaderboard';

<SinLeaderboard />
```

---

## 📊 Hesaplama Mantığı

### Temiz Gün Hesaplama

```typescript
// Günah yapılan günleri bul
const sinDates = new Set(
  foodSins.map(sin => 
    new Date(sin.createdAt).toISOString().split('T')[0]
  )
);

// Toplam gün sayısı
const totalDays = Math.ceil(
  (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
);

// Temiz günler
const cleanDays = Math.max(0, totalDays - sinDates.size);
```

### Motivasyon Skoru

```typescript
const motivationScore = totalDays > 0
  ? Math.round((cleanDays / totalDays) * 100)
  : 100;
```

### Sıralama

```typescript
// Temiz günlere göre (azalan)
sortedData.sort((a, b) => b.cleanDays - a.cleanDays);

// En az günaha göre (artan)
sortedData.sort((a, b) => a.totalSins - b.totalSins);

// Motivasyona göre (azalan)
sortedData.sort((a, b) => b.motivationScore - a.motivationScore);
```

---

## 🎮 Kullanıcı Deneyimi

### Akış

1. Kullanıcı "🏅 Liderlik" tabına tıklar
2. Varsayılan olarak "Temiz Günler" ve "Bu Hafta" gösterilir
3. Kullanıcı metrik ve dönem değiştirebilir
4. Sıralama otomatik güncellenir
5. Kendi pozisyonu üstte vurgulanır

### Motivasyon Faktörleri

- 🥇 İlk 3'e özel madalya gösterimi
- 🎯 Kendi sıralamasını görme
- 📈 İlerleme takibi
- 🏆 Rozet koleksiyonu gösterimi
- 💪 Başarılı kullanıcılardan ilham alma

---

## 🔒 Güvenlik

### Kimlik Doğrulama
- Tüm endpoint'ler NextAuth session kontrolü yapar
- Sadece giriş yapmış kullanıcılar erişebilir

### Veri Gizliliği
- Kullanıcı detayları (email, telefon) gösterilmez
- Sadece public profil bilgileri paylaşılır
- Admin endpoint'leri role kontrolü yapar

### Rate Limiting
- API istekleri sınırlandırılmalı (gelecek özellik)
- Cache mekanizması eklenebilir

---

## 📈 Performans Optimizasyonu

### Veritabanı
- Index'ler: `userId`, `createdAt`, `sinType`
- Aggregate query'ler kullanılıyor
- İlk 100 kullanıcı ile sınırlı

### Frontend
- Loading state'leri
- Optimistic UI güncellemeleri
- Lazy loading (gelecek)

---

## 🚀 Gelecek Geliştirmeler

### Öncelik 1
- [ ] Cache mekanizması (Redis)
- [ ] Real-time güncellemeler (WebSocket)
- [ ] Arkadaş filtreleme

### Öncelik 2
- [ ] Haftalık/Aylık kazananlar bildirimi
- [ ] Liderlik tablosu rozeti
- [ ] Geçmiş dönem karşılaştırması

### Öncelik 3
- [ ] Bölgesel liderlik tabloları
- [ ] Yaş grubu filtreleme
- [ ] Takım yarışmaları

---

## 🧪 Test Senaryoları

### Backend Test
```bash
# Haftalık temiz günler
curl -X GET "http://localhost:3000/api/v1/food-sins/leaderboard?period=weekly&metric=cleanDays" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Aylık en az günah
curl -X GET "http://localhost:3000/api/v1/food-sins/leaderboard?period=monthly&metric=leastSins" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Test
1. Farklı metrikler arasında geçiş yap
2. Dönem değiştir ve sonuçları kontrol et
3. Kendi pozisyonunu doğrula
4. Responsive tasarımı test et (mobil/tablet/desktop)

---

## 📝 Notlar

- Liderlik tablosu her istek anında hesaplanır (cache yok)
- Sadece aktif kullanıcılar (`isActive: true`) dahil edilir
- Sıralama 1'den başlar (rank: 1, 2, 3...)
- Eşitlik durumunda kullanıcı ID'sine göre sıralama yapılır

---

## 🔗 İlgili Dosyalar

```
src/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   └── food-sins/
│   │   │       └── leaderboard/
│   │   │           └── route.ts
│   │   └── admin/
│   │       └── sin-leaderboard-stats/
│   │           └── route.ts
│   └── gunah-sayaci/
│       └── sin-stats-client.tsx
└── components/
    └── food-sins/
        └── sin-leaderboard.tsx
```

---

## 📚 İlgili Dökümanlar

- `GUNAH_ILERLEME.md` - Genel proje durumu
- `günah.md` - Orijinal konsept
- `GUNAH_SAYACI_ADMIN_PANEL.md` - Admin özellikleri
- `GUNAH_SAYACI_AI_OTOMASYON.md` - AI entegrasyonu

---

**Hazırlayan:** Kiro AI  
**Son Güncelleme:** 18 Kasım 2025  
**Durum:** ✅ Production Ready

