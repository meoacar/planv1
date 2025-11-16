# 🔔 Appeal Queue System - Kurulum ve Kullanım Kılavuzu

## 📦 Neler Eklendi?

Appeal Queue (İtiraz Kuyruğu) sistemi başarıyla projenize entegre edildi! Bu sistem kullanıcıların reddedilen içeriklerine itiraz etmelerini ve adminlerin bu itirazları yönetmesini sağlar.

## 🎯 Özellikler

### ✨ Kullanıcı Özellikleri
- ✅ Reddedilen içeriklere itiraz etme
- ✅ İtiraz durumunu takip etme
- ✅ Admin yanıtlarını görüntüleme
- ✅ Bekleyen itirazları iptal etme
- ✅ İtiraz geçmişini görüntüleme

### 🛡️ Admin Özellikleri
- ✅ Tüm itirazları görüntüleme ve yönetme
- ✅ Reputation bazlı önceliklendirme
- ✅ Filtreleme ve arama
- ✅ İtirazları onaylama/reddetme
- ✅ Admin notu ekleme
- ✅ İstatistik dashboard'u

### 🤖 Otomatik İşlemler
- ✅ Onaylanan içeriklerin otomatik yayınlanması
- ✅ Kullanıcılara otomatik bildirim gönderimi
- ✅ Reputation puanı güncelleme (+5 onaylanırsa)
- ✅ Öncelik hesaplama (reputation bazlı)

## 📁 Eklenen Dosyalar

### Backend (API Routes)
```
src/app/api/appeals/
├── route.ts              # Liste ve oluşturma
└── [id]/route.ts         # Detay, güncelleme, silme
```

### Frontend (UI Pages)
```
src/app/admin/itirazlar/
└── page.tsx              # Admin yönetim paneli

src/app/dashboard/itirazlarim/
└── page.tsx              # Kullanıcı itiraz sayfası
```

### Components
```
src/components/
└── appeal-button.tsx     # İtiraz butonu component
```

### Database
```
prisma/
└── schema.prisma         # ContentAppeal modeli eklendi
```

### Documentation
```
APPEAL_SYSTEM.md                # Detaylı dokümantasyon
MIGRATION_APPEAL_SYSTEM.md      # Migration talimatları
APPEAL_SYSTEM_README.md         # Bu dosya
```

## 🚀 Kurulum Adımları

### 1. Veritabanı Yedeği Alın (ÇOK ÖNEMLİ!)

```bash
mysqldump -u root -p zayiflamaplan > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Migration Oluşturun ve İnceleyin

```bash
# Migration dosyasını oluştur (henüz uygulamadan)
npx prisma migrate dev --create-only --name add_appeal_system
```

### 3. Migration Dosyasını Kontrol Edin

`prisma/migrations/` klasöründeki yeni migration dosyasını açın ve SQL komutlarını inceleyin.

### 4. Migration'ı Uygulayın

```bash
# Migration'ı uygula
npx prisma migrate dev

# Prisma Client'ı güncelle
npx prisma generate
```

### 5. Sunucuyu Yeniden Başlatın

```bash
npm run dev
```

## 🎨 Kullanım Örnekleri

### 1. Plan Sayfasında İtiraz Butonu Eklemek

```tsx
import AppealButton from "@/components/appeal-button";

// Plan detay sayfasında (src/app/plan/[slug]/page.tsx)
export default function PlanPage({ params }) {
  // ... plan verilerini çek
  
  return (
    <div>
      {/* Plan içeriği */}
      
      {/* Eğer plan reddedildiyse ve kullanıcı plan sahibiyse */}
      {plan.status === "rejected" && 
       plan.authorId === session?.user?.id && (
        <AppealButton
          contentType="plan"
          contentId={plan.id}
          isRejected={true}
          onAppealCreated={() => {
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
```

### 2. Tarif Sayfasında İtiraz Butonu

```tsx
{recipe.status === "rejected" && 
 recipe.authorId === session?.user?.id && (
  <AppealButton
    contentType="recipe"
    contentId={recipe.id}
    isRejected={true}
  />
)}
```

### 3. Yorum için İtiraz Butonu

```tsx
{comment.status === "hidden" && 
 comment.authorId === session?.user?.id && (
  <AppealButton
    contentType="comment"
    contentId={comment.id}
    isRejected={true}
  />
)}
```

## 🔗 Erişim Linkleri

### Admin Panel
```
http://localhost:3000/admin/itirazlar
```

Admin dashboard'dan da erişilebilir:
- Ana sayfa → "İtirazları İncele" butonu

### Kullanıcı Paneli
```
http://localhost:3000/dashboard/itirazlarim
```

Dashboard'dan da erişilebilir:
- Hızlı İşlemler → "İtirazlarım" butonu

## 📊 Veritabanı Yapısı

### ContentAppeal Tablosu

| Alan | Tip | Açıklama |
|------|-----|----------|
| id | String | Benzersiz ID |
| userId | String | İtiraz eden kullanıcı |
| contentType | Enum | İçerik tipi (plan, recipe, comment, vb.) |
| contentId | String | İçerik ID'si |
| reason | Text | İtiraz sebebi (20-1000 karakter) |
| status | Enum | Durum (pending, under_review, approved, rejected) |
| priority | Int | Öncelik (0-100, reputation bazlı) |
| adminNote | Text | Admin notu (opsiyonel) |
| resolvedBy | String | Çözümleyen admin ID'si |
| resolvedAt | DateTime | Çözüm tarihi |
| createdAt | DateTime | Oluşturulma tarihi |
| updatedAt | DateTime | Güncellenme tarihi |

### Index'ler
- `userId + createdAt` - Kullanıcı itirazları
- `status + priority` - Öncelikli sıralama
- `contentType + contentId` - İçerik bazlı sorgular
- `createdAt` - Tarih bazlı sıralama

## 🔐 Güvenlik

### Kullanıcı Kısıtlamaları
- Sadece kendi içeriğine itiraz edebilir
- Sadece reddedilen/gizlenmiş içeriğe itiraz edebilir
- Aynı içerik için sadece 1 aktif itiraz
- Sadece pending itirazları iptal edebilir

### Admin Kısıtlamaları
- Sadece ADMIN rolü itiraz çözümleyebilir
- Sadece pending/under_review itirazlar çözümlenebilir
- Çözümlenen itirazlar tekrar çözümlenemez

## 🎯 İş Akışı

```
1. İçerik Reddedilir
   ↓
2. Kullanıcı İtiraz Eder
   ↓
3. Sistem Öncelik Hesaplar (Reputation Bazlı)
   ↓
4. Admin İtirazı İnceler
   ↓
5. Admin Karar Verir (Onayla/Reddet)
   ↓
6. Sistem Otomatik İşlemleri Yapar:
   - İçeriği yayınlar (onaylanırsa)
   - Bildirim gönderir
   - Reputation günceller (+5 onaylanırsa)
```

## 📈 İstatistikler

Admin dashboard'da gösterilen metrikler:
- **Beklemede**: Henüz incelenmemiş itirazlar
- **İnceleniyor**: Şu anda incelenen itirazlar
- **Onaylandı**: Kabul edilen itirazlar
- **Reddedildi**: Reddedilen itirazlar

## 🎨 UI Özellikleri

### Admin Panel
- 📊 İstatistik kartları
- 🔍 Filtreleme (Durum, İçerik Tipi)
- 🔎 Arama (Kullanıcı, Sebep)
- 🎯 Öncelik bazlı sıralama
- 📝 Detaylı inceleme modal'ı
- ✅ Onaylama/Reddetme
- 📄 Admin notu ekleme

### Kullanıcı Panel
- 📊 Kişisel istatistikler
- 📋 İtiraz listesi
- 👁️ Detay görüntüleme
- 💬 Admin yanıtlarını görme
- ❌ İtiraz iptal etme

## 🧪 Test Senaryoları

### 1. İtiraz Oluşturma Testi
```bash
# 1. Bir plan oluştur
# 2. Admin olarak planı reddet
# 3. Kullanıcı olarak itiraz et
# 4. İtirazın oluşturulduğunu kontrol et
```

### 2. Admin Onaylama Testi
```bash
# 1. Bekleyen bir itiraz seç
# 2. Admin panelinden onayla
# 3. İçeriğin yayınlandığını kontrol et
# 4. Kullanıcıya bildirim gittiğini kontrol et
# 5. Reputation'ın arttığını kontrol et
```

### 3. Admin Reddetme Testi
```bash
# 1. Bekleyen bir itiraz seç
# 2. Admin notu ekle
# 3. Reddet
# 4. İçeriğin hala reddedilmiş olduğunu kontrol et
# 5. Kullanıcıya bildirim gittiğini kontrol et
```

## 🐛 Sorun Giderme

### Sorun: "Table already exists"
**Çözüm:**
```bash
# Tabloyu kontrol et
mysql -u root -p -e "SHOW TABLES LIKE 'content_appeals';" zayiflamaplan

# Eğer boşsa sil ve migration'ı tekrar çalıştır
mysql -u root -p -e "DROP TABLE IF EXISTS content_appeals;" zayiflamaplan
npx prisma migrate dev
```

### Sorun: API 404 Hatası
**Çözüm:**
```bash
# Sunucuyu yeniden başlat
npm run dev

# Route dosyalarının doğru yerde olduğunu kontrol et
ls -la src/app/api/appeals/
```

### Sorun: Prisma Client Hatası
**Çözüm:**
```bash
# Prisma Client'ı temizle ve yeniden oluştur
rm -rf node_modules/.prisma
npx prisma generate
npm run dev
```

## 📚 Dokümantasyon

Detaylı bilgi için:
- **[APPEAL_SYSTEM.md](./APPEAL_SYSTEM.md)** - Tam dokümantasyon
- **[MIGRATION_APPEAL_SYSTEM.md](./MIGRATION_APPEAL_SYSTEM.md)** - Migration rehberi

## ✅ Kontrol Listesi

Migration sonrası kontrol edin:

- [ ] Veritabanı yedeği alındı
- [ ] Migration başarıyla uygulandı
- [ ] `content_appeals` tablosu oluşturuldu
- [ ] Index'ler eklendi
- [ ] Foreign key'ler kuruldu
- [ ] API endpoint'leri çalışıyor
- [ ] Admin paneli erişilebilir
- [ ] Kullanıcı paneli erişilebilir
- [ ] İtiraz oluşturma çalışıyor
- [ ] İtiraz onaylama çalışıyor
- [ ] İtiraz reddetme çalışıyor
- [ ] Bildirimler gönderiliyor
- [ ] Reputation güncelleniyor

## 🎉 Tamamlandı!

Appeal Queue sistemi başarıyla kuruldu! Artık kullanıcılar reddedilen içeriklerine itiraz edebilir ve adminler bu itirazları yönetebilir.

### Sonraki Adımlar:
1. ✅ İçerik sayfalarına `AppealButton` ekleyin
2. ✅ Admin ekibini bilgilendirin
3. ✅ Kullanıcılara duyuru yapın
4. ✅ İlk itirazları test edin

## 📞 Destek

Sorularınız için:
- 📖 Dokümantasyon: `APPEAL_SYSTEM.md`
- 🔧 Migration: `MIGRATION_APPEAL_SYSTEM.md`
- 💻 Admin Panel: `/admin/itirazlar`

---

**Not:** Bu sistem reputation bazlı önceliklendirme kullanır. Yüksek reputation'a sahip kullanıcıların itirazları öncelikli olarak incelenir.
