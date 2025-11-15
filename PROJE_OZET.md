# ZayiflamaPlan — Proje Özeti

## 🎯 Proje Nedir?

**ZayiflamaPlan**, kilo verme ve sağlıklı yaşam hedeflerine ulaşmak isteyen kullanıcılar için **tam kapsamlı bir sosyal platform + gamification ekosistemi**. Kullanıcılar diyet planları oluşturabilir, tarifler paylaşabilir, kilo takibi yapabilir, rozetler kazanabilir, takımlar kurabilir ve birbirleriyle yarışabilir.

## 🏗️ Teknik Mimari

### Core Stack
- **Framework:** Next.js 15 (App Router, React Server Components)
- **Database:** MySQL 8 + Prisma ORM
- **Auth:** NextAuth v5 (Email/Password + Google OAuth + 2FA)
- **Cache/Queue:** Redis + BullMQ
- **Hosting:** Self-hosted Ubuntu 24.04 (PM2 + Nginx)
- **Language:** TypeScript (strict mode)

### Güvenlik Katmanları
- ✅ RBAC (4 rol: ADMIN, MODERATOR, STAFF, USER)
- ✅ Rate limiting (Redis-backed)
- ✅ XSS sanitization + Zod validation
- ✅ 2FA (TOTP) zorunlu admin hesapları için
- ✅ AI-powered content moderation
- ✅ Reputation system (güven skoru)
- ✅ Webhook HMAC signature verification
- ✅ CSP + security headers

## 📦 Ana Özellikler

### 1️⃣ İçerik Yönetimi
- **Diyet Planları:** Kullanıcılar plan oluşturur, admin onaylar, topluluk beğenir/yorumlar
- **Tarifler:** Besin değerleri ile detaylı tarifler
- **Blog:** SEO-optimized makaleler
- **Moderasyon:** AI + manuel moderasyon, itiraz sistemi

### 2️⃣ Takip Sistemi
- Kilo takibi (grafik + hedef)
- Kalori takibi
- Ölçümler (bel, kalça, göğüs vb.)
- Fotoğraf karşılaştırma (before/after)
- Ruh hali takibi
- **YENİ:** Ses notları (AI transkripsiyon ile)
- Check-in sistemi (günlük motivasyon)

### 3️⃣ Gamification (Oyunlaştırma)
- **XP & Level:** Aktivitelerle seviye atla
- **Rozetler:** 50+ rozet kategorisi
- **Günlük Görevler:** Her gün yeni görevler
- **Streak (Seri):** Günlük giriş serisi + kurtarma sistemi (coin ile)
- **Coin Ekonomisi:** Görevlerle coin kazan, mağazadan ödül al
- **YENİ: Sezonlar & Ligler:** Aylık yarışma (Bronze → Diamond)
- **YENİ: Lonca (Guild):** Takım bazlı challengelar
- **YENİ: Battle Pass:** Sezonluk ilerleme sistemi (ücretsiz + premium)

### 4️⃣ Sosyal Özellikler
- Takip sistemi (followers/following)
- Gruplar (özel/genel)
- Challengelar (bireysel/takım)
- Günah Duvarı (confessions)
- Anketler
- Partner Bulma (accountability partner)
- **YENİ: Davet Sistemi:** Arkadaş davet et, bonus coin kazan
- **YENİ: Reputation Score:** Topluluk güven puanı

### 5️⃣ AI Özellikleri
- **Kişiselleştirilmiş Öneriler:** ML ile plan/tarif önerileri
- **Akıllı Hatırlatıcılar:** Kullanıcı davranışına göre optimal bildirim zamanı
- **Otomatik Moderasyon:** OpenAI Moderation API ile içerik filtreleme
- **Ses Transkripsiyon:** Whisper API ile ses notlarını metne çevirme

### 6️⃣ Admin Panel (Tam Ekosistem)
- **Dashboard:** KPI'lar, grafikler, sistem sağlığı
- **Moderasyon:** İçerik onay/red, AI güven skorları, itiraz kuyruğu
- **Kullanıcı Yönetimi:** Rol değiştirme, ban, reputation ayarlama
- **Gamification Yönetimi:** Rozet/görev/sezon/lig/battle pass CRUD
- **Feature Flags:** Özellikleri kademeli aç/kapat, A/B test entegrasyonu
- **Cohort Analizi:** Kullanıcı segmentasyonu, retention tracking
- **Webhook Yönetimi:** Harici entegrasyonlar (Discord, Slack, Zapier)
- **Observability:** OpenTelemetry traces, metrics, logs
- **Backup Yönetimi:** Manuel/otomatik yedekleme, S3 upload
- **Chaos Testing:** Kontrollü hata enjeksiyonu

## 🔐 Güvenlik & Performans

### Güvenlik
- Rate limiting (login: 5/min, comment: 6/min, quest: 5/min)
- AI moderation (%95+ policy violation yakalama)
- 2FA zorunlu admin hesapları
- Audit trail (tüm admin aksiyonları loglanır)
- Secrets rotation policy (90 gün)

### Performans
- **API P95 Latency:** < 500ms (DB queries)
- **Cache Hit Rate:** > 80% (hot paths)
- **Uptime Target:** 99.9%
- **TTFB:** < 600ms (global average)
- **Lighthouse Scores:** Public ≥90 Perf, ≥95 SEO, ≥95 A11y

### Observability
- OpenTelemetry (traces + metrics + logs)
- Sentry (error tracking)
- Custom metrics (API latency, queue depth, cache hit rate)
- Real-time dashboards

## 🚀 Deployment

### Infrastructure
- **Server:** Ubuntu 24.04 LTS
- **Process Manager:** PM2 (app + worker)
- **Web Server:** Nginx (reverse proxy, SSL, gzip/brotli)
- **Database:** MySQL 8 (master + read replicas)
- **Cache:** Redis 7
- **CDN:** Cloudflare/BunnyCDN (static assets)

### CI/CD Pipeline
1. Lint & Typecheck
2. Security scan (npm audit)
3. Build validation
4. Unit tests (≥80% coverage)
5. Integration tests
6. E2E tests (Playwright)
7. Visual regression (Chromatic)
8. Lighthouse CI
9. Deploy to staging
10. Production deployment (with backup)

### Backup Strategy
- **Daily:** 7 günlük yedek
- **Weekly:** 4 haftalık yedek
- **Monthly:** 12 aylık yedek
- **Storage:** Local + S3 (off-site)

## 📊 Database Modelleri (Özet)

### Core Models (40+ tablo)
- **Auth:** User, Account, Session, UserSettings (2FA)
- **Content:** Plan, Recipe, BlogPost, Comment, Like, ViewLog
- **Gamification:** Badge, Quest, CoinTransaction, Season, League, Guild, BattlePass
- **Tracking:** WeightLog, Measurement, ProgressPhoto, CheckIn, MoodLog, VoiceNote
- **Social:** Group, Challenge, Follow, AccountabilityPartnership
- **Economy:** ShopItem, UserPurchase, ReferralCode
- **System:** Notification, ActivityLog, FeatureFlag, WebhookEndpoint, AIRecommendation
- **Analytics:** ABTest, CohortDefinition, RetentionMetric

## 🎨 UI/UX

### Design System
- **Framework:** Tailwind CSS v4
- **Components:** shadcn/ui (customized)
- **Icons:** Lucide
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **States:** Skeleton, Empty, Loading, Error

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ≥ 4.5:1
- Focus indicators

### PWA Features
- Offline mode (IndexedDB sync)
- Install prompt
- Push notifications
- Background sync
- App manifest

## 📈 Roadmap

### MVP (v1.0) - Core Features
- ✅ Auth + RBAC
- ✅ Plans + Recipes + Blog
- ✅ Basic tracking (weight, calories)
- ✅ Basic gamification (XP, badges, quests)
- ✅ Admin panel (moderation, users)

### v1.5 - Social & AI
- ✅ Groups + Challenges
- ✅ AI recommendations
- ✅ Smart reminders
- ✅ Voice notes
- ✅ 2FA

### v2.0 - Advanced Gamification
- ✅ Seasons & Leagues
- ✅ Guilds (Lonca)
- ✅ Battle Pass
- ✅ Referral program
- ✅ Reputation system

### v2.5 - Enterprise Features
- ✅ Feature flags
- ✅ A/B testing
- ✅ Cohort analysis
- ✅ Webhooks
- ✅ Observability
- ✅ Chaos testing

### v3.0 - Monetization (Future)
- Premium subscriptions (Stripe)
- Premium battle pass
- Cosmetic shop (avatars, themes)
- Sponsored content
- Affiliate partnerships

## 🧪 Testing Strategy

### Test Types
- **Unit:** Vitest (services, utils)
- **Integration:** Vitest + Supertest (API)
- **E2E:** Playwright (user flows)
- **Visual:** Chromatic (component library)
- **Load:** k6 (performance)
- **Chaos:** Custom scripts (resilience)

### Coverage Targets
- Unit: ≥ 80%
- Integration: ≥ 70%
- E2E: Critical paths 100%

## 📚 Dokümantasyon

### Teknik Dokümanlar
- `README.md` - Proje genel bakış, kurulum
- `PRD.md` - Product Requirements Document
- `DEPLOYMENT.md` - Deployment guide
- `DATABASE.md` - Schema documentation
- `AUTH_SETUP.md` - Authentication setup
- `PERFORMANCE.md` - Performance optimization
- `ADMIN_PANEL.md` - Admin panel guide
- `API_DOCS.md` - API reference (auto-generated)
- `FEATURE_FLAGS.md` - Feature flag usage
- `AI_INTEGRATION.md` - AI services integration

## 🎯 Başarı Kriterleri

### Teknik
- ✅ App çalışıyor (dev + prod)
- ✅ Migrations hatasız deploy oluyor
- ✅ RBAC server-side enforce ediliyor
- ✅ Rate limiting aktif
- ✅ Email + Push notifications çalışıyor
- ✅ Health endpoints 200 dönüyor
- ✅ Backup script dosya oluşturuyor
- ✅ Lighthouse hedefleri tutturuluyor

### Yeni Özellikler
- ✅ 2FA setup ve verification çalışıyor
- ✅ AI recommendations kişiselleştirilmiş sonuçlar dönüyor
- ✅ Voice notes upload + transcribe ediliyor
- ✅ Streak recovery coin ile çalışıyor
- ✅ Seasons, leagues, leaderboards real-time güncelleniyor
- ✅ Guilds team challenges destekliyor
- ✅ Battle Pass progression ve reward claiming çalışıyor
- ✅ Referral codes generate + track ediliyor
- ✅ Appeal system kullanıcıların itiraz etmesine izin veriyor
- ✅ Feature flags role/percentage ile toggle ediliyor
- ✅ Webhooks external endpoints'e event gönderiyor

### Performans
- ✅ API P95 < 500ms
- ✅ Cache hit rate > 80%
- ✅ AI moderation %95+ accuracy
- ✅ OpenTelemetry traces export ediliyor
- ✅ Backup S3'e upload ediliyor

## 🚦 Proje Durumu

**Durum:** Spec tamamlandı, implementation başlamaya hazır

**Tahmini Süre:**
- MVP (v1.0): 8-10 hafta
- v1.5 (Social + AI): +4 hafta
- v2.0 (Advanced Gamification): +4 hafta
- v2.5 (Enterprise): +3 hafta

**Toplam:** ~20 hafta (5 ay) full-time development

## 💡 Öne Çıkan Yenilikler

1. **AI-First Approach:** Moderation, recommendations, transcription
2. **Gamification Depth:** Seasons, leagues, guilds, battle pass
3. **Observability:** OpenTelemetry full stack monitoring
4. **Feature Flags:** Gradual rollouts, A/B testing
5. **Offline-First:** PWA with IndexedDB sync
6. **Reputation System:** Community-driven trust scores
7. **Webhook Ecosystem:** External integrations (Discord, Slack, Zapier)
8. **Chaos Engineering:** Production resilience testing

## 🎓 Öğrenme Fırsatları

Bu proje şunları öğretir:
- Next.js 15 App Router + RSC best practices
- MySQL + Prisma advanced patterns
- Redis caching + rate limiting strategies
- BullMQ queue management
- AI/ML integration (OpenAI, Anthropic)
- Observability (OpenTelemetry, Sentry)
- Feature flag systems
- A/B testing frameworks
- Webhook architectures
- PWA development
- Load testing (k6)
- Chaos engineering

---

**Sonuç:** Bu proje, modern full-stack development'ın tüm yönlerini kapsayan, production-ready, ölçeklenebilir bir platform. Güvenlik, performans ve kullanıcı deneyimi odaklı yaklaşımla, gerçek dünya problemlerini çözen bir ekosistem.
