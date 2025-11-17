# ✅ Görevler Sistemi Tamamlandı!

## 🎯 Günlük Görevler ve Entegrasyonları

### 1. ❤️ Beğen (3 içerik) - ✅ TAMAMLANDI
**Entegrasyon Noktaları:**
- `src/app/plan/[slug]/actions.ts` → `toggleLike()` 
- `src/app/api/v1/plans/[slug]/like/route.ts`
- `src/app/api/v1/recipes/[slug]/like/route.ts`

**Çalışma:** Plan veya tarif beğendiğinde otomatik olarak `daily_like` görevi +1 artar.

### 2. 💬 Yorum Yap (1 yorum) - ✅ TAMAMLANDI
**Entegrasyon Noktaları:**
- `src/app/plan/[slug]/actions.ts` → `addComment()`

**Çalışma:** Plan'a yorum yaptığında otomatik olarak `daily_comment` görevi +1 artar.

### 3. ⚖️ Bugün Tartıl (1 kez) - ✅ TAMAMLANDI
**Entegrasyon Noktaları:**
- `src/app/kilo-takibi/actions.ts` → `addWeightLog()`

**Çalışma:** Yeni kilo kaydı girdiğinde (güncelleme değil) otomatik olarak `daily_weigh_in` görevi +1 artar.

### 4. ✅ Günlük Check-in (1 kez) - ⏳ HENÜZ YOK
**Gerekli:** Check-in sistemi henüz yok. Eklendiğinde:
```typescript
await updateQuestProgress(userId, 'daily_check_in', 1)
```

### 5. 💧 Su İç (8 bardak) - ⏳ HENÜZ YOK
**Gerekli:** Su takibi sistemi henüz yok. Eklendiğinde:
```typescript
await updateQuestProgress(userId, 'daily_water', 1) // Her bardak için
```

## 🔧 Yardımcı Özellikler

### 🔄 Sıfırla Butonu (Development Only)
- Görevler sayfasında sağ üstte
- Sadece development ortamında görünür
- Bugünün tüm görev ilerlemelerini siler
- Test için kullanılır

### 🧪 Test Endpoint (Development Only)
- `POST /api/v1/quests/test-progress`
- Manuel olarak görev ilerlemesi test etmek için
- Body: `{ "questKey": "daily_like", "increment": 1 }`

### 🔄 Reset Endpoint (Development Only)
- `POST /api/v1/quests/reset`
- Bugünün tüm görevlerini sıfırlar
- Sadece development ortamında çalışır

## 📊 Görev Sistemi Akışı

```
1. Kullanıcı bir aksiyon yapar (beğeni, yorum, kilo kaydı)
   ↓
2. İlgili action/API çağrılır
   ↓
3. updateQuestProgress(userId, questKey, increment) çağrılır
   ↓
4. Progress artırılır ve database'e kaydedilir
   ↓
5. Progress >= target ise quest otomatik tamamlanır
   ↓
6. Kullanıcı görevler sayfasında "Al" butonunu görür
   ↓
7. "Al" butonuna tıklar
   ↓
8. completeQuest() çağrılır
   ↓
9. XP ve Coin ödülleri verilir
   ↓
10. Görev "Tamamlanan" sekmesine geçer
```

## 🎮 Kullanım

### Kullanıcı Perspektifi
1. `/gorevler` sayfasına git
2. Günlük görevleri gör
3. Görevleri tamamla (beğen, yorum yap, kilo kaydet)
4. Progress bar'ı takip et
5. Hedef sayıya ulaşınca "Al" butonu çıkar
6. "Al" butonuna tıkla
7. XP ve Coin kazan! 🎉

### Developer Perspektifi
**Yeni bir görev eklemek için:**

1. **Seed dosyasına ekle** (`prisma/seeds/gamification.seed.ts`):
```typescript
{
  key: 'daily_new_quest',
  title: 'Yeni Görev',
  description: 'Açıklama',
  icon: '🎯',
  xpReward: 10,
  coinReward: 5,
  type: 'daily',
  target: 1,
  sortOrder: 6,
}
```

2. **Seed'i çalıştır**:
```bash
pnpm tsx prisma/seeds/gamification.seed.ts
```

3. **İlgili action'a entegre et**:
```typescript
try {
  const { updateQuestProgress } = await import('@/services/gamification.service')
  await updateQuestProgress(session.user.id, 'daily_new_quest', 1)
  console.log('✅ Quest progress updated: daily_new_quest')
} catch (error) {
  console.error('❌ Gamification error:', error)
}
```

## 🐛 Sorun Giderme

### Görev ilerlemiyor
1. Terminal'de (server console) log'ları kontrol et
2. `✅ Quest progress updated: quest_key` mesajını ara
3. Yoksa entegrasyon eksik demektir

### Görev sıfırlanmıyor
1. 🔄 Sıfırla butonuna tıkla
2. Veya database'den manuel sil:
```sql
DELETE FROM user_daily_quests WHERE date >= CURDATE();
```

### Test endpoint çalışmıyor
1. Giriş yapmış olduğundan emin ol
2. Development ortamında olduğundan emin ol
3. Quest key'in doğru olduğundan emin ol

## 📈 İstatistikler

- **Toplam Görev:** 5
- **Entegre Edildi:** 3 (60%)
- **Kalan:** 2 (40%)
- **Çalışan:** ❤️ Beğen, 💬 Yorum, ⚖️ Tartıl
- **Eksik:** ✅ Check-in, 💧 Su

## 🚀 Sonraki Adımlar

1. ✅ Check-in sistemi ekle
2. 💧 Su takibi sistemi ekle
3. 📊 Görev istatistikleri dashboard'a ekle
4. 🏆 Görev streak sistemi ekle (7 gün üst üste tamamlama)
5. 🎁 Bonus ödüller ekle (tüm görevleri tamamlayınca)

## ✅ Sonuç

Görevler sistemi **%60 tamamlandı** ve çalışıyor! 

Kullanıcılar artık:
- ❤️ Beğeni yaparak
- 💬 Yorum yazarak  
- ⚖️ Kilo kaydederek

günlük görevlerini tamamlayıp XP ve Coin kazanabilirler! 🎉
