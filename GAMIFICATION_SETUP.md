# 🎮 Gamification Sistemi Kurulum Rehberi

## 📋 İçindekiler

1. [Genel Bakış](#genel-bakış)
2. [Veritabanı Kurulumu](#veritabanı-kurulumu)
3. [Seed Data](#seed-data)
4. [API Endpoints](#api-endpoints)
5. [Kullanıcı Sayfaları](#kullanıcı-sayfaları)
6. [Admin Paneli](#admin-paneli)
7. [Özellikler](#özellikler)

## 🎯 Genel Bakış

Gamification sistemi şu modülleri içerir:

- **Rozetler (Badges)**: Başarı rozetleri
- **Görevler (Quests)**: Günlük/haftalık görevler
- **XP & Seviye**: Deneyim puanı ve seviye sistemi
- **Coin Sistemi**: Sanal para birimi
- **Mağaza (Shop)**: Coin ile alışveriş
- **Sezonlar & Ligler**: Rekabetçi sezonlar
- **Loncalar (Guilds)**: Takım sistemi
- **Seri (Streak)**: Günlük check-in serisi
- **Battle Pass**: Sezonluk geçiş sistemi
- **Davet Sistemi (Referral)**: Arkadaş davet et

## 🗄️ Veritabanı Kurulumu

### 1. Migration Oluştur

**⚠️ ÖNEMLİ: Veritabanı migration kuralları**

```bash
# Development ortamında (--create-only kullan!)
npx prisma migrate dev --create-only --name add_gamification_system

# Migration dosyasını kontrol et
# prisma/migrations/XXXXXX_add_gamification_system/migration.sql

# Migration'ı uygula
npx prisma migrate dev

# Prisma Client'ı güncelle
npx prisma generate
```

**Production ortamında:**

```bash
# ASLA migrate dev kullanma!
# Sadece migrate deploy kullan
npx prisma migrate deploy
```

### 2. Eklenen Modeller

```prisma
// User modeline eklenen alanlar
xp: Int @default(0)
level: Int @default(1)
coins: Int @default(0)
streak: Int @default(0)
lastCheckIn: DateTime?
reputationScore: Int @default(0)

// Yeni modeller
Badge, UserBadge
DailyQuest, UserDailyQuest
CoinTransaction
ShopItem, UserPurchase
Season, League, UserLeague
Guild, GuildMember
BattlePass, BattlePassReward, UserBattlePass
StreakRecovery
ReferralCode, Referral
```

## 🌱 Seed Data

### Başlangıç Verilerini Yükle

```bash
# TypeScript seed dosyasını çalıştır
npx ts-node prisma/seeds/gamification.seed.ts
```

### Seed Edilen Veriler

- **14 Rozet**: İlk plan, kilo kaybı, seri, sosyal vb.
- **5 Günlük Görev**: Check-in, tartı, su içme, yorum, beğeni
- **6 Mağaza Ürünü**: Kozmetik, boost, kurtarma
- **1 Sezon**: Aktif sezon
- **5 Lig**: Bronz, Gümüş, Altın, Platin, Elmas

## 🔌 API Endpoints

### Kullanıcı Endpoints

```
GET    /api/v1/badges              # Tüm rozetler
GET    /api/v1/badges/my           # Kullanıcının rozetleri

GET    /api/v1/quests              # Günlük görevler
POST   /api/v1/quests/progress     # Görev ilerlemesi güncelle
POST   /api/v1/quests/claim        # Görev ödülü al

GET    /api/v1/shop                # Mağaza ürünleri
POST   /api/v1/shop/purchase       # Ürün satın al
GET    /api/v1/shop/my-purchases   # Satın alımlarım

GET    /api/v1/coins/transactions  # Coin işlemleri

POST   /api/v1/streak/check-in     # Günlük check-in
POST   /api/v1/streak/recover      # Seri kurtarma

GET    /api/v1/seasons/current     # Aktif sezon
GET    /api/v1/leagues/my          # Kullanıcının ligi
GET    /api/v1/leagues/:id/leaderboard  # Lig sıralaması

GET    /api/v1/guilds              # Loncalar
POST   /api/v1/guilds              # Lonca oluştur
POST   /api/v1/guilds/:id/join     # Loncaya katıl
POST   /api/v1/guilds/:id/leave    # Loncadan ayrıl
GET    /api/v1/guilds/:id/members  # Lonca üyeleri

GET    /api/v1/battle-pass/my      # Battle pass durumu

GET    /api/v1/referrals/my-code   # Davet kodum
POST   /api/v1/referrals/my-code   # Davet kodu oluştur
POST   /api/v1/referrals/apply     # Davet kodu kullan
```

### Admin Endpoints

```
POST   /api/v1/admin/badges        # Rozet oluştur
PATCH  /api/v1/admin/badges/:id    # Rozet güncelle
DELETE /api/v1/admin/badges/:id    # Rozet sil
POST   /api/v1/admin/badges/award  # Kullanıcıya rozet ver

GET    /api/v1/admin/quests        # Görevler
POST   /api/v1/admin/quests        # Görev oluştur

GET    /api/v1/admin/shop          # Mağaza ürünleri
POST   /api/v1/admin/shop          # Ürün oluştur

POST   /api/v1/admin/coins/grant   # Kullanıcıya coin ver
```

## 📱 Kullanıcı Sayfaları

### Oluşturulan Sayfalar

```
/rozetler          # Rozetler sayfası
/gorevler          # Günlük görevler
/magaza            # Mağaza
/lonca             # Loncalar listesi
/lonca/[slug]      # Lonca detay
/sezonlar          # Sezonlar & Ligler
/battle-pass       # Battle Pass (TODO)
/davet-et          # Davet sistemi (TODO)
```

### Özellikler

**Rozetler Sayfası:**
- Tüm rozetleri kategorilere göre göster
- Kazanılan/kazanılmayan rozetler
- İlerleme çubuğu
- Rozet detayları (XP, coin ödülleri)

**Görevler Sayfası:**
- Günlük görevler listesi
- İlerleme takibi
- Ödül alma butonu
- Tamamlanan görevler

**Mağaza Sayfası:**
- Kategorilere göre ürünler
- Coin bakiyesi
- Satın alma işlemi
- Stok takibi

**Lonca Sayfası:**
- Loncalar listesi
- Lonca oluşturma
- Loncaya katılma
- Üye listesi

**Sezonlar Sayfası:**
- Aktif sezon bilgisi
- Kullanıcının ligi
- Lig ilerlemesi
- Tüm ligler

## 🛠️ Admin Paneli

### Admin Sayfaları

```
/admin/gamification/badges     # Rozet yönetimi
/admin/gamification/quests     # Görev yönetimi (TODO)
/admin/gamification/shop       # Mağaza yönetimi (TODO)
/admin/gamification/seasons    # Sezon yönetimi (TODO)
/admin/gamification/guilds     # Lonca yönetimi (TODO)
```

### Özellikler

- Rozet CRUD işlemleri
- Kullanıcıya manuel rozet verme
- Görev oluşturma/düzenleme
- Mağaza ürünleri yönetimi
- Sezon ve lig yönetimi
- İstatistikler

## ⚙️ Özellikler

### 1. XP & Seviye Sistemi

```typescript
// XP kazanma
await addXP(userId, 50, 'Plan oluşturdu');

// Seviye hesaplama
const level = calculateLevelFromXP(xp);
const xpForNext = calculateXPForNextLevel(level);
```

**XP Kaynakları:**
- Görev tamamlama: 10-50 XP
- Rozet kazanma: 25-1000 XP
- Plan/tarif paylaşma: 50 XP
- Yorum yapma: 10 XP
- Seviye atlama bonusu: level * 10 coin

### 2. Coin Sistemi

```typescript
// Coin kazanma
await addCoins(userId, 50, 'quest_reward', 'Görev tamamlandı');

// Coin harcama
await spendCoins(userId, 100, 'purchase', 'Ürün satın alındı');
```

**Coin Kaynakları:**
- Görevler: 5-10 coin
- Rozetler: 5-250 coin
- Seviye atlama: level * 10 coin
- Davet bonusu: 50 coin
- Admin hediyesi

**Coin Kullanımı:**
- Mağaza ürünleri: 50-200 coin
- Seri kurtarma: 50 coin/gün
- Battle Pass: 500 coin (premium)

### 3. Rozet Sistemi

**Kategoriler:**
- `achievement`: Başarılar (ilk plan, ilk tarif)
- `milestone`: Kilometre taşları (5kg, 10kg, 20kg)
- `social`: Sosyal (takipçi, beğeni)
- `special`: Özel (erken katılan, lonca kurucusu)

**Nadirlik:**
- `common`: Yaygın (gri)
- `rare`: Nadir (mavi)
- `epic`: Epik (mor)
- `legendary`: Efsanevi (sarı)

### 4. Görev Sistemi

**Görev Tipleri:**
- `daily`: Günlük görevler (her gün sıfırlanır)
- `weekly`: Haftalık görevler
- `special`: Özel görevler

**Görev Mekanikleri:**
- İlerleme takibi
- Otomatik tamamlanma kontrolü
- Ödül verme
- Rate limiting (5 claim/dakika)

### 5. Seri (Streak) Sistemi

```typescript
// Check-in yap
const { streak, continued } = await updateStreak(userId);

// Seri kurtarma (50 coin/gün)
await recoverStreak(userId, daysLost);
```

**Seri Rozetleri:**
- 7 gün: 🔥 (75 XP, 20 coin)
- 30 gün: ⚡ (250 XP, 75 coin)
- 100 gün: 💎 (1000 XP, 250 coin)

### 6. Sezon & Lig Sistemi

**Ligler:**
- Bronz: 0-999 puan
- Gümüş: 1000-2499 puan
- Altın: 2500-4999 puan
- Platin: 5000-9999 puan
- Elmas: 10000+ puan

**Puan Kazanma:**
- Plan paylaşma: 50 puan
- Tarif paylaşma: 30 puan
- Kilo kaybı: 10 puan/kg
- Görev tamamlama: 5 puan

### 7. Lonca Sistemi

**Özellikler:**
- Maksimum 50 üye
- Lider, officer, member rolleri
- Toplam XP ve seviye
- Lonca görevleri (TODO)
- Lonca sıralaması

### 8. Davet Sistemi

```typescript
// Davet kodu oluştur
const code = await createReferralCode(userId);

// Davet kodunu kullan
await applyReferralCode(newUserId, code);

// Bonus ver (otomatik)
// Davet eden: +50 coin
// Davet edilen: +50 coin
```

## 🔧 Entegrasyon

### Plan Oluşturma Hook

```typescript
// src/app/api/v1/plans/route.ts
import * as gamificationService from '@/services/gamification.service';

// Plan oluşturulduğunda
await gamificationService.awardBadge(userId, 'first_plan');
await gamificationService.addXP(userId, 50, 'Plan oluşturdu');
await gamificationService.addLeaguePoints(userId, 50);
await gamificationService.updateQuestProgress(userId, 'daily_create_plan', 1);
```

### Kilo Kaybı Hook

```typescript
// src/app/api/v1/weight-logs/route.ts

// Kilo kaybı hesapla
const weightLoss = previousWeight - currentWeight;

if (weightLoss >= 5) {
  await gamificationService.awardBadge(userId, 'weight_loss_5kg');
}
if (weightLoss >= 10) {
  await gamificationService.awardBadge(userId, 'weight_loss_10kg');
}
if (weightLoss >= 20) {
  await gamificationService.awardBadge(userId, 'weight_loss_20kg');
}

// Lig puanı ekle
await gamificationService.addLeaguePoints(userId, Math.floor(weightLoss * 10));
```

### Check-in Hook

```typescript
// src/app/api/v1/check-in/route.ts

// Seri güncelle
const { streak, continued } = await gamificationService.updateStreak(userId);

// Görev ilerlemesi
await gamificationService.updateQuestProgress(userId, 'daily_check_in', 1);

// XP ver
await gamificationService.addXP(userId, 10, 'Günlük check-in');
```

## 📊 İstatistikler

### Kullanıcı İstatistikleri

```typescript
// Kullanıcı profili
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    xp: true,
    level: true,
    coins: true,
    streak: true,
    reputationScore: true,
    _count: {
      select: {
        badges: true,
        plans: true,
        recipes: true,
      },
    },
  },
});
```

### Admin İstatistikleri

```typescript
// Gamification stats
const stats = {
  totalBadges: await prisma.badge.count(),
  totalBadgesEarned: await prisma.userBadge.count(),
  totalQuests: await prisma.dailyQuest.count(),
  totalQuestsCompleted: await prisma.userDailyQuest.count({ where: { completed: true } }),
  totalCoinsEarned: await prisma.coinTransaction.aggregate({
    where: { amount: { gt: 0 } },
    _sum: { amount: true },
  }),
  totalCoinsSpent: await prisma.coinTransaction.aggregate({
    where: { amount: { lt: 0 } },
    _sum: { amount: true },
  }),
  totalGuilds: await prisma.guild.count(),
  totalGuildMembers: await prisma.guildMember.count(),
};
```

## 🚀 Sonraki Adımlar

### Yapılacaklar

- [ ] Battle Pass UI
- [ ] Davet sistemi UI
- [ ] Lonca görevleri
- [ ] Lonca sohbet
- [ ] Lig sıralaması sayfası
- [ ] Bildirim entegrasyonu
- [ ] Email bildirimleri (rozet kazanma, seviye atlama)
- [ ] Push bildirimleri
- [ ] Günlük/haftalık özet emaili

### Gelişmiş Özellikler

- [ ] Achievement chains (çok adımlı rozetler)
- [ ] Seasonal events (özel etkinlikler)
- [ ] Guild wars (lonca savaşları)
- [ ] Tournament system (turnuva)
- [ ] Leaderboard rewards (sıralama ödülleri)
- [ ] Daily login rewards (giriş ödülleri)
- [ ] Lucky wheel (şans çarkı)
- [ ] Mystery boxes (sürpriz kutu)

## 📝 Notlar

- Rate limiting tüm gamification endpoint'lerinde aktif
- Redis cache kullanılıyor (user badges, stats)
- Tüm coin işlemleri transaction ile güvenli
- Admin işlemleri activity log'a kaydediliyor
- XP ve coin kazanımları bildirim olarak gönderiliyor

## 🐛 Sorun Giderme

### Migration Hataları

```bash
# Migration sıfırlama (SADECE DEV!)
npx prisma migrate reset

# Migration durumu kontrol
npx prisma migrate status

# Manuel migration
npx prisma db push
```

### Seed Hataları

```bash
# Seed tekrar çalıştır
npx ts-node prisma/seeds/gamification.seed.ts

# Tüm seed'leri çalıştır
npx prisma db seed
```

### Cache Sorunları

```bash
# Redis cache temizle
redis-cli FLUSHDB

# Belirli key'leri temizle
redis-cli DEL "user:badges:*"
redis-cli DEL "user:stats:*"
```

## 📚 Kaynaklar

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Gamification Best Practices](https://www.gamify.com/gamification-blog)
- [Badge Design Guidelines](https://www.nngroup.com/articles/gamification/)

---

**Oluşturulma Tarihi:** 2024
**Son Güncelleme:** 2024
**Versiyon:** 1.0.0
