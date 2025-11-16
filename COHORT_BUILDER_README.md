# Cohort Builder - Kullanıcı Segmentasyonu Sistemi

## 📋 Genel Bakış

Cohort Builder, kullanıcıları belirli özelliklere göre segmentlere ayırmanızı ve retention (tutunma) analizleri yapmanızı sağlayan güçlü bir analytics aracıdır.

## 🎯 Özellikler

### 1. Kullanıcı Segmentasyonu
Kullanıcıları çeşitli kriterlere göre gruplara ayırın:
- **XP & Level**: Minimum XP veya level gereksinimleri
- **İçerik Üretimi**: Tarif/plan sayısı
- **Aktivite**: Son aktif olma zamanı
- **Kayıt Tarihi**: Belirli bir süre içinde kayıt olanlar
- **Streak**: Günlük giriş serisi
- **Lonca Üyeliği**: Lonca üyesi olan/olmayan
- **Rol**: USER, STAFF, MODERATOR, ADMIN

### 2. Retention Metrikleri
Cohort'ların zaman içindeki tutunma oranlarını takip edin:
- Gün 1, 7, 30, 90 retention oranları
- Kullanıcı kaybı analizi
- Trend görselleştirme

### 3. Export & Raporlama
- CSV formatında kullanıcı listesi export
- Detaylı kullanıcı istatistikleri
- Email kampanyaları için hazır listeler

## 🚀 Kullanım

### Admin Panel'den Erişim
1. Admin Panel → Cohorts menüsüne gidin
2. "Yeni Cohort" butonuna tıklayın
3. Cohort adı ve filtrelerini tanımlayın
4. "Oluştur" butonuna tıklayın

### Örnek Cohort Tanımları

#### 1. Aktif Tarif Paylaşanlar
```json
{
  "name": "Aktif Tarif Paylaşanlar",
  "description": "Son 30 günde 5+ tarif paylaşan kullanıcılar",
  "filters": {
    "recipesCount": { "gte": 5 },
    "lastActiveDays": 30
  }
}
```

#### 2. Yüksek Seviye Kullanıcılar
```json
{
  "name": "Yüksek Seviye Kullanıcılar",
  "description": "Level 10+ ve 1000+ XP",
  "filters": {
    "level": { "gte": 10 },
    "xp": { "gte": 1000 }
  }
}
```

#### 3. Lonca Liderleri
```json
{
  "name": "Lonca Liderleri",
  "description": "Lonca üyesi olan aktif kullanıcılar",
  "filters": {
    "hasGuild": true,
    "xp": { "gte": 500 },
    "lastActiveDays": 7
  }
}
```

#### 4. Yeni Kayıtlar
```json
{
  "name": "Yeni Kayıtlar",
  "description": "Son 7 günde kayıt olan kullanıcılar",
  "filters": {
    "registeredDays": 7
  }
}
```

#### 5. Pasif Kullanıcılar
```json
{
  "name": "Pasif Kullanıcılar",
  "description": "30-60 gün arası aktif olmayan ama daha önce aktifti",
  "filters": {
    "lastActiveDays": 60,
    "xp": { "gte": 100 }
  }
}
```

## 📊 API Endpoints

### GET /api/admin/cohorts
Tüm cohort'ları listele
```typescript
Response: {
  cohorts: Array<{
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    _count: { users: number };
  }>
}
```

### POST /api/admin/cohorts
Yeni cohort oluştur
```typescript
Request: {
  name: string;
  description?: string;
  filters: {
    xp?: { gte?: number; lte?: number };
    level?: { gte?: number; lte?: number };
    recipesCount?: { gte?: number; lte?: number };
    plansCount?: { gte?: number; lte?: number };
    lastActiveDays?: number;
    registeredDays?: number;
    streak?: { gte?: number; lte?: number };
    hasGuild?: boolean;
    role?: 'USER' | 'STAFF' | 'MODERATOR' | 'ADMIN';
  }
}
```

### GET /api/admin/cohorts/[id]
Cohort detaylarını getir (kullanıcılar + metrikler dahil)

### DELETE /api/admin/cohorts/[id]
Cohort'u sil

### PATCH /api/admin/cohorts/[id]
Cohort'u güncelle

### POST /api/admin/cohorts/[id]/refresh
Cohort kullanıcılarını yeniden hesapla

### GET /api/admin/cohorts/[id]/export
Cohort kullanıcılarını CSV olarak export et

## 🎨 UI Özellikleri

### Cohort Listesi
- Grid layout ile cohort kartları
- Kullanıcı sayısı gösterimi
- Aktif/Pasif durumu
- Hızlı aksiyonlar (Export, Refresh, Delete)

### Cohort Detay Sayfası
- Toplam kullanıcı sayısı
- Ortalama XP ve Level
- Filtre detayları
- Retention metrikleri (varsa)
- Kullanıcı listesi tablosu
- Export ve Refresh butonları

### Cohort Oluşturma Modal
- İsim ve açıklama alanları
- Dinamik filtre seçenekleri
- Gerçek zamanlı validasyon

## 💡 Kullanım Senaryoları

### 1. Email Kampanyaları
```
Cohort: "Pasif Kullanıcılar"
Aksiyon: Export → Email listesi → "Seni özledik" kampanyası
```

### 2. Feature Rollout
```
Cohort: "Beta Testerlar" (Level 15+, Aktif)
Aksiyon: Feature flag ile yeni özelliği sadece bu gruba aç
```

### 3. Retention Analizi
```
Cohort: "Ocak 2025 Kayıtları"
Aksiyon: 7/30/90 gün retention oranlarını takip et
```

### 4. Churn Prevention
```
Cohort: "Risk Altındaki Kullanıcılar" (30+ gün pasif)
Aksiyon: Özel indirim kodu gönder
```

### 5. Gamification Optimizasyonu
```
Cohort: "Düşük Engagement" (Streak < 3, XP < 100)
Aksiyon: Görev zorluğunu azalt, ödülleri artır
```

## 🔧 Teknik Detaylar

### Database Models

#### CohortDefinition
```prisma
model CohortDefinition {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text
  filters     Json
  isActive    Boolean  @default(true)
  createdBy   String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  users       UserCohort[]
  metrics     RetentionMetric[]
}
```

#### UserCohort
```prisma
model UserCohort {
  id        String           @id @default(cuid())
  cohortId  String
  userId    String
  addedAt   DateTime         @default(now())
  cohort    CohortDefinition @relation(...)
  
  @@unique([cohortId, userId])
}
```

#### RetentionMetric
```prisma
model RetentionMetric {
  id        String           @id @default(cuid())
  cohortId  String
  date      DateTime
  dayNumber Int // 1, 7, 30, 90
  retained  Int
  total     Int
  rate      Float
  createdAt DateTime         @default(now())
  cohort    CohortDefinition @relation(...)
  
  @@unique([cohortId, date, dayNumber])
}
```

### Filter Logic
Filtreler Prisma where clause'una dönüştürülür:
```typescript
const where: any = {};

if (filters.xp?.gte) where.xp = { gte: filters.xp.gte };
if (filters.lastActiveDays) {
  const date = new Date();
  date.setDate(date.getDate() - filters.lastActiveDays);
  where.updatedAt = { gte: date };
}
// ... diğer filtreler
```

## 📈 Gelecek Özellikler

- [ ] Otomatik cohort güncelleme (cron job)
- [ ] Cohort karşılaştırma
- [ ] Görsel retention grafikleri
- [ ] A/B test entegrasyonu
- [ ] Email campaign entegrasyonu (Resend)
- [ ] Webhook tetikleyicileri
- [ ] Cohort template'leri
- [ ] Gelişmiş filtreler (yaş, cinsiyet, lokasyon)
- [ ] Cohort overlap analizi
- [ ] Predictive churn scoring

## 🔐 Güvenlik

- Sadece ADMIN rolü cohort oluşturabilir/silebilir
- MODERATOR rolü cohort'ları görüntüleyebilir ve export edebilir
- Tüm işlemler audit log'a kaydedilir
- Export işlemleri rate limit'e tabidir

## 📝 Notlar

- Cohort'lar otomatik olarak güncellenmez, manuel refresh gerekir
- Büyük cohort'lar (10,000+ kullanıcı) için export işlemi zaman alabilir
- Retention metrikleri henüz otomatik hesaplanmıyor (gelecek özellik)
- Filter kombinasyonları AND mantığıyla çalışır (OR desteği yok)

## 🤝 Katkıda Bulunma

Yeni filtre türleri veya özellikler eklemek için:
1. `src/app/api/admin/cohorts/route.ts` dosyasındaki filter logic'i güncelleyin
2. Frontend form'a yeni input ekleyin
3. Zod schema'yı güncelleyin
4. Test edin ve PR açın
