# 🔔 Appeal System (İtiraz Sistemi) Dokümantasyonu

## 📋 Genel Bakış

Appeal System, kullanıcıların reddedilen içeriklerine itiraz etmelerini sağlayan kapsamlı bir sistemdir. Sistem, reputation bazlı önceliklendirme, admin yönetim paneli ve otomatik bildirimler içerir.

## 🗄️ Veritabanı Modeli

### ContentAppeal Model

```prisma
model ContentAppeal {
  id            String        @id @default(cuid())
  userId        String
  contentType   AppealContent // plan, recipe, comment, etc.
  contentId     String
  reason        String        @db.Text
  status        AppealStatus  @default(pending)
  priority      Int           @default(0) // calculated from user reputation
  adminNote     String?       @db.Text
  resolvedBy    String?
  resolvedAt    DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  resolver      User?         @relation("AppealResolver", fields: [resolvedBy], references: [id], onDelete: SetNull)

  @@index([userId, createdAt])
  @@index([status, priority])
  @@index([contentType, contentId])
  @@index([createdAt])
  @@map("content_appeals")
}

enum AppealContent {
  plan
  recipe
  comment
  recipe_comment
  group_post
}

enum AppealStatus {
  pending
  under_review
  approved
  rejected
}
```

## 🔌 API Endpoints

### 1. İtiraz Oluşturma
**POST** `/api/appeals`

**Request Body:**
```json
{
  "contentType": "plan",
  "contentId": "clx123...",
  "reason": "İçeriğim topluluk kurallarına uygun..."
}
```

**Validasyon:**
- `reason`: Minimum 20, maksimum 1000 karakter
- Sadece reddedilen/gizlenmiş içerikler için itiraz edilebilir
- Kullanıcı sadece kendi içeriğine itiraz edebilir
- Aynı içerik için bekleyen itiraz varsa yeni itiraz oluşturulamaz

**Response:**
```json
{
  "id": "clx123...",
  "userId": "user123",
  "contentType": "plan",
  "contentId": "plan123",
  "reason": "...",
  "status": "pending",
  "priority": 75,
  "createdAt": "2024-01-01T00:00:00Z",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "username": "johndoe",
    "reputationScore": 75
  }
}
```

### 2. İtirazları Listeleme
**GET** `/api/appeals`

**Query Parameters:**
- `status`: pending | under_review | approved | rejected
- `contentType`: plan | recipe | comment | recipe_comment | group_post
- `page`: Sayfa numarası (default: 1)
- `limit`: Sayfa başına kayıt (default: 20)

**Yetki:**
- Normal kullanıcılar: Sadece kendi itirazlarını görür
- Admin: Tüm itirazları görür

**Response:**
```json
{
  "appeals": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### 3. Tek İtiraz Detayı
**GET** `/api/appeals/[id]`

**Yetki:**
- İtiraz sahibi veya admin

### 4. İtiraz Çözümleme (Admin)
**PATCH** `/api/appeals/[id]`

**Request Body:**
```json
{
  "status": "approved",
  "adminNote": "İçerik uygun bulundu ve yayınlandı"
}
```

**İşlemler:**
- İtiraz durumu güncellenir
- Onaylanırsa içerik otomatik yayınlanır
- Kullanıcıya bildirim gönderilir
- Onaylanırsa kullanıcı reputation'ı +5 artar

### 5. İtiraz İptali
**DELETE** `/api/appeals/[id]`

**Yetki:**
- Sadece itiraz sahibi
- Sadece pending durumundaki itirazlar iptal edilebilir

## 🎨 UI Bileşenleri

### 1. Admin Panel - İtiraz Yönetimi
**Sayfa:** `/admin/itirazlar`

**Özellikler:**
- İstatistik kartları (Beklemede, İnceleniyor, Onaylandı, Reddedildi)
- Filtreleme (Durum, İçerik Tipi)
- Arama (Kullanıcı adı, sebep)
- Öncelik bazlı sıralama
- Detaylı inceleme modal'ı
- Onaylama/Reddetme işlemleri
- Admin notu ekleme

**Öncelik Renklendirmesi:**
- 75-100: Kırmızı (Yüksek öncelik)
- 50-74: Turuncu (Orta-yüksek öncelik)
- 25-49: Sarı (Orta öncelik)
- 0-24: Gri (Düşük öncelik)

### 2. Kullanıcı Paneli - İtirazlarım
**Sayfa:** `/dashboard/itirazlarim`

**Özellikler:**
- Kendi itirazlarını görüntüleme
- İstatistik kartları
- İtiraz detayları
- Admin yanıtlarını görme
- Pending itirazları iptal etme

### 3. AppealButton Component
**Kullanım:**
```tsx
<AppealButton
  contentType="plan"
  contentId="plan123"
  isRejected={true}
  onAppealCreated={() => {
    // Callback after appeal created
  }}
/>
```

**Özellikler:**
- Modal form
- Karakter sayacı (20-1000)
- Validasyon
- Hata yönetimi
- Başarı bildirimi

## 🔄 İş Akışı

### Kullanıcı Tarafı:
1. İçerik reddedilir
2. Kullanıcı "İtiraz Et" butonuna tıklar
3. İtiraz sebebini yazar (min 20 karakter)
4. İtiraz gönderilir
5. Sistem otomatik öncelik hesaplar (reputation bazlı)
6. Kullanıcı `/dashboard/itirazlarim` sayfasından takip eder

### Admin Tarafı:
1. Admin `/admin/itirazlar` sayfasına girer
2. İtirazlar öncelik sırasına göre listelenir
3. Admin itirazı inceler
4. Karar verir (Onayla/Reddet)
5. Opsiyonel admin notu ekler
6. Sistem otomatik işlemleri yapar:
   - İçeriği yayınlar (onaylanırsa)
   - Kullanıcıya bildirim gönderir
   - Reputation günceller (onaylanırsa +5)

## 🎯 Öncelik Hesaplama

İtiraz önceliği kullanıcının reputation skoruna göre hesaplanır:

```typescript
const priority = Math.min(100, Math.max(0, user.reputationScore || 0));
```

- Yüksek reputation = Yüksek öncelik
- Düşük reputation = Düşük öncelik
- Min: 0, Max: 100

## 📧 Bildirimler

### İtiraz Onaylandı:
```
Başlık: "İtirazınız Onaylandı"
İçerik: "{contentType} içeriğinize yaptığınız itiraz onaylandı ve içeriğiniz yayınlandı."
```

### İtiraz Reddedildi:
```
Başlık: "İtirazınız Reddedildi"
İçerik: "{contentType} içeriğinize yaptığınız itiraz reddedildi. Sebep: {adminNote}"
```

## 🔒 Güvenlik ve Validasyon

### Kullanıcı Kısıtlamaları:
- ✅ Sadece kendi içeriğine itiraz edebilir
- ✅ Sadece reddedilen/gizlenmiş içeriğe itiraz edebilir
- ✅ Aynı içerik için sadece 1 aktif itiraz
- ✅ Sadece pending itirazları iptal edebilir

### Admin Kısıtlamaları:
- ✅ Sadece ADMIN rolü itiraz çözümleyebilir
- ✅ Sadece pending/under_review itirazlar çözümlenebilir
- ✅ Çözümlenen itirazlar tekrar çözümlenemez

### Validasyon:
- İtiraz sebebi: 20-1000 karakter
- Content type: Enum kontrolü
- Content ID: Veritabanında varlık kontrolü
- Status: Enum kontrolü

## 📊 İstatistikler

Admin dashboard'da gösterilen istatistikler:

```typescript
{
  pending: number,        // Bekleyen itirazlar
  underReview: number,    // İncelenen itirazlar
  approved: number,       // Onaylanan itirazlar
  rejected: number        // Reddedilen itirazlar
}
```

## 🚀 Migration

Schema değişikliklerini uygulamak için:

```bash
# Migration oluştur (--create-only ile önce kontrol et)
npx prisma migrate dev --create-only --name add_appeal_system

# Migration dosyasını incele
# Onayladıktan sonra uygula:
npx prisma migrate dev

# Prisma Client'ı güncelle
npx prisma generate
```

## 🔗 İlgili Dosyalar

### API Routes:
- `/src/app/api/appeals/route.ts` - Liste ve oluşturma
- `/src/app/api/appeals/[id]/route.ts` - Detay, güncelleme, silme

### UI Pages:
- `/src/app/admin/itirazlar/page.tsx` - Admin panel
- `/src/app/dashboard/itirazlarim/page.tsx` - Kullanıcı paneli

### Components:
- `/src/components/appeal-button.tsx` - İtiraz butonu

### Database:
- `/prisma/schema.prisma` - ContentAppeal modeli

### Actions:
- `/src/app/admin/actions.ts` - Admin istatistikleri

## 💡 Kullanım Örnekleri

### Plan Sayfasında İtiraz Butonu Eklemek:

```tsx
import AppealButton from "@/components/appeal-button";

// Plan detay sayfasında
{plan.status === "rejected" && plan.authorId === session?.user?.id && (
  <AppealButton
    contentType="plan"
    contentId={plan.id}
    isRejected={true}
    onAppealCreated={() => {
      router.refresh();
    }}
  />
)}
```

### Yorum Sayfasında İtiraz Butonu:

```tsx
{comment.status === "hidden" && comment.authorId === session?.user?.id && (
  <AppealButton
    contentType="comment"
    contentId={comment.id}
    isRejected={true}
  />
)}
```

## 🎨 Stil ve Tasarım

### Renk Kodları:
- Pending: Sarı (`bg-yellow-100 text-yellow-800`)
- Under Review: Mavi (`bg-blue-100 text-blue-800`)
- Approved: Yeşil (`bg-green-100 text-green-800`)
- Rejected: Kırmızı (`bg-red-100 text-red-800`)

### İkonlar:
- Pending: `<Clock />`
- Under Review: `<Eye />`
- Approved: `<CheckCircle />`
- Rejected: `<XCircle />`
- Appeal: `<MessageSquare />`
- Alert: `<AlertCircle />`

## 🐛 Hata Yönetimi

### Yaygın Hatalar:

1. **"Content not found"**
   - İçerik silinmiş veya ID yanlış

2. **"Can only appeal rejected/hidden content"**
   - İçerik zaten yayında veya draft durumunda

3. **"You already have a pending appeal"**
   - Aynı içerik için bekleyen itiraz var

4. **"Appeal already resolved"**
   - İtiraz zaten çözümlenmiş, tekrar işlem yapılamaz

5. **"Reason must be at least 20 characters"**
   - İtiraz sebebi çok kısa

## 📈 Gelecek Geliştirmeler

- [ ] İtiraz geçmişi ve istatistikleri
- [ ] Toplu itiraz işlemleri (admin)
- [ ] İtiraz şablonları
- [ ] E-posta bildirimleri
- [ ] İtiraz süresi limiti (örn: 30 gün)
- [ ] İtiraz hakkı limiti (örn: ayda 5 itiraz)
- [ ] Otomatik AI moderasyon entegrasyonu
- [ ] İtiraz başarı oranı istatistikleri

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Dokümantasyon: Bu dosya
- Admin Panel: `/admin/itirazlar`
