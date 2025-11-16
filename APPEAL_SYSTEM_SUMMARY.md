# 🎯 Appeal Queue System - Hızlı Özet

## ✅ Tamamlanan İşler

### 1. Veritabanı (Prisma Schema)
- ✅ `ContentAppeal` modeli eklendi
- ✅ `AppealContent` enum (plan, recipe, comment, recipe_comment, group_post)
- ✅ `AppealStatus` enum (pending, under_review, approved, rejected)
- ✅ User ilişkileri (appeals, resolvedAppeals)
- ✅ Index'ler (userId+createdAt, status+priority, contentType+contentId, createdAt)
- ✅ Foreign key constraints

### 2. API Routes
- ✅ `POST /api/appeals` - İtiraz oluşturma
- ✅ `GET /api/appeals` - İtiraz listesi (filtreleme, pagination)
- ✅ `GET /api/appeals/[id]` - Tek itiraz detayı
- ✅ `PATCH /api/appeals/[id]` - İtiraz çözümleme (admin)
- ✅ `DELETE /api/appeals/[id]` - İtiraz iptal etme

### 3. Admin Panel
- ✅ `/admin/itirazlar` sayfası
- ✅ İstatistik kartları (Beklemede, İnceleniyor, Onaylandı, Reddedildi)
- ✅ Filtreleme (Durum, İçerik Tipi)
- ✅ Arama (Kullanıcı, Sebep)
- ✅ Öncelik bazlı sıralama
- ✅ Detaylı inceleme modal'ı
- ✅ Onaylama/Reddetme işlemleri
- ✅ Admin notu ekleme
- ✅ Admin dashboard'a link eklendi

### 4. Kullanıcı Paneli
- ✅ `/dashboard/itirazlarim` sayfası
- ✅ Kişisel itiraz listesi
- ✅ İstatistik kartları
- ✅ İtiraz detayları
- ✅ Admin yanıtlarını görme
- ✅ İtiraz iptal etme
- ✅ Dashboard'a link eklendi

### 5. Components
- ✅ `AppealButton` component
- ✅ Modal form
- ✅ Karakter sayacı (20-1000)
- ✅ Validasyon
- ✅ Hata yönetimi

### 6. Otomatik İşlemler
- ✅ Onaylanan içeriklerin otomatik yayınlanması
- ✅ Kullanıcılara bildirim gönderimi
- ✅ Reputation güncelleme (+5 onaylanırsa)
- ✅ Öncelik hesaplama (reputation bazlı)

### 7. Dokümantasyon
- ✅ `APPEAL_SYSTEM.md` - Detaylı dokümantasyon
- ✅ `MIGRATION_APPEAL_SYSTEM.md` - Migration rehberi
- ✅ `APPEAL_SYSTEM_README.md` - Kurulum kılavuzu
- ✅ `APPEAL_SYSTEM_SUMMARY.md` - Bu dosya
- ✅ `src/types/appeal.ts` - TypeScript tipleri

## 📦 Oluşturulan Dosyalar

```
Toplam: 11 dosya

Backend:
├── src/app/api/appeals/route.ts
├── src/app/api/appeals/[id]/route.ts
└── src/app/admin/actions.ts (güncellendi)

Frontend:
├── src/app/admin/itirazlar/page.tsx
├── src/app/dashboard/itirazlarim/page.tsx
├── src/app/admin/page.tsx (güncellendi)
└── src/app/dashboard/page.tsx (güncellendi)

Components:
└── src/components/appeal-button.tsx

Database:
└── prisma/schema.prisma (güncellendi)

Types:
└── src/types/appeal.ts

Documentation:
├── APPEAL_SYSTEM.md
├── MIGRATION_APPEAL_SYSTEM.md
├── APPEAL_SYSTEM_README.md
└── APPEAL_SYSTEM_SUMMARY.md
```

## 🚀 Sonraki Adımlar

### 1. Migration Uygulama (ÖNEMLİ!)

```bash
# 1. Yedek al
mysqldump -u root -p zayiflamaplan > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Migration oluştur ve incele
npx prisma migrate dev --create-only --name add_appeal_system

# 3. Migration dosyasını kontrol et
# prisma/migrations/ klasöründe

# 4. Migration'ı uygula
npx prisma migrate dev

# 5. Prisma Client'ı güncelle
npx prisma generate

# 6. Sunucuyu yeniden başlat
npm run dev
```

### 2. İçerik Sayfalarına Buton Ekleme

Reddedilen içeriklerin gösterildiği sayfalara `AppealButton` ekleyin:

**Plan Sayfası:**
```tsx
// src/app/plan/[slug]/page.tsx
import AppealButton from "@/components/appeal-button";

{plan.status === "rejected" && plan.authorId === session?.user?.id && (
  <AppealButton
    contentType="plan"
    contentId={plan.id}
    isRejected={true}
  />
)}
```

**Tarif Sayfası:**
```tsx
// src/app/tarif/[slug]/page.tsx
{recipe.status === "rejected" && recipe.authorId === session?.user?.id && (
  <AppealButton
    contentType="recipe"
    contentId={recipe.id}
    isRejected={true}
  />
)}
```

**Yorum Bileşeni:**
```tsx
// Yorum component'inde
{comment.status === "hidden" && comment.authorId === session?.user?.id && (
  <AppealButton
    contentType="comment"
    contentId={comment.id}
    isRejected={true}
  />
)}
```

### 3. Test Etme

```bash
# 1. Sunucuyu başlat
npm run dev

# 2. Admin paneline git
http://localhost:3000/admin/itirazlar

# 3. Kullanıcı paneline git
http://localhost:3000/dashboard/itirazlarim

# 4. Test senaryoları:
- Bir plan oluştur ve reddet
- İtiraz et
- Admin olarak onayla/reddet
- Bildirimleri kontrol et
```

## 🎯 Özellikler

### Kullanıcı İçin:
- 📝 Reddedilen içeriğe itiraz etme
- 👁️ İtiraz durumunu takip etme
- 💬 Admin yanıtlarını görme
- ❌ Bekleyen itirazı iptal etme
- 📊 İtiraz istatistikleri

### Admin İçin:
- 📋 Tüm itirazları görme
- 🔍 Filtreleme ve arama
- 🎯 Öncelik bazlı sıralama
- ✅ Onaylama/Reddetme
- 📝 Admin notu ekleme
- 📊 İstatistik dashboard'u

### Otomatik:
- 🤖 İçerik otomatik yayınlanır (onaylanırsa)
- 📧 Bildirim gönderilir
- ⭐ Reputation güncellenir (+5)
- 🎯 Öncelik hesaplanır (reputation bazlı)

## 📊 Veritabanı

### Yeni Tablo: content_appeals

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | String | Benzersiz ID |
| userId | String | İtiraz eden kullanıcı |
| contentType | Enum | İçerik tipi |
| contentId | String | İçerik ID'si |
| reason | Text | İtiraz sebebi |
| status | Enum | Durum |
| priority | Int | Öncelik (0-100) |
| adminNote | Text | Admin notu |
| resolvedBy | String | Çözümleyen admin |
| resolvedAt | DateTime | Çözüm tarihi |
| createdAt | DateTime | Oluşturulma |
| updatedAt | DateTime | Güncellenme |

### Index'ler:
- userId + createdAt
- status + priority
- contentType + contentId
- createdAt

## 🔐 Güvenlik

### Validasyon:
- ✅ İtiraz sebebi: 20-1000 karakter
- ✅ Sadece kendi içeriğine itiraz
- ✅ Sadece reddedilen içeriğe itiraz
- ✅ Aynı içerik için 1 aktif itiraz
- ✅ Sadece admin çözümleyebilir

### Yetkilendirme:
- ✅ Kullanıcı: Kendi itirazlarını görür
- ✅ Admin: Tüm itirazları görür ve yönetir
- ✅ Çözümlenen itirazlar değiştirilemez

## 📈 İstatistikler

Admin dashboard'da:
- Beklemede: X itiraz
- İnceleniyor: X itiraz
- Onaylandı: X itiraz
- Reddedildi: X itiraz

## 🎨 UI/UX

### Renkler:
- 🟡 Pending: Sarı
- 🔵 Under Review: Mavi
- 🟢 Approved: Yeşil
- 🔴 Rejected: Kırmızı

### Öncelik:
- 🔴 75-100: Yüksek (Kırmızı)
- 🟠 50-74: Orta-Yüksek (Turuncu)
- 🟡 25-49: Orta (Sarı)
- ⚪ 0-24: Düşük (Gri)

## ✅ Kontrol Listesi

Kurulum sonrası kontrol edin:

- [ ] ⚠️ Veritabanı yedeği alındı
- [ ] 🗄️ Migration uygulandı
- [ ] 📊 Tablo oluşturuldu
- [ ] 🔗 Index'ler eklendi
- [ ] 🔌 API çalışıyor
- [ ] 👨‍💼 Admin paneli erişilebilir
- [ ] 👤 Kullanıcı paneli erişilebilir
- [ ] 🧪 Test edildi

## 📞 Yardım

Sorun yaşarsanız:

1. **Dokümantasyon:** `APPEAL_SYSTEM.md`
2. **Migration:** `MIGRATION_APPEAL_SYSTEM.md`
3. **Kurulum:** `APPEAL_SYSTEM_README.md`
4. **Loglar:** Sunucu loglarını kontrol edin
5. **Rollback:** Yedekten geri yükleyin

## 🎉 Başarılı!

Appeal Queue sistemi hazır! Artık:
- ✅ Kullanıcılar itiraz edebilir
- ✅ Adminler yönetebilir
- ✅ Sistem otomatik çalışır

---

**Önemli:** Migration'ı uygulamadan önce mutlaka yedek alın!

**Sonraki:** İçerik sayfalarına `AppealButton` ekleyin ve test edin.
