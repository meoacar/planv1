TITLE: ZayiflamaPlan — Full Stack + Admin Ecosystem (Next.js 15, MySQL, RBAC)

ROLE: Senior full-stack lead. Build a production-grade app + admin panel with strict security & ops guardrails.

CONSTRAINTS (HARD RULES)
- Framework: Next.js 15 (App Router, RSC), TypeScript strict.
- Database: MySQL 8 (NOT Postgres). ORM: Prisma.
- Auth: NextAuth v5 (Credentials + Google).
- Hosting: Self-host on Ubuntu 24.04 (PM2 + Nginx). No Vercel.
- No destructive DB ops: forbid DROP/TRUNCATE/RESET/`prisma migrate reset` (prod).
- Migrations prod-only: `pnpm prisma migrate deploy` (no `migrate dev` on prod).
- Rate limit write endpoints via Redis.
- XSS sanitize + Zod validation on all inputs.
- RBAC: ADMIN, MODERATOR, STAFF, USER. Admin routes must be guarded server-side.
- Use Turkish i18n texts in UI where meaningful; code in English.

====================================================
1) SCOPE & GOALS
====================================================
Build BOTH:
(A) Public/User app (plans, recipes, tracking, social, gamification)
(B) Admin Panel (RBAC, moderation, analytics, settings)

Deliverables:
- Running Next.js 15 app with UI + API routes.
- Prisma schema for MySQL + migrations (with new models: AI, guilds, seasons, appeals, feature flags, webhooks).
- Admin panel under /admin with RBAC + new dashboards (AI moderation, appeals, feature flags, cohorts, webhooks, observability).
- Background worker with BullMQ (new queues: AI, transcription, webhooks).
- Redis-backed rate limit/cache + feature flags.
- Email via Resend + React Email templates (segmented campaigns).
- Web Push (VAPID) + smart reminders (ML-optimized timing).
- AI integration: OpenAI/Anthropic for recommendations, moderation, transcription.
- 2FA (TOTP) implementation.
- PWA with offline mode (IndexedDB sync).
- Observability: OpenTelemetry + Sentry.
- Feature flags system (LaunchDarkly-style).
- A/B testing framework.
- Webhook system for external integrations.
- Health endpoints, backup scripts (with S3 upload), PM2 & Nginx configs.
- Load testing (k6) and chaos testing scripts.
- Docs: README.md, PRD.md, DEPLOYMENT.md, DATABASE.md, AUTH_SETUP.md, PERFORMANCE.md, ADMIN_PANEL.md, API_DOCS.md, FEATURE_FLAGS.md, AI_INTEGRATION.md.

====================================================
2) FOLDER STRUCTURE
====================================================
/src
  /app
    /(public)              -> landing, explore, lists
    /giris /kayit /sifremi-unuttum
    /dashboard
    /plan/[slug] /plan-ekle /planlarim
    /recipes /recipes/[slug] /tarif-ekle /tariflerim
    /blog /blog/[slug]
    /profil/[id]
    /gruplar /gruplar/[slug] /lonca /lonca/[slug]
    /gunah-duvari /anketler /magaza /oyunlar
    /kilo-takibi /kalori-takibi /olcumler /fotograflar /ruh-hali /check-in /ses-notlari
    /sezonlar /ligler /battle-pass
    /admin                 -> full admin ecosystem (layout + routes)
    /api                   -> route handlers (v1 prefix in path)
      /webhooks            -> external webhook receivers
  /components              -> ui, tables, forms, charts
  /emails                  -> react-email templates
  /lib                     -> auth, db, redis, cache, mail, push, rbac, rate-limit, sanitize, ai, observability, feature-flags
  /services                -> domain services (plans, recipes, gamification, social, tracking, groups, notifications, ai-recommendations, webhooks)
  /workers                 -> bullmq queues + processors
  /ml                      -> ML models, recommendation engine
  /styles
/prisma
  schema.prisma
/config
  ecosystem.config.js
  nginx.conf.example
  otel-config.js
/scripts
  backup-db.sh
  policy-guard.mjs
  healthcheck.mjs
  queue-health.mjs
  security-scan.mjs
  load-test.k6.js
  chaos-test.mjs
.kiro/
  /specs/core-api-models.requirements.json
  /hooks/hooks.config.json
  /steering/agent-steering.md
.storybook/
  main.js
  preview.js
.env.example
README.md
PRD.md
DEPLOYMENT.md
DATABASE.md
ADMIN_PANEL.md
API_DOCS.md
FEATURE_FLAGS.md
AI_INTEGRATION.md

====================================================
3) ENV VARS (.env.example)
====================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL="mysql://USER:PASS@localhost:3306/zayiflamaplan?connection_limit=10&pool_timeout=30"
DATABASE_READ_REPLICA_URL="mysql://USER:PASS@localhost:3306/zayiflamaplan"

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace_me
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=
EMAIL_FROM="ZayiflamaPlan <noreply@zayiflamaplan.com>"

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:support@zayiflamaplan.com

# AI/ML Services
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Observability
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
SENTRY_DSN=

# Feature Flags & Analytics
LAUNCHDARKLY_SDK_KEY=
POSTHOG_API_KEY=
POSTHOG_HOST=https://app.posthog.com

# Payment (future)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# CDN
CDN_URL=
CDN_API_KEY=

# Storage
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=

SAFE_MODE=1
ALLOW_SCHEMA_CHANGE=0

====================================================
4) PRISMA (MySQL) — CORE MODELS (summary)
====================================================
Auth/User:
- User(id cuid, email unique, username?, passwordHash?, role enum[ADMIN|MODERATOR|STAFF|USER]=USER, xp int, level int, coins int, streak int, reputationScore int=0, totpSecret?, createdAt, updatedAt)
- Account (NextAuth), Session (NextAuth), Follow(userId, targetId unique pair), ProfileCustomization
- UserSettings(userId, twoFactorEnabled bool=false, offlineMode bool=false)

Content:
- Plan(id, slug unique, title, description TEXT, authorId→User ON DELETE CASCADE, status enum[draft|pending|published|rejected]=pending, views, likesCount, aiGenerated bool=false, createdAt, updatedAt)
- Recipe, BlogPost, Page
- Comment(id, authorId→User SET NULL, targetType enum(plan|recipe|blog), targetId, body TEXT, status enum[pending|visible|hidden]=pending, reports int, aiModerated bool=false, createdAt)
- CommentReaction, Like, ViewLog
- ContentAppeal(contentId, contentType, userId, reason TEXT, status enum[pending|approved|rejected], createdAt)

Gamification:
- Badge, UserBadge(unique userId+badgeId), DailyQuest, UserDailyQuest, CoinTransaction, GameScore
- Season(id, name, startDate, endDate, active bool), League(id, seasonId, tier enum[bronze|silver|gold|platinum|diamond], minPoints int)
- UserLeague(userId, leagueId, seasonId, points int, rank int)
- Guild(id, name, leaderId→User, memberCount int, totalXP int), GuildMember(guildId, userId, role enum[leader|officer|member])
- AchievementChain(id, name, badges JSON array), StreakRecovery(userId, recoveredAt, coinsCost int)

Tracking:
- WeightLog, Measurement, ProgressPhoto, CheckIn, MoodLog, CrisisButtonLog
- VoiceNote(id, userId, audioUrl, transcription TEXT?, duration int, createdAt)

Social:
- Group, GroupMember, GroupPost
- Challenge, ChallengeParticipant, ChallengeLeaderboard
- GuildChallenge(id, guildId, challengeId, progress int, completed bool)

Partner:
- AccountabilityPartnership, PartnershipMessage, PartnershipGoal, PartnershipCheckIn

Economy:
- ShopItem, UserPurchase, CustomizationItem
- BattlePass(id, seasonId, tier enum[free|premium], price int), BattlePassReward(passId, level int, rewardType, rewardId)
- UserBattlePass(userId, passId, currentLevel int, xpEarned int)
- ReferralCode(userId, code unique, usedCount int), Referral(referrerId, referredId, bonusCoins int, createdAt)

Polls:
- Poll, PollOption, PollVote

System/Moderation:
- Notification, NotificationPreference
- ActivityLog(actorId?, action, entity, entityId?, ip?, ua?, meta JSON, createdAt)
- SiteSettings, SeoSettings, BannedWord, Backup
- FeatureFlag(key unique, enabled bool, rolloutPercent int, targetRoles JSON array)
- WebhookEndpoint(id, url, events JSON array, secret, active bool), WebhookLog(endpointId, event, payload JSON, status int, createdAt)

AI/ML:
- AIRecommendation(userId, recommendationType enum[plan|recipe|reminder], targetId, score float, createdAt)
- SmartReminder(userId, reminderType, optimalTime TIME, frequency enum[daily|weekly], enabled bool)

Analytics:
- ABTest(id, name, variants JSON array, active bool), ABTestAssignment(testId, userId, variant, createdAt)
- CohortDefinition(id, name, filters JSON, createdAt), UserCohort(cohortId, userId)
- RetentionMetric(date, cohort, day int, retained int, total int)

RBAC (if not enum-only):
- Role, Permission, RolePermission, UserRole (optional; can start with role enum)

Indexes (examples):
- Plan: (slug) unique, (authorId, createdAt), (status, createdAt), (aiGenerated, createdAt)
- Comment: (targetType, targetId, createdAt), (status, createdAt)
- User: (email), (role), (reputationScore), (createdAt)
- UserLeague: (seasonId, points DESC), (userId, seasonId)
- FeatureFlag: (key) unique, (enabled)

ON DELETE:
- User-owned content → CASCADE where safe, else RESTRICT.
- Comments author → SET NULL.
- Guild leader → transfer to officer or dissolve.

====================================================
5) API (v1) — KEY ENDPOINTS
====================================================
Prefix: /api/v1

Auth:
- POST /auth/register | /auth/login | /auth/logout | /auth/reset-password
- POST /auth/2fa/enable | /auth/2fa/verify | /auth/2fa/disable

Plans:
- GET /plans (list with filters, pagination)
- POST /plans (auth USER, zod validate, rateLimit user:10/min)
- GET /plans/:slug
- PATCH /plans/:slug (owner or ADMIN/MOD)
- DELETE /plans/:slug (owner or ADMIN)
- POST /plans/:slug/like (auth USER, rateLimit user:30/min)
- POST /plans/:slug/view
- POST /plans/:slug/appeal (auth USER, if rejected)

Recipes & Blog:
- CRUD similar to Plans; Recipes include nutrition fields, Blog has SEO fields.

Comments:
- POST /comments (auth USER, rateLimit user:6/min, bannedWords check, sanitize, AI moderation)
- DELETE /comments/:id (owner or MOD/ADMIN)
- POST /comments/:id/reactions

Follow:
- POST /follow | DELETE /follow | GET /follow/followers | /follow/following | /follow/check

Notifications:
- GET /notifications | GET /notifications/unread-count
- POST /notifications/:id/read | POST /notifications/read-all

Gamification:
- GET /badges, GET /quests, POST /quests/claim (rateLimit user:5/min)
- GET /shop/rewards, POST /shop/purchase
- GET /seasons/current, GET /leagues/:seasonId, GET /leaderboard/:leagueId
- GET /guilds, POST /guilds, POST /guilds/:id/join, GET /guilds/:id/challenges
- POST /streak/recover (costs coins)
- GET /battle-pass/:seasonId, POST /battle-pass/claim-reward

Tracking:
- GET/POST /weight-logs | /check-ins | /measurements
- POST /voice-notes (multipart/form-data, transcribe with AI)
- GET /voice-notes/:id/transcription

AI/Recommendations:
- GET /ai/recommendations (personalized plans/recipes)
- POST /ai/smart-reminders/optimize (ML-based optimal times)
- POST /ai/moderate-content (internal, admin only)

Groups & Challenges:
- GET/POST /groups, GET/POST /groups/:slug/join
- GET/POST /challenges, POST /challenges/:id/join

Referrals:
- GET /referrals/my-code
- POST /referrals/apply (apply referral code)
- GET /referrals/stats

Webhooks (external integrations):
- POST /webhooks/discord | /webhooks/slack | /webhooks/zapier
- GET /webhooks/endpoints (admin), POST /webhooks/endpoints (admin)
- POST /webhooks/test/:id (admin)

Admin (guard requireRole):
- GET /admin/stats
- PATCH /admin/plans/:id/approve | /recipes/:id/approve
- PATCH /admin/users/:id/role | /admin/users/:id/reputation
- GET /admin/activity-logs
- GET /admin/appeals, PATCH /admin/appeals/:id/resolve
- GET /admin/feature-flags, PATCH /admin/feature-flags/:key
- GET /admin/ab-tests, POST /admin/ab-tests
- GET /admin/cohorts, POST /admin/cohorts
- POST /admin/backup/trigger, GET /admin/backup/download/:id

Utilities:
- GET /health (liveness=200), GET /ready (checks DB+Redis+Email=200)
- GET /metrics (Prometheus format, internal only)

Response shape standard:
{ "success": true/false, "data": <T>?, "error": { "code": "STRING", "message": "STRING" }?, "meta": { "page"?, "total"?, "version": "v1" }? }

====================================================
6) USER APP — PAGES & FEATURES
====================================================
Public pages: /, /plan/[slug], /recipes, /recipes/[slug], /blog, /blog/[slug], /kesfet, /profil/[id], /gruplar, /gruplar/[slug]
Auth: /giris, /kayit, /sifremi-unuttum, /guvenlik (2FA setup)
Dashboard: /dashboard, /plan-ekle, /tarif-ekle, /planlarim, /tariflerim, /favorilerim, /koleksiyonlarim, /bildirimler, /mesajlar, /ayarlar
Tracking: /kilo-takibi, /kalori-takibi, /olcumler, /fotograflar, /ruh-hali, /check-in, /ses-notlari (voice notes with transcription)
Gamification: /gamification, /rozetler, /gorevler, /magaza, /oyunlar, /liderlik-tablosu, /sezonlar, /ligler, /lonca (guilds), /lonca/[slug], /battle-pass
Social: /gunah-duvari, /anketler, /partner-bul, /arkadas-onerileri, /davet-et (referral program)
AI Features: /ai-onerileri (personalized recommendations), /akilli-hatirlaticilar (smart reminders)

NEW FEATURES:
- Offline Mode: PWA with IndexedDB sync, works without internet
- Voice Notes: Record audio diaries, auto-transcribe with AI
- Streak Recovery: Buy back lost streaks with coins
- Seasons & Leagues: Monthly competitive tiers (Bronze→Diamond)
- Guilds (Lonca): Team-based challenges and leaderboards
- Battle Pass: Seasonal progression with free/premium rewards
- AI Recommendations: Personalized plan/recipe suggestions
- Smart Reminders: ML-optimized notification timing
- Referral System: Invite friends, earn bonus coins
- Appeal System: Contest rejected content
- 2FA: TOTP-based two-factor authentication
- Reputation Score: Community trust metric

UI: Tailwind v4 + shadcn/ui, Lucide icons, Recharts (charts), RHF + Zod, Skeleton/Empty/Loading states, A11y ≥ 95, PWA manifest.

====================================================
7) ADMIN PANEL — FULL ECOSYSTEM (/admin)
====================================================
- Layout: Sidebar (collapsible), Topbar (search + theme + notifications), Breadcrumbs.
- RBAC: ADMIN full; MOD: moderation; STAFF: content helper; USER: no access.
- Dashboard: KPIs (users/plans/recipes/comments), charts (new users 7d, plans growth, top tags), recent ActivityLog, system health (DB/Redis/Email/Queues).
- Content Moderation: Plans/Recipes/Blog — list + filters + Approve/Reject/Delete; Comments/Confessions — queue with Approve/Hide/Ban Author; AI moderation confidence scores.
- Appeals Management: Review rejected content appeals, approve/reject with reason.
- Users & Roles: table (ID, Email, Role, XP, Level, Reputation, Status, JoinDate), change role modal, Ban/Unban, reputation adjustment, activity history, 2FA status.
- Gamification: Badges CRUD (+assign manual), Quests CRUD (daily/weekly), Coin transactions, Store items (price, stock), Seasons CRUD, Leagues management, Battle Pass configuration.
- Guilds & Challenges: guild approvals, create/edit challenges, guild leaderboards, feature toggle.
- Notifications: Template manager (In-App/Email/WebPush), test send, revision history, smart reminder config.
- SEO & Pages: CMS-lite for static pages, site-wide SEO settings.
- Settings: general, auth keys, email, banned words (regex/action), maintenance mode, AI API keys.
- Analytics: web vitals, API perf, retention, Sentry errors, storage usage, cohort analysis, A/B test results, referral stats.
- Feature Flags: toggle features by key, rollout percentage, target specific roles.
- A/B Testing: create tests, define variants, view results, statistical significance.
- Cohorts: define user segments, track retention, export lists.
- Webhooks: manage external webhook endpoints, view logs, test delivery.
- AI Management: view AI recommendations, adjust ML model parameters, moderation thresholds.
- System: Backup trigger/download (admin only), ActivityLog search/export, observability dashboard (OpenTelemetry metrics), load test results.

NEW ADMIN FEATURES:
- AI Moderation Dashboard: confidence scores, false positive review
- Reputation Management: adjust user reputation, view trust scores
- Appeal Queue: prioritized by user reputation
- Feature Flag Control: gradual rollouts, A/B testing integration
- Cohort Builder: segment users by behavior, retention analysis
- Webhook Manager: configure external integrations (Discord, Slack, Zapier)
- Observability: OpenTelemetry traces, metrics, logs in one view
- Chaos Testing: trigger controlled failures to test resilience
- Load Test Runner: schedule k6 tests, view performance reports

All admin writes are logged to ActivityLog (actor, entity, id, ip, ua, meta).

====================================================
8) REDIS, QUEUES, NOTIFICATIONS
====================================================
- Redis: rate limiting + cache keys (feed:*, user:stats:*, rate:*, feature-flags:*, ab-test:*)
- BullMQ Worker (/workers):
  Queues: emailQueue, notificationQueue, analyticsQueue, ogImageQueue, aiQueue, webhookQueue, transcriptionQueue
  Processors: retry/backoff, dead-letter, priority queues
  Jobs: email send, push notification, analytics event, OG image generation, AI recommendation, content moderation, voice transcription, webhook delivery
- Email: Resend + React Email templates (segmented campaigns support)
- Web Push: VAPID subscription, test endpoint in admin
- Smart Notifications: ML-based optimal delivery times per user

====================================================
9) SECURITY & PERFORMANCE
====================================================
Security:
- Zod validation + server-side sanitize (XSS guard).
- Rate limit (Redis) on login/comments/quests/likes/AI endpoints.
- CSP & security headers (middleware).
- CSRF via NextAuth cookies (sameSite).
- 2FA (TOTP) for sensitive accounts.
- AI-powered content moderation (OpenAI Moderation API).
- Reputation system to flag suspicious users.
- Webhook signature verification (HMAC).
- Audit trail for all admin actions.
- Secrets rotation policy (90 days).

Performance:
- ISR + route segment cache + Redis API cache.
- MySQL indexes tuned; Prisma select/include minimal.
- Read replicas for heavy queries.
- CDN for static assets (_next/static, images).
- Image optimization (next/image + CDN).
- Database connection pooling (10 connections).
- BullMQ job prioritization and batching.
- OpenTelemetry for distributed tracing.
- Redis cache warming for hot paths.
- Lazy loading + code splitting.
- PWA with offline support (IndexedDB).

Observability:
- OpenTelemetry: traces, metrics, logs.
- Sentry: error tracking, performance monitoring.
- Custom metrics: API latency, queue depth, cache hit rate.
- Real-time dashboards in admin panel.

Targets:
- Lighthouse: Public ≥ 90 Perf / ≥ 95 SEO / ≥ 95 A11y; Admin Perf ≥ 80 / A11y ≥ 95.
- API P95 latency: < 200ms (cached), < 500ms (DB queries).
- Uptime: 99.9% (measured monthly).
- TTFB: < 600ms (global average).

====================================================
10) DEPLOYMENT (PM2 + Nginx) & SCRIPTS
====================================================
/config/ecosystem.config.js
- app: pnpm start (PORT=3000)
- worker: node dist/workers/index.js
- otel-collector: optional sidecar for observability

/config/nginx.conf.example
- 80→443 redirect, / alias, proxy_pass 127.0.0.1:3000, gzip/brotli, cache headers for _next/static
- CDN integration headers
- Rate limiting at nginx level (backup to Redis)
- WebSocket support for real-time features

/config/otel-config.js
- OpenTelemetry SDK configuration
- Exporters: Jaeger (traces), Prometheus (metrics)
- Sampling strategy: 10% in prod, 100% in dev

/scripts/backup-db.sh
- mysqldump with timestamp to ./backups
- S3 upload for off-site storage
- Retention policy: 7 daily, 4 weekly, 12 monthly

/scripts/policy-guard.mjs
- blocks destructive patterns and prod-forbidden migrate commands
- validates migration safety before deploy

/scripts/healthcheck.mjs
- calls /api/health and /api/ready, exits non-zero if fail
- checks DB, Redis, Email, Queue health

/scripts/queue-health.mjs
- monitors BullMQ queue depths
- alerts if jobs stuck > 5 min

/scripts/security-scan.mjs
- runs npm audit, checks for known vulnerabilities
- validates env vars are set

/scripts/load-test.k6.js
- k6 load testing scenarios
- tests: auth flow, plan creation, API endpoints
- thresholds: P95 < 500ms, error rate < 1%

/scripts/chaos-test.mjs
- controlled failure injection
- tests: DB connection loss, Redis down, queue overflow
- validates graceful degradation

====================================================
11) KIRO: SPECS + HOOKS + STEERING
====================================================
Create .kiro/specs/core-api-models.requirements.json with:
- DB: mysql
- forbidDestructiveOps: true
- prodMigrations: deploy-only
- endpoint rate limits table
- health endpoints
- backup schedule
- testing plan (unit/integration/e2e)
(Use the previously provided JSON structure.)

Create .kiro/hooks/hooks.config.json with hooks:
- onSchemaChange: prisma format + migrate dev (dev only) + generate
- preDeploy: policy-guard "pnpm prisma migrate deploy" → backup-db.sh → prisma migrate deploy → queue-health → security-scan
- onEndpointAdd: contract-check (zod, guard, sanitize)
- postDeploy: nginx reload + certbot dry-run + healthcheck

Create .kiro/steering/agent-steering.md with hard rules:
- never run destructive SQL; prod: no migrate dev/reset; require backup before migrate deploy; admin routes must use requireRole.

====================================================
12) TESTING & CI
====================================================
Testing Strategy:
- Unit: Vitest (services, utils, lib functions)
- Integration: Vitest + Supertest (API endpoints, DB operations)
- E2E: Playwright (critical user flows)
- Visual Regression: Percy/Chromatic (component library)
- Load: k6 (performance benchmarks)
- Chaos: Custom scripts (resilience testing)

CI Pipeline (GitHub Actions):
1. Lint & Typecheck: ESLint, TypeScript strict mode
2. Security: npm audit, policy-guard validation
3. Build: pnpm build (ensure no build errors)
4. Unit Tests: Vitest with coverage (≥ 80%)
5. Integration Tests: API contract tests
6. E2E Tests: Playwright (smoke tests on PR, full suite on main)
7. Visual Tests: Chromatic (component changes)
8. Performance: Lighthouse CI (budget enforcement)
9. Deploy Preview: Staging environment for PRs

Acceptance Tests:
- Auth: register → login → 2FA → logout
- Content: plan create → pending → admin approve → notify author → published
- Moderation: comment with banned word → AI moderation → hidden → appeal → resolve
- Gamification: quest claim with rate limit → XP gain → level up → badge unlock
- Social: guild create → invite members → challenge join → leaderboard update
- Tracking: weight log → streak increment → streak break → recovery purchase
- AI: recommendation request → personalized results → feedback loop
- Webhooks: external event → queue → delivery → retry on failure
- Health: /health 200, /ready checks DB+Redis+Email
- Chaos: Redis down → graceful degradation → cache miss → DB query → success

====================================================
13) ENHANCEMENTS & INNOVATIONS (V1.5+)
====================================================

TECHNICAL ENHANCEMENTS:
- Observability: OpenTelemetry integration (traces, metrics, logs) with Jaeger + Prometheus exporters
- Feature Flags: LaunchDarkly-style system with gradual rollouts, role targeting, A/B test integration
- API Versioning: v1 stable, v2 preparation with deprecation strategy
- Database Optimization: Read replicas for heavy queries, connection pooling, index tuning
- CDN Integration: Cloudflare/BunnyCDN for static assets, image optimization
- Webhook System: External integrations (Zapier, Discord, Slack) with retry logic and signature verification
- PWA: Offline mode with IndexedDB sync, service worker, app manifest

USER EXPERIENCE INNOVATIONS:
- AI Recommendations: OpenAI/Anthropic-powered personalized plan/recipe suggestions
- Voice Notes: Audio diary with automatic transcription (Whisper API)
- Smart Reminders: ML-based optimal notification timing per user
- Offline Mode: Full tracking functionality without internet, auto-sync when online
- Social Proof: "X kişi bu planı tamamladı" widgets, success stories
- Streak Recovery: Purchase lost streaks with coins (gamification safety net)
- 2FA Security: TOTP-based two-factor authentication for account protection

GAMIFICATION EXPANSIONS:
- Seasons & Leagues: Monthly competitive tiers (Bronze → Silver → Gold → Platinum → Diamond)
- Guild System (Lonca): Team-based challenges, guild leaderboards, cooperative goals
- Battle Pass: Seasonal progression with free/premium tiers, cosmetic rewards
- Achievement Chains: Multi-step badge sequences with story progression
- Cosmetic Rewards: Avatar customization, profile themes, badges display
- Reputation System: Community trust score affecting moderation priority

MODERATION & SECURITY:
- AI Moderation: OpenAI Moderation API for automatic content filtering with confidence scores
- Reputation System: User trust scores, affects appeal priority and moderation
- Appeal System: Users can contest rejected content with admin review queue
- 2FA Enforcement: Required for admin/moderator accounts
- Audit Trail: Comprehensive logging of all admin actions with IP/UA tracking
- Webhook Security: HMAC signature verification for external integrations

ANALYTICS & BUSINESS:
- A/B Testing: Posthog/GrowthBook integration for feature experiments
- Cohort Analysis: User segmentation by behavior, retention tracking, export capabilities
- Referral Program: Friend invitation system with bonus coins for both parties
- Email Campaigns: Segmented marketing via Resend with user preferences
- Revenue Tracking: Stripe integration ready for premium features (Battle Pass, cosmetics)
- Retention Metrics: Daily/weekly/monthly cohort retention, churn prediction

DEVELOPER EXPERIENCE:
- API Documentation: Auto-generated Swagger/OpenAPI docs from Zod schemas
- Storybook: Component library documentation with visual testing
- Visual Regression: Percy/Chromatic integration for UI change detection
- Load Testing: k6 scripts for performance benchmarking
- Chaos Engineering: Controlled failure injection to test resilience
- Observability Dashboard: Real-time traces, metrics, logs in admin panel

====================================================
14) ACCEPTANCE CRITERIA
====================================================
Core Functionality:
- App runs on Node 20 with `pnpm dev` locally; `pnpm build` + `pnpm start` prod.
- Prisma migrations deploy cleanly to MySQL (`migrate deploy`), no reset.
- Admin RBAC enforced server-side; non-authorized access redirects /unauthorized.
- Redis rate limit active; BullMQ worker processes queues.
- Email (Resend) and Web Push test pass from admin.
- Health/Ready endpoints OK; backup script generates files.
- Lighthouse targets met (public), admin A11y ≥ 95.

New Features:
- 2FA setup and verification works for user accounts.
- AI recommendations return personalized plans/recipes.
- Voice notes upload, transcribe, and display correctly.
- Streak recovery purchases coins and restores streak.
- Seasons, leagues, and leaderboards update in real-time.
- Guilds support team challenges and member management.
- Battle Pass progression and reward claiming functional.
- Referral codes generate, track usage, and award bonuses.
- Appeal system allows users to contest rejections.
- Feature flags toggle features by role/percentage.
- A/B tests assign variants and track conversions.
- Webhooks deliver events to external endpoints with retry.
- Offline mode syncs data when connection restored.
- Smart reminders optimize delivery times per user.

Admin Panel:
- AI moderation dashboard shows confidence scores.
- Reputation management adjusts user trust scores.
- Appeal queue prioritizes by reputation.
- Feature flag UI toggles and rollout percentages.
- Cohort builder segments users and exports lists.
- Webhook manager configures and tests endpoints.
- Observability dashboard shows traces, metrics, logs.
- Chaos testing triggers controlled failures.
- Load test runner schedules k6 tests and displays results.

Performance & Security:
- API P95 latency < 500ms for DB queries.
- Cache hit rate > 80% for hot paths.
- 2FA enforced for admin accounts.
- AI moderation flags 95%+ of policy violations.
- Webhook signatures verified (HMAC).
- OpenTelemetry exports traces to Jaeger.
- Backup script uploads to S3 with retention policy.
- Rate limiting prevents abuse (tested with k6).

OUTPUT
- Generate full code scaffold + key pages, API handlers, Prisma models, worker, configs, and docs as listed.
- Include all new features: AI, 2FA, guilds, seasons, battle pass, referrals, appeals, feature flags, webhooks, observability.
- Respect all constraints and guardrails above. 
