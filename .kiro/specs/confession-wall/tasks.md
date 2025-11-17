# Implementation Plan - Yeme Günahı İtiraf Duvarı

## Phase 1: Database & Core Backend

- [x] 1. Database schema ve migrations







- [x] 1.1 Confession model oluştur (id, userId, content, category, aiResponse, aiTone, telafiBudget, empathyCount, status, rejectionReason, isPopular, timestamps)


  - Prisma schema'ya Confession model ekle
  - ConfessionCategory enum ekle (night_attack, special_occasion, stress_eating, social_pressure, no_regrets, seasonal)
  - AITone enum ekle (empathetic, humorous, motivational, realistic)
  - ConfessionStatus enum ekle (pending, published, rejected, hidden)
  - Gerekli indeksleri ekle (userId+createdAt, status+createdAt, category+publishedAt, isPopular+empathyCount)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_


- [x] 1.2 ConfessionEmpathy model oluştur

  - Prisma schema'ya ConfessionEmpathy model ekle (id, confessionId, userId, createdAt)
  - Unique constraint ekle (confessionId + userId)
  - Gerekli indeksleri ekle
  - User model'e relation ekle
  - _Requirements: 3.2, 3.3_

- [x] 1.3 ConfessionReport model oluştur

  - Prisma schema'ya ConfessionReport model ekle (id, confessionId, userId, reason, createdAt)
  - Unique constraint ekle (confessionId + userId)
  - Gerekli indeksleri ekle
  - _Requirements: 7.5, 7.6_

- [x] 1.4 SeasonalTheme model oluştur

  - Prisma schema'ya SeasonalTheme model ekle (id, name, category, icon, startDate, endDate, isActive, createdAt)
  - Gerekli indeksleri ekle (isActive+startDate+endDate)
  - _Requirements: 8.1, 8.2, 8.3, 8.5_


- [x] 1.5 Badge seed data ekle

  - Yeni rozet key'lerini badges tablosuna ekle (confession_first, confession_master, empathy_hero, night_warrior, seasonal_ramadan, seasonal_newyear, seasonal_bayram, popular_confession)
  - Her rozet için name, description, icon, category, rarity, xpReward, coinReward değerlerini ayarla
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 8.4_

- [x] 1.6 Migration oluştur ve çalıştır


  - `npx prisma migrate dev --name add_confession_system` komutu ile migration oluştur
  - Migration'ı test et
  - Prisma client'ı regenerate et
  - _Requirements: Tüm database gereksinimleri_

## Phase 2: Service Layer Implementation

- [x] 2. ConfessionService oluştur




- [x] 2.1 Core confession service fonksiyonları


  - `src/services/confession.service.ts` dosyası oluştur
  - `createConfession()` fonksiyonu yaz (input validation, günlük limit kontrolü, spam kontrolü)
  - `getConfessions()` fonksiyonu yaz (pagination, filtering, sorting)
  - `getConfessionById()` fonksiyonu yaz
  - `checkDailyLimit()` fonksiyonu yaz (Redis cache kullan, 3 itiraf/gün limiti)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2.2 Empathy ve report fonksiyonları

  - `addEmpathy()` fonksiyonu yaz (duplicate kontrolü, empathyCount artır, XP ver)
  - `removeEmpathy()` fonksiyonu yaz
  - `reportConfession()` fonksiyonu yaz
  - `checkReportThreshold()` fonksiyonu yaz (5+ rapor = otomatik gizle)
  - _Requirements: 3.2, 3.3, 7.5, 7.6_

- [x] 2.3 İstatistik ve yardımcı fonksiyonlar

  - `updatePopularConfessions()` fonksiyonu yaz (100+ empati = isPopular: true)
  - `getConfessionStats()` fonksiyonu yaz (total, category breakdown, average empathy)
  - `getUserConfessions()` fonksiyonu yaz (kullanıcının kendi itirafları)
  - _Requirements: 3.6, 4.5, 10.1, 10.2, 10.3_

- [x] 3. AIResponseService oluştur





- [x] 3.1 AI yanıt üretim core fonksiyonları


  - `src/services/ai-response.service.ts` dosyası oluştur
  - `generateResponse()` ana fonksiyonu yaz
  - `analyzeKeywords()` fonksiyonu yaz (tatlı, gece, pizza gibi anahtar kelimeleri tespit et)
  - `detectCategory()` fonksiyonu yaz (otomatik kategori tespiti)
  - `determineTone()` fonksiyonu yaz (kategori ve anahtar kelimelere göre ton belirle)
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 3.2 OpenAI entegrasyonu


  - `buildPrompt()` fonksiyonu yaz (4 farklı ton için prompt templates)
  - `callOpenAI()` fonksiyonu yaz (OpenAI API çağrısı, 5s timeout)
  - `getFallbackResponse()` fonksiyonu yaz (AI başarısız olursa kategori bazlı hazır yanıtlar)
  - Environment variable ekle (.env: OPENAI_API_KEY)
  - _Requirements: 2.3, 2.4, 2.5, 2.6_

- [x] 3.3 Telafi planı ve cache


  - `generateTelafi()` fonksiyonu yaz (pratik aksiyon önerileri + XP reward)
  - `getCachedResponse()` ve `cacheResponse()` fonksiyonları yaz (Redis cache, 1 hafta TTL)
  - _Requirements: 6.1, 6.2, 9.2_

- [x] 4. ModerationService oluştur





- [x] 4.1 Otomatik moderasyon fonksiyonları


  - `src/services/moderation.service.ts` dosyası oluştur
  - `checkSpam()` fonksiyonu yaz (5 dakikada 2+ itiraf, aynı içerik tekrarı)
  - `checkInappropriate()` fonksiyonu yaz (yasaklı kelimeler, URL tespiti)
  - `checkUserHistory()` fonksiyonu yaz (kullanıcı geçmişi kontrolü)
  - `autoModerate()` fonksiyonu yaz (otomatik moderasyon kararı)
  - _Requirements: 1.6, 7.1, 7.2_

- [x] 4.2 Admin moderasyon fonksiyonları


  - `getModerationQueue()` fonksiyonu yaz (pending itiraflar listesi)
  - `approveConfession()` fonksiyonu yaz (status: published, publishedAt set)
  - `rejectConfession()` fonksiyonu yaz (status: rejected, rejectionReason set, kullanıcıya bildirim)
  - _Requirements: 7.3, 7.4_

## Phase 3: API Endpoints

- [x] 5. Public confession API endpoints




- [x] 5.1 GET /api/v1/confessions (feed listesi)


  - Route dosyası oluştur: `src/app/api/v1/confessions/route.ts`
  - GET handler yaz (pagination, category filter, popular filter)
  - Authentication middleware ekle (NextAuth session kontrolü)
  - Response format: PaginatedResponse<Confession>
  - _Requirements: 3.1, 3.4, 4.2, 4.4_

- [x] 5.2 POST /api/v1/confessions (yeni itiraf)

  - POST handler yaz (content validation 10-500 karakter)
  - Günlük limit kontrolü (checkDailyLimit)
  - Spam/moderasyon kontrolü
  - AI yanıt üretimi (queue'ya ekle)
  - XP/Coin ödülü ver (10 XP, 5 coin)
  - Badge kontrolü (confession_first, night_warrior)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 5.1_

- [x] 5.3 GET /api/v1/confessions/[id] (tekil itiraf)


  - Dynamic route oluştur: `src/app/api/v1/confessions/[id]/route.ts`
  - GET handler yaz
  - _Requirements: 3.4_

- [x] 5.4 Empathy endpoints


  - POST /api/v1/confessions/[id]/empathy handler yaz (empati ekle, 2 XP ver)
  - DELETE /api/v1/confessions/[id]/empathy handler yaz (empati kaldır)
  - Duplicate kontrolü
  - Badge kontrolü (empathy_hero: 50 empati)
  - _Requirements: 3.2, 3.3, 5.3_

- [x] 5.5 Report ve diğer endpoints


  - POST /api/v1/confessions/[id]/report handler yaz
  - GET /api/v1/confessions/my handler yaz (kullanıcının kendi itirafları)
  - POST /api/v1/confessions/[id]/telafi/accept handler yaz (telafi planını kabul et, günlük göreve ekle)
  - GET /api/v1/confessions/stats handler yaz (genel istatistikler)
  - _Requirements: 3.5, 6.3, 7.5, 10.1, 10.2, 10.3_

- [x] 6. Admin confession API endpoints





- [x] 6.1 Moderasyon endpoints


  - Route dosyası oluştur: `src/app/api/admin/confessions/moderation/route.ts`
  - GET handler yaz (moderasyon kuyruğu, pagination)
  - Admin role kontrolü ekle
  - _Requirements: 7.3_

- [x] 6.2 Approve/Reject endpoints


  - POST /api/admin/confessions/[id]/approve handler yaz
  - POST /api/admin/confessions/[id]/reject handler yaz (reason required)
  - Kullanıcıya bildirim gönder
  - _Requirements: 7.3, 7.4_

- [x] 6.3 Reports ve analytics endpoints


  - GET /api/admin/confessions/reports handler yaz (rapor edilen itiraflar)
  - GET /api/admin/confessions/analytics handler yaz (detaylı analitik: daily stats, category distribution, AI success rate, telafi acceptance rate)
  - _Requirements: 7.6, 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 6.4 Seasonal theme endpoints


  - POST /api/admin/seasonal-themes handler yaz (yeni tema oluştur)
  - PUT /api/admin/seasonal-themes/[id] handler yaz (tema güncelle)
  - _Requirements: 8.5_


## Phase 4: Frontend Components

- [x] 7. Core confession components





- [x] 7.1 ConfessionCard component


  - Component dosyası oluştur: `src/components/confessions/ConfessionCard.tsx`
  - Props interface tanımla (confession, showAuthor, onEmpathy, onReport)
  - Kategori ikonu göster (sol üst)
  - İtiraf metni render et (anonim)
  - AI yanıtı vurgulu kutu içinde göster
  - Empathy button ve sayısı göster
  - Zaman damgası göster (göreceli: "2 saat önce")
  - Telafi planı kartı göster (varsa)
  - Framer Motion animasyonları ekle
  - _Requirements: 3.4, 3.6_

- [x] 7.2 ConfessionCreateForm component


  - Component dosyası oluştur: `src/components/confessions/ConfessionCreateForm.tsx`
  - Textarea ile form oluştur (10-500 karakter)
  - Karakter sayacı ekle
  - Kategori seçimi dropdown (opsiyonel)
  - Emoji picker ekle (opsiyonel)
  - Günlük limit uyarısı göster (3/3)
  - Loading state (AI yanıt bekleniyor)
  - Success animation (confetti + XP kazanım toast)
  - Form validation (Zod schema)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 7.3 EmpathyButton component


  - Component dosyası oluştur: `src/components/confessions/EmpathyButton.tsx`
  - Props interface (confessionId, initialCount, hasEmpathized, onToggle)
  - Kalp ikonu + sayı göster
  - Tıklandığında kalp animasyonu (Framer Motion)
  - Sayı artışı animasyonu
  - XP kazanım toast bildirimi
  - Disabled state (zaten empati gösterildi)
  - _Requirements: 3.2, 3.3_

- [x] 7.4 ConfessionFeed component


  - Component dosyası oluştur: `src/components/confessions/ConfessionFeed.tsx`
  - Infinite scroll veya pagination
  - Loading skeleton
  - Empty state (henüz itiraf yok)
  - ConfessionCard listesi render et
  - Optimistic updates (empati eklendiğinde)
  - _Requirements: 3.1, 3.4_

- [x] 7.5 ConfessionFilters component


  - Component dosyası oluştur: `src/components/confessions/ConfessionFilters.tsx`
  - Kategori filtreleri (tabs veya dropdown)
  - "Tümü", "Gece Saldırıları", "Özel Gün", "Stres", "Sosyal Baskı", "Pişman Değilim"
  - "Popüler" toggle
  - Aktif filtreyi vurgula
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7.6 Yardımcı components


  - AIResponseDisplay component oluştur (AI yanıtı özel styling ile göster)
  - TelafiPlanCard component oluştur (telafi planı + kabul et butonu)
  - ConfessionStats component oluştur (istatistik widget'ı)
  - PopularConfessions component oluştur (sidebar için popüler itiraflar)
  - _Requirements: 2.4, 6.1, 6.2, 10.1_

- [x] 8. Confession pages





- [x] 8.1 Ana feed sayfası


  - Page dosyası oluştur: `src/app/confessions/page.tsx`
  - ConfessionFeed component kullan
  - ConfessionFilters component ekle
  - PopularConfessions sidebar ekle
  - "Yeni İtiraf" floating action button
  - SEO metadata ekle
  - _Requirements: 3.1, 3.4, 3.6, 4.2, 4.4_

- [x] 8.2 İtiraf oluşturma sayfası


  - Page dosyası oluştur: `src/app/confessions/create/page.tsx`
  - ConfessionCreateForm component kullan
  - Success sonrası feed'e yönlendir
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8.3 Kullanıcının itirafları sayfası


  - Page dosyası oluştur: `src/app/confessions/my/page.tsx`
  - Kullanıcının kendi itiraflarını listele (anonim değil, showAuthor: true)
  - İstatistikler göster (toplam itiraf, toplam empati, en popüler)
  - _Requirements: 3.5_

- [x] 8.4 Tekil itiraf detay sayfası


  - Page dosyası oluştur: `src/app/confessions/[id]/page.tsx`
  - ConfessionCard component kullan (detaylı görünüm)
  - Benzer itiraflar öner (aynı kategori)
  - SEO metadata ekle (dynamic OG image)
  - _Requirements: 3.4_

- [x] 9. Admin confession components






- [x] 9.1 ModerationQueue component

  - Component dosyası oluştur: `src/components/admin/confessions/ModerationQueue.tsx`
  - Pending itiraflar listesi
  - Her itiraf için: Onayla, Reddet, Kullanıcıyı Uyar butonları
  - Reddetme modal (reason textarea)
  - Bulk actions (çoklu onay/red)
  - _Requirements: 7.3, 7.4_


- [x] 9.2 ConfessionReports component

  - Component dosyası oluştur: `src/components/admin/confessions/ConfessionReports.tsx`
  - Rapor edilen itiraflar listesi
  - Rapor sayısı ve detayları göster
  - İtirafı gizle/göster toggle
  - _Requirements: 7.6_

- [x] 9.3 ConfessionAnalytics component


  - Component dosyası oluştur: `src/components/admin/confessions/ConfessionAnalytics.tsx`
  - Recharts ile grafikler (günlük itiraf sayısı, kategori dağılımı)
  - Key metrics cards (toplam itiraf, ortalama empati, AI başarı oranı, telafi kabul oranı)
  - Date range picker
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_


- [x] 9.4 SeasonalThemeManager component

  - Component dosyası oluştur: `src/components/admin/confessions/SeasonalThemeManager.tsx`
  - Mevcut temalar listesi
  - Yeni tema oluşturma formu (name, category, icon, startDate, endDate)
  - Tema düzenleme/silme
  - Aktif/pasif toggle
  - _Requirements: 8.5_

- [x] 9.5 Admin pages


  - Admin moderasyon sayfası oluştur: `src/app/admin/confessions/moderation/page.tsx`
  - Admin raporlar sayfası oluştur: `src/app/admin/confessions/reports/page.tsx`
  - Admin analitik sayfası oluştur: `src/app/admin/confessions/analytics/page.tsx`
  - Admin sezonluk temalar sayfası oluştur: `src/app/admin/confessions/themes/page.tsx`
  - _Requirements: 7.3, 7.4, 7.6, 8.5, 10.1_

## Phase 5: Background Jobs & Optimization

- [x] 10. Redis queue setup





- [x] 10.1 AI yanıt üretimi queue


  - Bull queue setup (Redis connection)
  - `ai-response-generation` queue oluştur
  - Worker fonksiyonu yaz (AIResponseService.generateResponse çağır)
  - Concurrency: 5, Retry: 3, Timeout: 10s
  - Job başarılı olunca confession'ı güncelle (aiResponse, status: published)
  - Job başarısız olursa fallback yanıt kullan
  - _Requirements: 2.3, 2.4, 2.5, 2.6, 9.4_

- [x] 10.2 Popüler itiraf güncelleme cron job


  - Cron job setup (node-cron veya Bull scheduler)
  - Her 6 saatte bir çalışacak job: `updatePopularConfessions()`
  - 100+ empati alan itirafları isPopular: true yap
  - _Requirements: 3.6, 9.1_

- [x] 10.3 Cache implementation


  - Redis cache helper fonksiyonları yaz
  - Feed cache (5 dakika TTL)
  - Popüler itiraflar cache (1 saat TTL)
  - Günlük limit cache (24 saat TTL)
  - AI yanıt cache (1 hafta TTL)
  - İstatistikler cache (1 saat TTL)
  - _Requirements: 9.2, 9.5_

- [x] 10.4 Performance optimization


  - Database query optimization (select only needed fields)
  - Eager loading (include relations)
  - Cursor-based pagination implement et
  - Image lazy loading (Next.js Image component)
  - _Requirements: 9.1, 9.3_

## Phase 6: Testing & Quality Assurance

- [ ]* 11. Unit tests
- [ ]* 11.1 Service layer tests
  - ConfessionService test suite yaz
  - AIResponseService test suite yaz
  - ModerationService test suite yaz
  - Mock Prisma client ve Redis
  - _Requirements: Tüm service fonksiyonları_

- [ ]* 11.2 API endpoint tests
  - Public endpoints test suite yaz (Jest + Supertest)
  - Admin endpoints test suite yaz
  - Authentication/authorization tests
  - Validation tests
  - _Requirements: Tüm API endpoints_

- [ ]* 12. Integration tests
- [ ]* 12.1 End-to-end flow tests
  - İtiraf oluşturma flow test et
  - Empati gösterme flow test et
  - Moderasyon flow test et
  - Telafi planı kabul flow test et
  - _Requirements: Tüm user flows_

- [ ]* 13. Performance tests
- [ ]* 13.1 Load testing
  - k6 veya Artillery ile load test senaryoları yaz
  - 100 concurrent user: İtiraf oluşturma
  - 500 concurrent user: Feed görüntüleme
  - AI yanıt üretimi: Ortalama süre < 5s
  - _Requirements: 9.1, 9.2, 9.3, 9.4_

## Phase 7: Documentation & Launch

- [x] 14. Documentation




- [x] 14.1 API documentation


  - OpenAPI/Swagger spec yaz
  - Postman collection oluştur
  - API kullanım örnekleri ekle
  - _Requirements: Tüm API endpoints_

- [ ]* 14.2 User documentation
  - Kullanıcı kılavuzu yaz (nasıl itiraf yapılır, empati gösterilir)
  - FAQ hazırla
  - Video tutorial (opsiyonel)
  - _Requirements: Tüm user-facing features_


- [x] 14.3 Admin documentation

  - Admin paneli kullanım kılavuzu
  - Moderasyon best practices
  - Sezonluk tema yönetimi
  - _Requirements: Tüm admin features_

- [x] 15. Launch preparation





- [x] 15.1 Environment setup


  - Production environment variables ayarla
  - OpenAI API key setup
  - Redis production setup
  - Database backup stratejisi
  - _Requirements: Tüm sistem_

- [x] 15.2 Monitoring setup


  - Error tracking (Sentry veya benzeri)
  - Performance monitoring (Vercel Analytics)
  - Custom metrics dashboard
  - Alert rules (AI timeout, queue overflow, vb.)
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 15.3 Soft launch


  - Beta kullanıcılarına duyuru
  - Feedback toplama mekanizması
  - Bug tracking
  - Iterasyon ve iyileştirmeler
  - _Requirements: Tüm sistem_

- [x] 15.4 Full launch


  - Marketing materyalleri hazırla
  - Sosyal medya duyuruları
  - Email kampanyası
  - Landing page güncelle
  - _Requirements: Tüm sistem_

## Notes

- **Optional tasks (marked with *)**: Bu tasklar core functionality için gerekli değil, ama kalite ve güvenilirlik için önerilir
- **Dependencies**: Her task, önceki task'ların tamamlanmasına bağlı olabilir (özellikle Phase 1-3 arası)
- **Estimated timeline**: 5 hafta (Phase 1-2: 2 hafta, Phase 3-4: 2 hafta, Phase 5-7: 1 hafta)
- **Team size**: 1-2 developer için optimize edilmiş
- **AI API cost**: OpenAI API kullanımı için bütçe planla (yaklaşık $0.002/itiraf)
