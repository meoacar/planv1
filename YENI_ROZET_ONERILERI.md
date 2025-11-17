# 🏆 Yeni Rozet Önerileri - ZayiflamaPlan

## 📊 Mevcut Durum Analizi

**Şu anda 14 rozet var:**
- Achievement (3): İlk Plan, İlk Tarif, İlk Yorum
- Milestone (6): 5kg/10kg/20kg kaybı, 7/30/100 günlük seri
- Social (3): 10/50 takipçi, 100 beğeni
- Special (2): Erken Katılan, Lonca Kurucusu

## 🎯 Yeni Rozet Kategorileri ve Öneriler

### 1. TRACKING & HEALTH (Sağlık Takibi) - 12 Yeni Rozet

#### Kilo Takibi
```typescript
{
  key: 'first_weight_log',
  name: 'İlk Tartı',
  description: 'İlk kilo kaydını girdin!',
  icon: '⚖️',
  category: 'achievement',
  rarity: 'common',
  xpReward: 25,
  coinReward: 5,
}

{
  key: 'weight_loss_1kg',
  name: 'İlk Kilo',
  description: 'İlk kilonu verdin!',
  icon: '🎈',
  category: 'milestone',
  rarity: 'common',
  xpReward: 50,
  coinReward: 10,
}

{
  key: 'weight_loss_50kg',
  name: 'Süper Transformasyon',
  description: '50kg verdin, inanılmaz bir başarı!',
  icon: '🦸',
  category: 'milestone',
  rarity: 'legendary',
  xpReward: 2000,
  coinReward: 500,
}
```

#### Fotoğraf Takibi
```typescript
{
  key: 'first_progress_photo',
  name: 'İlk Fotoğraf',
  description: 'İlk ilerleme fotoğrafını yükledin!',
  icon: '📸',
  category: 'achievement',
  rarity: 'common',
  xpReward: 30,
  coinReward: 10,
}

{
  key: 'photo_streak_30',
  name: 'Fotoğraf Koleksiyoncusu',
  description: '30 gün boyunca fotoğraf çektin!',
  icon: '📷',
  category: 'milestone',
  rarity: 'epic',
  xpReward: 200,
  coinReward: 50,
}
```

#### Check-in & Streak
```typescript
{
  key: 'first_check_in',
  name: 'İlk Check-in',
  description: 'İlk günlük check-in\'ini yaptın!',
  icon: '✅',
  category: 'achievement',
  rarity: 'common',
  xpReward: 20,
  coinReward: 5,
}

{
  key: 'streak_365',
  name: 'Yılın Şampiyonu',
  description: '365 gün üst üste check-in yaptın!',
  icon: '🏅',
  category: 'milestone',
  rarity: 'legendary',
  xpReward: 5000,
  coinReward: 1000,
}
```

#### Ölçüm & Ruh Hali
```typescript
{
  key: 'first_measurement',
  name: 'İlk Ölçüm',
  description: 'İlk vücut ölçümünü yaptın!',
  icon: '📏',
  category: 'achievement',
  rarity: 'common',
  xpReward: 25,
  coinReward: 5,
}

{
  key: 'mood_tracker',
  name: 'Ruh Hali Takipçisi',
  description: '30 gün ruh hali kaydı tuttun!',
  icon: '😊',
  category: 'milestone',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 25,
}

{
  key: 'first_voice_note',
  name: 'İlk Ses Notu',
  description: 'İlk ses notunu kaydettın!',
  icon: '🎙️',
  category: 'achievement',
  rarity: 'common',
  xpReward: 30,
  coinReward: 10,
}

{
  key: 'voice_diary_master',
  name: 'Ses Günlüğü Ustası',
  description: '50 ses notu kaydettın!',
  icon: '🎧',
  category: 'milestone',
  rarity: 'epic',
  xpReward: 250,
  coinReward: 75,
}
```

### 2. CONTENT CREATION (İçerik Üretimi) - 10 Yeni Rozet

#### Tarifler
```typescript
{
  key: 'recipe_master_10',
  name: 'Tarif Ustası',
  description: '10 tarif paylaştın!',
  icon: '👨‍🍳',
  category: 'achievement',
  rarity: 'rare',
  xpReward: 150,
  coinReward: 30,
}

{
  key: 'recipe_master_50',
  name: 'Şef',
  description: '50 tarif paylaştın!',
  icon: '🧑‍🍳',
  category: 'achievement',
  rarity: 'epic',
  xpReward: 500,
  coinReward: 100,
}

{
  key: 'recipe_viral',
  name: 'Viral Tarif',
  description: 'Tarifin 1000 beğeni aldı!',
  icon: '🔥',
  category: 'special',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}
```

#### Planlar
```typescript
{
  key: 'plan_creator_10',
  name: 'Plan Uzmanı',
  description: '10 plan oluşturdun!',
  icon: '📋',
  category: 'achievement',
  rarity: 'rare',
  xpReward: 150,
  coinReward: 30,
}

{
  key: 'plan_popular',
  name: 'Popüler Plan',
  description: 'Planın 500 kişi tarafından kullanıldı!',
  icon: '⭐',
  category: 'special',
  rarity: 'epic',
  xpReward: 500,
  coinReward: 100,
}
```

#### Yorumlar
```typescript
{
  key: 'comment_master_100',
  name: 'Yorum Ustası',
  description: '100 yorum yaptın!',
  icon: '💭',
  category: 'achievement',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 25,
}

{
  key: 'helpful_commenter',
  name: 'Yardımsever',
  description: 'Yorumların 100 beğeni aldı!',
  icon: '🤝',
  category: 'social',
  rarity: 'rare',
  xpReward: 150,
  coinReward: 30,
}
```

### 3. SOCIAL & COMMUNITY (Sosyal) - 15 Yeni Rozet

#### Takipçi & Takip
```typescript
{
  key: 'social_100_followers',
  name: '100 Takipçi',
  description: '100 takipçiye ulaştın!',
  icon: '🎯',
  category: 'social',
  rarity: 'epic',
  xpReward: 300,
  coinReward: 75,
}

{
  key: 'social_500_followers',
  name: 'İnfluencer',
  description: '500 takipçiye ulaştın!',
  icon: '🌟',
  category: 'social',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}

{
  key: 'social_networker',
  name: 'Sosyal Kelebek',
  description: '50 kişiyi takip ettin!',
  icon: '🦋',
  category: 'social',
  rarity: 'common',
  xpReward: 50,
  coinReward: 10,
}
```

#### Gruplar
```typescript
{
  key: 'first_group_join',
  name: 'Grup Üyesi',
  description: 'İlk gruba katıldın!',
  icon: '👥',
  category: 'social',
  rarity: 'common',
  xpReward: 25,
  coinReward: 5,
}

{
  key: 'group_creator',
  name: 'Grup Kurucusu',
  description: 'Bir grup oluşturdun!',
  icon: '🏛️',
  category: 'social',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 25,
}

{
  key: 'group_active_member',
  name: 'Aktif Üye',
  description: 'Gruplarda 100 gönderi paylaştın!',
  icon: '📢',
  category: 'social',
  rarity: 'epic',
  xpReward: 200,
  coinReward: 50,
}
```

#### Lonca (Guild)
```typescript
{
  key: 'guild_member',
  name: 'Lonca Üyesi',
  description: 'Bir loncaya katıldın!',
  icon: '⚔️',
  category: 'social',
  rarity: 'common',
  xpReward: 50,
  coinReward: 10,
}

{
  key: 'guild_officer',
  name: 'Lonca Subayı',
  description: 'Lonca subayı oldun!',
  icon: '🛡️',
  category: 'special',
  rarity: 'epic',
  xpReward: 300,
  coinReward: 75,
}

{
  key: 'guild_champion',
  name: 'Lonca Şampiyonu',
  description: 'Loncan 1. lige çıktı!',
  icon: '🏆',
  category: 'special',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}
```

#### Mesajlaşma
```typescript
{
  key: 'first_message',
  name: 'İlk Mesaj',
  description: 'İlk mesajını gönderdin!',
  icon: '✉️',
  category: 'social',
  rarity: 'common',
  xpReward: 20,
  coinReward: 5,
}

{
  key: 'social_butterfly',
  name: 'Sohbet Canavarı',
  description: '100 mesaj gönderdin!',
  icon: '💌',
  category: 'social',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 25,
}
```

#### Referral
```typescript
{
  key: 'first_referral',
  name: 'İlk Davet',
  description: 'İlk arkadaşını davet ettin!',
  icon: '🎁',
  category: 'social',
  rarity: 'common',
  xpReward: 50,
  coinReward: 10,
}

{
  key: 'referral_master_10',
  name: 'Davet Ustası',
  description: '10 arkadaşını davet ettin!',
  icon: '🎉',
  category: 'social',
  rarity: 'epic',
  xpReward: 500,
  coinReward: 100,
}

{
  key: 'referral_legend',
  name: 'Davet Efsanesi',
  description: '50 arkadaşını davet ettin!',
  icon: '👑',
  category: 'social',
  rarity: 'legendary',
  xpReward: 2000,
  coinReward: 500,
}
```

### 4. GAMIFICATION (Oyunlaştırma) - 12 Yeni Rozet

#### Level & XP
```typescript
{
  key: 'level_10',
  name: 'Seviye 10',
  description: '10. seviyeye ulaştın!',
  icon: '🔟',
  category: 'milestone',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 25,
}

{
  key: 'level_25',
  name: 'Seviye 25',
  description: '25. seviyeye ulaştın!',
  icon: '🎖️',
  category: 'milestone',
  rarity: 'epic',
  xpReward: 250,
  coinReward: 75,
}

{
  key: 'level_50',
  name: 'Seviye 50',
  description: '50. seviyeye ulaştın!',
  icon: '👑',
  category: 'milestone',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}

{
  key: 'level_100',
  name: 'Efsane',
  description: '100. seviyeye ulaştın!',
  icon: '💎',
  category: 'milestone',
  rarity: 'legendary',
  xpReward: 5000,
  coinReward: 1000,
}
```

#### Görevler
```typescript
{
  key: 'quest_master_10',
  name: 'Görev Tamamlayıcı',
  description: '10 görev tamamladın!',
  icon: '📝',
  category: 'achievement',
  rarity: 'common',
  xpReward: 50,
  coinReward: 10,
}

{
  key: 'quest_master_100',
  name: 'Görev Ustası',
  description: '100 görev tamamladın!',
  icon: '📜',
  category: 'achievement',
  rarity: 'epic',
  xpReward: 500,
  coinReward: 100,
}

{
  key: 'daily_quest_streak_30',
  name: 'Günlük Görev Şampiyonu',
  description: '30 gün üst üste günlük görevleri tamamladın!',
  icon: '🎯',
  category: 'milestone',
  rarity: 'epic',
  xpReward: 300,
  coinReward: 75,
}
```

#### Coin & Mağaza
```typescript
{
  key: 'coin_collector_1000',
  name: 'Coin Koleksiyoncusu',
  description: '1000 coin biriktirdin!',
  icon: '💰',
  category: 'milestone',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 50,
}

{
  key: 'coin_collector_10000',
  name: 'Zengin',
  description: '10000 coin biriktirdin!',
  icon: '💎',
  category: 'milestone',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}

{
  key: 'first_purchase',
  name: 'İlk Alışveriş',
  description: 'Mağazadan ilk alışverişini yaptın!',
  icon: '🛒',
  category: 'achievement',
  rarity: 'common',
  xpReward: 25,
  coinReward: 5,
}

{
  key: 'shopaholic',
  name: 'Alışveriş Tutkunu',
  description: 'Mağazadan 20 ürün aldın!',
  icon: '🛍️',
  category: 'achievement',
  rarity: 'rare',
  xpReward: 150,
  coinReward: 30,
}
```

#### Ligler & Sezonlar
```typescript
{
  key: 'league_bronze',
  name: 'Bronz Lig',
  description: 'Bronz lige ulaştın!',
  icon: '🥉',
  category: 'milestone',
  rarity: 'common',
  xpReward: 50,
  coinReward: 10,
}

{
  key: 'league_silver',
  name: 'Gümüş Lig',
  description: 'Gümüş lige ulaştın!',
  icon: '🥈',
  category: 'milestone',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 25,
}

{
  key: 'league_gold',
  name: 'Altın Lig',
  description: 'Altın lige ulaştın!',
  icon: '🥇',
  category: 'milestone',
  rarity: 'epic',
  xpReward: 250,
  coinReward: 75,
}

{
  key: 'league_platinum',
  name: 'Platin Lig',
  description: 'Platin lige ulaştın!',
  icon: '💿',
  category: 'milestone',
  rarity: 'epic',
  xpReward: 500,
  coinReward: 100,
}

{
  key: 'league_diamond',
  name: 'Elmas Lig',
  description: 'Elmas lige ulaştın!',
  icon: '💎',
  category: 'milestone',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}

{
  key: 'season_winner',
  name: 'Sezon Şampiyonu',
  description: 'Bir sezonu 1. sırada bitirdin!',
  icon: '🏆',
  category: 'special',
  rarity: 'legendary',
  xpReward: 2000,
  coinReward: 500,
}
```

### 5. SPECIAL EVENTS (Özel Etkinlikler) - 8 Yeni Rozet

```typescript
{
  key: 'new_year_2025',
  name: 'Yeni Yıl 2025',
  description: '2025 yılına özel rozet!',
  icon: '🎊',
  category: 'special',
  rarity: 'legendary',
  xpReward: 500,
  coinReward: 100,
}

{
  key: 'ramadan_2025',
  name: 'Ramazan 2025',
  description: 'Ramazan ayına özel rozet!',
  icon: '🌙',
  category: 'special',
  rarity: 'epic',
  xpReward: 300,
  coinReward: 75,
}

{
  key: 'summer_challenge',
  name: 'Yaz Meydan Okuması',
  description: 'Yaz challenge\'ını tamamladın!',
  icon: '☀️',
  category: 'special',
  rarity: 'epic',
  xpReward: 400,
  coinReward: 100,
}

{
  key: 'birthday_badge',
  name: 'Doğum Günü',
  description: 'Platformda 1 yılını doldurdun!',
  icon: '🎂',
  category: 'special',
  rarity: 'epic',
  xpReward: 500,
  coinReward: 100,
}

{
  key: 'beta_tester',
  name: 'Beta Tester',
  description: 'Beta döneminde katıldın!',
  icon: '🧪',
  category: 'special',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}

{
  key: 'bug_hunter',
  name: 'Bug Avcısı',
  description: '10 bug rapor ettin!',
  icon: '🐛',
  category: 'special',
  rarity: 'epic',
  xpReward: 500,
  coinReward: 100,
}

{
  key: 'community_hero',
  name: 'Topluluk Kahramanı',
  description: 'Topluluk moderatörü oldun!',
  icon: '🦸‍♂️',
  category: 'special',
  rarity: 'legendary',
  xpReward: 1000,
  coinReward: 250,
}

{
  key: 'verified_user',
  name: 'Onaylı Kullanıcı',
  description: 'Hesabın onaylandı!',
  icon: '✓',
  category: 'special',
  rarity: 'rare',
  xpReward: 100,
  coinReward: 25,
}
```

## 📊 Özet

**Toplam Yeni Rozet: 57**
- Tracking & Health: 12 rozet
- Content Creation: 10 rozet
- Social & Community: 15 rozet
- Gamification: 12 rozet
- Special Events: 8 rozet

**Rarity Dağılımı:**
- Common: 18 rozet
- Rare: 17 rozet
- Epic: 14 rozet
- Legendary: 8 rozet

**Toplam Rozet Sayısı: 14 (mevcut) + 57 (yeni) = 71 rozet**

## 🚀 Uygulama Önerisi

1. **Öncelik 1 (Hemen)**: Tracking & Health rozetleri (kullanıcı engagement için kritik)
2. **Öncelik 2 (Bu Hafta)**: Social & Community rozetleri (viral büyüme için)
3. **Öncelik 3 (Gelecek Hafta)**: Gamification rozetleri (retention için)
4. **Öncelik 4 (Gelecek Ay)**: Content Creation ve Special Events rozetleri

## 💡 Ek Öneriler

1. **Gizli Rozetler**: Bazı rozetleri gizli tut, kullanıcılar keşfetsin
2. **Rozet Zincirleri**: İlgili rozetleri zincir haline getir (örn: 1kg → 5kg → 10kg)
3. **Sezonluk Rozetler**: Her sezon için özel rozetler ekle
4. **Rozet Showcase**: Kullanıcılar profillerinde en sevdikleri 5 rozeti gösterebilsin
5. **Rozet Hikayeleri**: Her rozete kısa bir hikaye ekle
6. **Rozet Bildirimleri**: Rozet kazanıldığında özel animasyon göster
7. **Rozet Liderlik Tablosu**: En çok rozet kazanan kullanıcıları göster
