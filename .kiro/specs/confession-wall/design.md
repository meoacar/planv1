# Yeme Günahı İtiraf Duvarı - Design Document

## Overview

"Yeme Günahı İtiraf Duvarı" özelliği, mevcut gamification sistemine entegre edilecek yeni bir sosyal modül. Kullanıcılar anonim itiraflar paylaşır, AI destekli yanıtlar alır ve topluluktan empati gösterir. Sistem, mevcut XP/coin/badge altyapısını kullanarak kullanıcı etkileşimini ödüllendirir.

**Temel Prensipler:**
- Anonim ama takip edilebilir (kullanıcı kendi itiraflarını görebilir)
- AI yanıtları 5 saniye içinde üretilmeli
- Moderasyon öncelikli (spam ve uygunsuz içerik filtreleme)
- Mevcut gamification sistemine tam entegrasyon
- Performans odaklı (cache, pagination, queue)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Confession   │  │ Confession   │  │ Admin        │      │
│  │ Create Form  │  │ Feed         │  │ Moderation   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js API Routes)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ /api/v1/     │  │ /api/v1/     │  │ /api/admin/  │      │
│  │ confessions  │  │ confessions/ │  │ confessions  │      │
│  │              │  │ [id]/empathy │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Confession   │  │ AI Response  │  │ Moderation   │      │
│  │ Service      │  │ Service      │  │ Service      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Data Layer (Prisma + MySQL + Redis)             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Confession   │  │ Empathy      │  │ Badge/XP     │      │
│  │ Model        │  │ Model        │  │ System       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, TypeScript
- **Database**: MySQL (Prisma ORM)
- **Cache**: Redis (optional, graceful degradation)
- **AI**: OpenAI GPT-4 API (veya alternatif LLM)
- **Queue**: Redis Bull Queue (AI yanıt üretimi için)

## Components and Interfaces

### 1. Database Schema (Prisma Models)


#### Confession Model

```prisma
model Confession {
  id              String            @id @default(cuid())
  userId          String            // Anonim ama takip için
  content         String            @db.Text
  category        ConfessionCategory
  aiResponse      String?           @db.Text
  aiTone          AITone?
  telafiBudget    String?           @db.Text // JSON: { action, xpReward }
  empathyCount    Int               @default(0)
  status          ConfessionStatus  @default(pending)
  rejectionReason String?           @db.Text
  isPopular       Boolean           @default(false) // 100+ empati
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  publishedAt     DateTime?
  
  user            User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  empathies       ConfessionEmpathy[]
  reports         ConfessionReport[]
  
  @@index([userId, createdAt])
  @@index([status, createdAt])
  @@index([category, publishedAt])
  @@index([isPopular, empathyCount])
  @@map("confessions")
}

enum ConfessionCategory {
  night_attack      // Gece Saldırıları (23:00-06:00)
  special_occasion  // Özel Gün Bahaneleri
  stress_eating     // Stres Yeme
  social_pressure   // Sosyal Baskı
  no_regrets        // Pişman Değilim
  seasonal          // Sezonluk (Ramazan, Bayram, vb.)
}

enum AITone {
  empathetic    // Empatik
  humorous      // Mizahi
  motivational  // Motivasyonel
  realistic     // Gerçekçi
}

enum ConfessionStatus {
  pending       // Moderasyon bekliyor
  published     // Yayında
  rejected      // Reddedildi
  hidden        // Raporlar sonucu gizlendi
}
```

#### ConfessionEmpathy Model

```prisma
model ConfessionEmpathy {
  id           String     @id @default(cuid())
  confessionId String
  userId       String
  createdAt    DateTime   @default(now())
  
  confession   Confession @relation(fields: [confessionId], references: [id], onDelete: Cascade)
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([confessionId, userId])
  @@index([userId, createdAt])
  @@index([confessionId])
  @@map("confession_empathies")
}
```

#### ConfessionReport Model

```prisma
model ConfessionReport {
  id           String     @id @default(cuid())
  confessionId String
  userId       String
  reason       String     @db.Text
  createdAt    DateTime   @default(now())
  
  confession   Confession @relation(fields: [confessionId], references: [id], onDelete: Cascade)
  user         User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([confessionId, userId])
  @@index([confessionId, createdAt])
  @@map("confession_reports")
}
```

#### SeasonalTheme Model

```prisma
model SeasonalTheme {
  id          String   @id @default(cuid())
  name        String   // "Ramazan 2025"
  category    String   // "seasonal"
  icon        String   // 🌙
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  @@index([isActive, startDate, endDate])
  @@map("seasonal_themes")
}
```

#### Badge Additions (Mevcut Badge tablosuna eklenecek)

```typescript
// Yeni rozet key'leri:
- confession_first: "Dürüst Ruh" (İlk itiraf)
- confession_master: "İtiraf Ustası" (10 itiraf)
- empathy_hero: "Empati Kahramanı" (50 empati)
- night_warrior: "Gece Savaşçısı" (Gece saatinde itiraf)
- seasonal_ramadan: "Ramazan Mücahidi" (Ramazan itirafı)
- seasonal_newyear: "Yılbaşı Kurbanı" (Yılbaşı itirafı)
- seasonal_bayram: "Bayram Şekeri Avcısı" (Bayram itirafı)
- popular_confession: "Viral İtiraf" (100+ empati alan itiraf)
```

### 2. Service Layer Architecture

#### ConfessionService

```typescript
// src/services/confession.service.ts

interface CreateConfessionInput {
  userId: string;
  content: string;
  category?: ConfessionCategory;
}

interface ConfessionFilters {
  category?: ConfessionCategory;
  isPopular?: boolean;
  userId?: string; // Kullanıcının kendi itirafları
}

class ConfessionService {
  // İtiraf oluşturma
  async createConfession(input: CreateConfessionInput): Promise<Confession>
  
  // İtiraf listesi (feed)
  async getConfessions(filters: ConfessionFilters, pagination: PaginationParams): Promise<PaginatedResponse<Confession>>
  
  // Tekil itiraf
  async getConfessionById(id: string): Promise<Confession | null>
  
  // Empati ekleme
  async addEmpathy(confessionId: string, userId: string): Promise<void>
  
  // Empati kaldırma
  async removeEmpathy(confessionId: string, userId: string): Promise<void>
  
  // İtiraf raporlama
  async reportConfession(confessionId: string, userId: string, reason: string): Promise<void>
  
  // Kullanıcının günlük itiraf sayısını kontrol
  async checkDailyLimit(userId: string): Promise<boolean>
  
  // Popüler itirafları güncelle (cron job)
  async updatePopularConfessions(): Promise<void>
  
  // İstatistikler
  async getConfessionStats(): Promise<ConfessionStats>
}
```


#### AIResponseService

```typescript
// src/services/ai-response.service.ts

interface AIResponseInput {
  content: string;
  category: ConfessionCategory;
  userId: string;
}

interface AIResponseOutput {
  response: string;
  tone: AITone;
  telafiBudget?: {
    action: string;
    xpReward: number;
  };
}

class AIResponseService {
  // AI yanıt üretme (ana fonksiyon)
  async generateResponse(input: AIResponseInput): Promise<AIResponseOutput>
  
  // Kategori tespiti (otomatik)
  async detectCategory(content: string): Promise<ConfessionCategory>
  
  // Anahtar kelime analizi
  private analyzeKeywords(content: string): string[]
  
  // Ton belirleme
  private determineTone(category: ConfessionCategory, keywords: string[]): AITone
  
  // Prompt oluşturma
  private buildPrompt(content: string, category: ConfessionCategory, tone: AITone): string
  
  // OpenAI API çağrısı
  private async callOpenAI(prompt: string): Promise<string>
  
  // Telafi planı önerisi
  private async generateTelafi(content: string, category: ConfessionCategory): Promise<{ action: string; xpReward: number } | null>
  
  // Fallback yanıt (AI başarısız olursa)
  private getFallbackResponse(category: ConfessionCategory): string
  
  // Cache kontrol
  private async getCachedResponse(keywords: string[]): Promise<string | null>
  
  // Cache kaydet
  private async cacheResponse(keywords: string[], response: string): Promise<void>
}
```

**AI Prompt Stratejisi:**

```typescript
const PROMPT_TEMPLATES = {
  empathetic: `Sen bir diyet koçusun. Kullanıcı şu itirafı yaptı: "{content}"
Empatik ve destekleyici bir yanıt ver. Maksimum 2 cümle. Suçluluk hissettirme, normalleştir.`,

  humorous: `Sen esprili bir diyet arkadaşısın. Kullanıcı şu itirafı yaptı: "{content}"
Esprili ama kırıcı olmayan bir yanıt ver. Maksimum 2 cümle. Gülümsetmeyi hedefle.`,

  motivational: `Sen motivasyonel bir koçsun. Kullanıcı şu itirafı yaptı: "{content}"
Motivasyonel ve ileriye dönük bir yanıt ver. Maksimum 2 cümle. Yarın yeni bir gün vurgusu.`,

  realistic: `Sen gerçekçi bir danışmansın. Kullanıcı şu itirafı yaptı: "{content}"
Gerçekçi ve pratik bir yanıt ver. Maksimum 2 cümle. Kalori/egzersiz dengesi kur.`
};
```

#### ModerationService

```typescript
// src/services/moderation.service.ts

interface ModerationResult {
  isClean: boolean;
  reason?: string;
  confidence: number;
}

class ModerationService {
  // Spam tespiti
  async checkSpam(content: string, userId: string): Promise<boolean>
  
  // Uygunsuz içerik tespiti
  async checkInappropriate(content: string): Promise<ModerationResult>
  
  // Kullanıcı geçmişi kontrolü
  async checkUserHistory(userId: string): Promise<boolean>
  
  // Otomatik moderasyon
  async autoModerate(confessionId: string): Promise<ConfessionStatus>
  
  // Admin moderasyon kuyruğu
  async getModerationQueue(pagination: PaginationParams): Promise<PaginatedResponse<Confession>>
  
  // İtiraf onaylama
  async approveConfession(confessionId: string, adminId: string): Promise<void>
  
  // İtiraf reddetme
  async rejectConfession(confessionId: string, adminId: string, reason: string): Promise<void>
  
  // Rapor eşiği kontrolü (5+ rapor = otomatik gizle)
  async checkReportThreshold(confessionId: string): Promise<void>
}
```

**Spam Tespiti Kuralları:**
- Aynı kullanıcı 5 dakika içinde 2'den fazla itiraf yapamaz
- Aynı içerik 1 saat içinde tekrar gönderilemez
- Yasaklı kelimeler listesi kontrolü
- URL/link içeren itiraflar otomatik moderasyona alınır

### 3. API Endpoints

#### Public Endpoints

```typescript
// GET /api/v1/confessions
// İtiraf listesi (feed)
Query Params: {
  page?: number (default: 1)
  limit?: number (default: 20, max: 50)
  category?: ConfessionCategory
  popular?: boolean
}
Response: PaginatedResponse<Confession>

// POST /api/v1/confessions
// Yeni itiraf oluştur
Body: {
  content: string (10-500 karakter)
  category?: ConfessionCategory (opsiyonel, AI otomatik tespit eder)
}
Response: { confession: Confession, aiResponse: string }

// GET /api/v1/confessions/[id]
// Tekil itiraf detayı
Response: Confession

// POST /api/v1/confessions/[id]/empathy
// Empati göster
Response: { empathyCount: number, xpEarned: number }

// DELETE /api/v1/confessions/[id]/empathy
// Empatiyi geri al
Response: { empathyCount: number }

// POST /api/v1/confessions/[id]/report
// İtiraf raporla
Body: { reason: string }
Response: { success: boolean }

// GET /api/v1/confessions/my
// Kullanıcının kendi itirafları
Query Params: { page?: number, limit?: number }
Response: PaginatedResponse<Confession>

// POST /api/v1/confessions/[id]/telafi/accept
// Telafi planını kabul et
Response: { questAdded: boolean, xpReward: number }

// GET /api/v1/confessions/stats
// Genel istatistikler
Response: {
  totalConfessions: number
  categoryBreakdown: Record<ConfessionCategory, number>
  averageEmpathy: number
  popularConfessions: Confession[]
}
```

#### Admin Endpoints

```typescript
// GET /api/admin/confessions/moderation
// Moderasyon kuyruğu
Query Params: { page?: number, limit?: number }
Response: PaginatedResponse<Confession>

// POST /api/admin/confessions/[id]/approve
// İtirafı onayla
Response: { success: boolean }

// POST /api/admin/confessions/[id]/reject
// İtirafı reddet
Body: { reason: string }
Response: { success: boolean }

// GET /api/admin/confessions/reports
// Rapor edilen itiraflar
Response: Array<{ confession: Confession, reportCount: number, reports: ConfessionReport[] }>

// GET /api/admin/confessions/analytics
// Detaylı analitik
Response: {
  dailyStats: Array<{ date: string, count: number }>
  categoryDistribution: Record<ConfessionCategory, number>
  aiResponseSuccessRate: number
  averageResponseTime: number
  telafiAcceptanceRate: number
}

// POST /api/admin/seasonal-themes
// Sezonluk tema oluştur
Body: { name: string, category: string, icon: string, startDate: Date, endDate: Date }
Response: SeasonalTheme

// PUT /api/admin/seasonal-themes/[id]
// Sezonluk tema güncelle
Response: SeasonalTheme
```


### 4. Frontend Components

#### Component Hierarchy

```
/app/confessions/
├── page.tsx                    # Ana feed sayfası
├── create/page.tsx             # İtiraf oluşturma sayfası
├── my/page.tsx                 # Kullanıcının itirafları
└── [id]/page.tsx               # Tekil itiraf detay

/components/confessions/
├── ConfessionFeed.tsx          # İtiraf listesi
├── ConfessionCard.tsx          # Tekil itiraf kartı
├── ConfessionCreateForm.tsx    # İtiraf oluşturma formu
├── ConfessionFilters.tsx       # Kategori filtreleri
├── EmpathyButton.tsx           # "Benimki de vardı" butonu
├── AIResponseDisplay.tsx       # AI yanıtı gösterimi
├── TelafiPlanCard.tsx          # Telafi planı kartı
├── ConfessionStats.tsx         # İstatistik widget'ı
└── PopularConfessions.tsx      # Popüler itiraflar sidebar

/components/admin/confessions/
├── ModerationQueue.tsx         # Moderasyon kuyruğu
├── ConfessionReports.tsx       # Rapor listesi
├── ConfessionAnalytics.tsx     # Analitik dashboard
└── SeasonalThemeManager.tsx    # Sezonluk tema yönetimi
```

#### Key Component Designs

**ConfessionCard.tsx**
```typescript
interface ConfessionCardProps {
  confession: Confession;
  showAuthor?: boolean; // Sadece "my confessions" sayfasında
  onEmpathy?: (confessionId: string) => void;
  onReport?: (confessionId: string) => void;
}

// Görsel Tasarım:
// - Kategori ikonu (sol üst)
// - İtiraf metni (anonim)
// - AI yanıtı (vurgulu kutu)
// - Empati sayısı + buton
// - Zaman damgası (göreceli: "2 saat önce")
// - Telafi planı (varsa,接受 butonu ile)
```

**ConfessionCreateForm.tsx**
```typescript
interface ConfessionCreateFormProps {
  onSuccess?: (confession: Confession) => void;
}

// Özellikler:
// - Karakter sayacı (10-500)
// - Kategori seçimi (opsiyonel)
// - Emoji picker (opsiyonel)
// - Günlük limit uyarısı
// - Loading state (AI yanıt bekleniyor)
// - Success animation (itiraf paylaşıldı + XP kazanıldı)
```

**EmpathyButton.tsx**
```typescript
interface EmpathyButtonProps {
  confessionId: string;
  initialCount: number;
  hasEmpathized: boolean;
  onToggle: (confessionId: string, newState: boolean) => void;
}

// Animasyon:
// - Tıklandığında kalp animasyonu
// - Sayı artışı animasyonu
// - XP kazanım toast bildirimi
```

### 5. Data Flow

#### İtiraf Oluşturma Akışı

```
1. Kullanıcı formu doldurur
   ↓
2. Frontend validasyon (10-500 karakter)
   ↓
3. POST /api/v1/confessions
   ↓
4. Backend validasyon + günlük limit kontrolü
   ↓
5. Spam/uygunsuz içerik kontrolü
   ↓
6. Kategori otomatik tespiti (AI)
   ↓
7. Veritabanına kaydet (status: pending)
   ↓
8. AI yanıt üretimi (async queue)
   ↓
9. AI yanıtı kaydet + status: published
   ↓
10. XP/Coin ödülü ver (10 XP, 5 coin)
   ↓
11. Badge kontrolü (ilk itiraf, gece savaşçısı, vb.)
   ↓
12. Response döndür (confession + aiResponse)
   ↓
13. Frontend: Success animation + feed'e ekle
```

#### Empati Gösterme Akışı

```
1. Kullanıcı "Benimki de vardı" butonuna tıklar
   ↓
2. POST /api/v1/confessions/[id]/empathy
   ↓
3. Duplicate kontrolü (aynı kullanıcı 1 kez)
   ↓
4. ConfessionEmpathy kaydı oluştur
   ↓
5. Confession.empathyCount++
   ↓
6. XP ödülü ver (2 XP)
   ↓
7. Badge kontrolü (50 empati = Empati Kahramanı)
   ↓
8. Popüler kontrolü (100+ empati = isPopular: true)
   ↓
9. Response döndür (yeni empathyCount)
   ↓
10. Frontend: Buton animasyonu + sayı güncelle
```

#### AI Yanıt Üretimi (Background Queue)

```
1. İtiraf oluşturuldu (status: pending)
   ↓
2. Redis Queue'ya job ekle
   ↓
3. Worker job'ı alır
   ↓
4. AIResponseService.generateResponse()
   ↓
5. Anahtar kelime analizi
   ↓
6. Kategori + ton belirleme
   ↓
7. Cache kontrolü (benzer yanıt var mı?)
   ↓
8. OpenAI API çağrısı (timeout: 5s)
   ↓
9. Yanıt parse + validasyon
   ↓
10. Telafi planı üretimi (opsiyonel)
   ↓
11. Veritabanına kaydet
   ↓
12. Status: published
   ↓
13. Cache'e kaydet
   ↓
14. (Opsiyonel) Push notification gönder
```

## Error Handling

### API Error Responses

```typescript
// Standart hata formatı
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}

// Hata kodları:
- DAILY_LIMIT_EXCEEDED: "Günlük itiraf limitine ulaştınız (3/3)"
- CONTENT_TOO_SHORT: "İtiraf en az 10 karakter olmalı"
- CONTENT_TOO_LONG: "İtiraf en fazla 500 karakter olabilir"
- SPAM_DETECTED: "Spam tespit edildi, lütfen daha sonra tekrar deneyin"
- INAPPROPRIATE_CONTENT: "İçerik uygunsuz bulundu"
- ALREADY_EMPATHIZED: "Bu itirafa zaten empati gösterdiniz"
- CONFESSION_NOT_FOUND: "İtiraf bulunamadı"
- AI_TIMEOUT: "AI yanıt üretimi zaman aşımına uğradı"
- UNAUTHORIZED: "Bu işlem için giriş yapmalısınız"
```

### Graceful Degradation

**Redis Unavailable:**
- Cache atlanır, direkt veritabanı kullanılır
- Queue yerine senkron AI çağrısı yapılır
- Performans düşer ama sistem çalışmaya devam eder

**OpenAI API Failure:**
- Fallback yanıtlar kullanılır
- Kategori bazlı önceden hazırlanmış mesajlar
- Kullanıcıya "AI şu anda yanıt veremiyor" bildirimi

**Database Timeout:**
- Retry mekanizması (3 deneme)
- Kullanıcıya "Lütfen tekrar deneyin" mesajı
- Hata loglama (Sentry/monitoring)


## Testing Strategy

### Unit Tests

**Service Layer Tests:**
```typescript
// confession.service.test.ts
- createConfession() - başarılı oluşturma
- createConfession() - günlük limit aşımı
- createConfession() - spam tespiti
- addEmpathy() - başarılı empati
- addEmpathy() - duplicate empati
- checkDailyLimit() - limit kontrolü
- updatePopularConfessions() - popüler güncelleme

// ai-response.service.test.ts
- generateResponse() - başarılı yanıt
- detectCategory() - kategori tespiti
- analyzeKeywords() - anahtar kelime analizi
- determineTone() - ton belirleme
- getFallbackResponse() - fallback yanıt

// moderation.service.test.ts
- checkSpam() - spam tespiti
- checkInappropriate() - uygunsuz içerik
- autoModerate() - otomatik moderasyon
- checkReportThreshold() - rapor eşiği
```

### Integration Tests

**API Endpoint Tests:**
```typescript
// /api/v1/confessions
- POST - başarılı itiraf oluşturma
- POST - validasyon hataları
- POST - günlük limit
- POST - unauthorized
- GET - feed listesi
- GET - kategori filtresi
- GET - pagination

// /api/v1/confessions/[id]/empathy
- POST - başarılı empati
- POST - duplicate empati
- DELETE - empati kaldırma

// /api/admin/confessions/moderation
- GET - moderasyon kuyruğu
- POST approve - itiraf onaylama
- POST reject - itiraf reddetme
```

### E2E Tests (Cypress/Playwright)

```typescript
// İtiraf oluşturma flow
1. Kullanıcı giriş yapar
2. "İtiraf Duvarı" sayfasına gider
3. "Yeni İtiraf" butonuna tıklar
4. İtiraf metnini yazar
5. Kategori seçer
6. "Paylaş" butonuna tıklar
7. Loading animasyonu görür
8. Success mesajı + XP kazanımı görür
9. Feed'de itirafını görür

// Empati gösterme flow
1. Kullanıcı feed'de bir itiraf görür
2. "Benimki de vardı" butonuna tıklar
3. Buton animasyonu oynar
4. Empati sayısı artar
5. XP kazanım toast'ı görür
6. Buton disabled olur (tekrar tıklanamaz)
```

### Performance Tests

**Load Testing:**
- 100 concurrent user: İtiraf oluşturma
- 500 concurrent user: Feed görüntüleme
- AI yanıt üretimi: Ortalama süre < 5s
- Database query: < 100ms
- Cache hit rate: > 80%

**Stress Testing:**
- 1000 itiraf/dakika
- 10000 empati/dakika
- Redis queue overflow handling
- Database connection pool limits

## Performance Optimization

### Database Indexing

```sql
-- Confession tablosu
CREATE INDEX idx_confessions_user_created ON confessions(userId, createdAt);
CREATE INDEX idx_confessions_status_created ON confessions(status, createdAt);
CREATE INDEX idx_confessions_category_published ON confessions(category, publishedAt);
CREATE INDEX idx_confessions_popular_empathy ON confessions(isPopular, empathyCount);

-- ConfessionEmpathy tablosu
CREATE INDEX idx_empathy_user_created ON confession_empathies(userId, createdAt);
CREATE INDEX idx_empathy_confession ON confession_empathies(confessionId);

-- ConfessionReport tablosu
CREATE INDEX idx_reports_confession_created ON confession_reports(confessionId, createdAt);
```

### Caching Strategy

**Redis Cache Keys:**
```typescript
// Feed cache (5 dakika)
`confessions:feed:${category}:${page}` → PaginatedResponse<Confession>

// Popüler itiraflar (1 saat)
`confessions:popular` → Confession[]

// Kullanıcı günlük limit (24 saat)
`confessions:daily:${userId}` → number

// AI yanıt cache (1 hafta)
`ai:response:${keywordsHash}` → string

// İstatistikler (1 saat)
`confessions:stats` → ConfessionStats
```

### Pagination

```typescript
// Cursor-based pagination (daha performanslı)
interface PaginationParams {
  cursor?: string; // Son görülen confession ID
  limit?: number;  // Default: 20, Max: 50
}

// Response
interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  hasMore: boolean;
}
```

### Background Jobs (Redis Bull Queue)

```typescript
// AI yanıt üretimi
Queue: 'ai-response-generation'
Concurrency: 5
Retry: 3 attempts
Timeout: 10s

// Popüler itiraf güncelleme (cron)
Schedule: '0 */6 * * *' // Her 6 saatte bir
Job: updatePopularConfessions()

// Eski itirafları arşivleme (cron)
Schedule: '0 2 * * *' // Her gece 02:00
Job: archiveOldConfessions() // 90 gün öncesi
```

## Security Considerations

### Input Validation

```typescript
// İtiraf içeriği
- Min: 10 karakter
- Max: 500 karakter
- HTML/Script injection koruması (DOMPurify)
- SQL injection koruması (Prisma ORM)
- XSS koruması (sanitize)

// Rate Limiting
- İtiraf oluşturma: 3/gün per user
- Empati gösterme: 100/saat per user
- Rapor etme: 10/gün per user
- API genel: 100 req/dakika per IP
```

### Authentication & Authorization

```typescript
// Public endpoints (authentication required)
- POST /api/v1/confessions
- POST /api/v1/confessions/[id]/empathy
- POST /api/v1/confessions/[id]/report
- GET /api/v1/confessions/my

// Admin endpoints (role: ADMIN required)
- GET /api/admin/confessions/moderation
- POST /api/admin/confessions/[id]/approve
- POST /api/admin/confessions/[id]/reject
- GET /api/admin/confessions/analytics
```

### Data Privacy

```typescript
// Anonim paylaşım
- İtiraflar feed'de anonim görünür
- Sadece kullanıcı kendi itiraflarını "my confessions" sayfasında görebilir
- Admin panelinde moderasyon için userId görünür (gerekli)

// GDPR Compliance
- Kullanıcı hesap silme: Tüm itiraflar cascade delete
- Veri export: Kullanıcı kendi itiraflarını export edebilir
- Veri anonymization: 90 gün sonra userId hash'lenir (opsiyonel)
```

### Content Moderation

```typescript
// Otomatik filtreler
- Yasaklı kelimeler listesi
- URL/link tespiti
- Tekrarlayan içerik tespiti
- Spam pattern tespiti

// Manuel moderasyon
- Şüpheli içerik otomatik kuyruğa alınır
- Admin onay/red kararı verir
- 5+ rapor = otomatik gizleme
- Kullanıcı uyarı sistemi (3 red = geçici ban)
```

## Monitoring & Analytics

### Key Metrics

```typescript
// Kullanım metrikleri
- Günlük itiraf sayısı
- Günlük aktif kullanıcı (itiraf yapan)
- Ortalama empati/itiraf
- Kategori dağılımı
- Popüler itiraf oranı (100+ empati)

// Performans metrikleri
- AI yanıt üretim süresi (avg, p95, p99)
- API response time
- Cache hit rate
- Database query time
- Queue processing time

// Moderasyon metrikleri
- Pending itiraf sayısı
- Ortalama moderasyon süresi
- Red oranı
- Rapor sayısı
- Spam tespit oranı

// Gamification metrikleri
- Rozet kazanım oranı
- Telafi planı kabul oranı
- Telafi planı tamamlanma oranı
- XP/Coin dağılımı
```

### Logging

```typescript
// Application logs
- İtiraf oluşturma (userId, category, status)
- AI yanıt üretimi (duration, success/failure)
- Moderasyon aksiyonları (adminId, action, confessionId)
- Hata logları (error type, stack trace)

// Audit logs
- Admin aksiyonları (approve/reject)
- Kullanıcı ban/uyarı
- Sezonluk tema değişiklikleri
```

## Deployment & Rollout

### Phase 1: MVP (Week 1-2)
- ✅ Database schema + migrations
- ✅ Core API endpoints (create, list, empathy)
- ✅ Basic AI response (OpenAI integration)
- ✅ Frontend: Feed + Create form
- ✅ Basic moderation (spam filter)
- ✅ XP/Coin integration

### Phase 2: Gamification (Week 3)
- ✅ Badge system integration
- ✅ Telafi planı önerileri
- ✅ Popüler itiraflar
- ✅ Kullanıcı istatistikleri

### Phase 3: Advanced Features (Week 4)
- ✅ Sezonluk temalar
- ✅ Admin analytics dashboard
- ✅ Performance optimization (cache, queue)
- ✅ A/B testing setup

### Phase 4: Polish & Launch (Week 5)
- ✅ E2E tests
- ✅ Load testing
- ✅ Documentation
- ✅ Marketing materials
- ✅ Soft launch (beta users)
- ✅ Full launch

## Future Enhancements

### V2 Features (Post-Launch)
- 🔮 İtiraf yorumlama (anonim)
- 🔮 İtiraf paylaşma (sosyal medya)
- 🔮 Haftalık "En İyi İtiraf" yarışması
- 🔮 İtiraf kategorisi önerileri (ML)
- 🔮 Ses kaydı ile itiraf
- 🔮 İtiraf arkadaşı eşleştirme
- 🔮 Premium AI yanıtları (daha detaylı)
- 🔮 İtiraf istatistikleri (kişisel dashboard)

### Technical Improvements
- 🔧 GraphQL API (REST yerine)
- 🔧 Real-time updates (WebSocket)
- 🔧 CDN integration (static assets)
- 🔧 Multi-language support
- 🔧 Mobile app (React Native)
- 🔧 Advanced AI (fine-tuned model)
