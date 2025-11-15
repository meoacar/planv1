# ZayiflamaPlan — MVP Specification

## 🎯 Vizyon
Gerçek insanların gerçek zayıflama planlarını paylaştığı, topluluk destekli platform.

## 📦 MVP Özellikleri (3 Aylık)

### Kullanıcı Özellikleri
1. ✅ Kayıt/Giriş (Email + Google OAuth)
2. ✅ Profil (hedef kilo, mevcut kilo, bio)
3. ✅ Plan oluşturma & paylaşma
4. ✅ Plan keşfetme (liste, arama, filtre)
5. ✅ Sosyal (beğeni, yorum, takip)
6. ✅ Kilo takibi (grafik)
7. ✅ Fotoğraf paylaşımı (önce/sonra)
8. ✅ Bildirimler (yeni yorum, beğeni)

### Admin Özellikleri
1. ✅ Plan moderasyonu
2. ✅ Kullanıcı yönetimi
3. ✅ Yorum moderasyonu
4. ✅ Basit dashboard

## 🗄️ Database (MySQL + Prisma)

### Core Models (12 tablo)
```prisma
// Auth
User (id, email, username, passwordHash, role, bio, currentWeight, targetWeight, height, createdAt)
Account (NextAuth)
Session (NextAuth)

// Content
Plan (id, slug, title, description, authorId, duration, targetWeightLoss, difficulty, tags, status, views, likesCount, createdAt)
PlanDay (id, planId, dayNumber, breakfast, snack1, lunch, snack2, dinner, notes)
Recipe (id, title, description, authorId, ingredients, instructions, calories, status, createdAt)

// Social
Comment (id, authorId, targetType, targetId, body, status, createdAt)
Like (id, userId, targetType, targetId, createdAt)
Follow (id, userId, targetId, createdAt)

// Tracking
WeightLog (id, userId, weight, date, note, createdAt)
ProgressPhoto (id, userId, photoUrl, weight, type, caption, createdAt)

// System
Notification (id, userId, type, title, body, targetType, targetId, read, createdAt)
```

## 🛣️ Routes

### Public Pages
- `/` - Landing page
- `/kesfet` - Explore plans
- `/plan/[slug]` - Plan detail
- `/profil/[username]` - User profile
- `/giris` - Login
- `/kayit` - Register

### Auth Pages
- `/dashboard` - User dashboard
- `/plan-ekle` - Create plan
- `/planlarim` - My plans
- `/favorilerim` - Favorites
- `/kilo-takibi` - Weight tracking
- `/fotograflar` - Progress photos
- `/ayarlar` - Settings

### Admin Pages
- `/admin` - Dashboard
- `/admin/planlar` - Plan moderation
- `/admin/kullanicilar` - User management
- `/admin/yorumlar` - Comment moderation

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/session`

### Plans
- `GET /api/v1/plans` - List (pagination, filters)
- `POST /api/v1/plans` - Create (auth, rate limit)
- `GET /api/v1/plans/:slug` - Detail
- `PATCH /api/v1/plans/:slug` - Update (owner only)
- `DELETE /api/v1/plans/:slug` - Delete (owner/admin)
- `POST /api/v1/plans/:slug/like` - Like/unlike
- `POST /api/v1/plans/:slug/view` - Increment view

### Comments
- `GET /api/v1/comments` - List (by target)
- `POST /api/v1/comments` - Create (auth, rate limit)
- `DELETE /api/v1/comments/:id` - Delete (owner/admin)

### Follow
- `POST /api/v1/follow` - Follow user
- `DELETE /api/v1/follow/:id` - Unfollow
- `GET /api/v1/follow/followers/:userId` - Followers list
- `GET /api/v1/follow/following/:userId` - Following list

### Tracking
- `GET /api/v1/weight-logs` - List
- `POST /api/v1/weight-logs` - Create
- `GET /api/v1/progress-photos` - List
- `POST /api/v1/progress-photos` - Upload

### Notifications
- `GET /api/v1/notifications` - List
- `GET /api/v1/notifications/unread-count` - Count
- `POST /api/v1/notifications/:id/read` - Mark read

### Admin
- `GET /api/v1/admin/stats` - Dashboard stats
- `PATCH /api/v1/admin/plans/:id/approve` - Approve plan
- `PATCH /api/v1/admin/users/:id/ban` - Ban user

## 🎨 Tech Stack

### Frontend
- Next.js 15 (App Router, RSC)
- TypeScript (strict)
- Tailwind CSS v4
- shadcn/ui components
- React Hook Form + Zod
- Recharts (graphs)

### Backend
- Next.js API Routes
- Prisma ORM
- MySQL 8
- NextAuth v5
- Redis (rate limiting + cache)

### Infrastructure
- Ubuntu 24.04
- PM2 (process manager)
- Nginx (reverse proxy)
- MySQL (database)
- Redis (cache)

## 📁 Folder Structure

```
/src
  /app
    /(public)
      /page.tsx                 -> Landing
      /kesfet/page.tsx          -> Explore
      /plan/[slug]/page.tsx     -> Plan detail
      /profil/[username]/page.tsx -> Profile
    /giris/page.tsx             -> Login
    /kayit/page.tsx             -> Register
    /dashboard/page.tsx         -> Dashboard
    /plan-ekle/page.tsx         -> Create plan
    /planlarim/page.tsx         -> My plans
    /favorilerim/page.tsx       -> Favorites
    /kilo-takibi/page.tsx       -> Weight tracking
    /fotograflar/page.tsx       -> Photos
    /ayarlar/page.tsx           -> Settings
    /admin
      /page.tsx                 -> Admin dashboard
      /planlar/page.tsx         -> Plan moderation
      /kullanicilar/page.tsx    -> User management
      /yorumlar/page.tsx        -> Comment moderation
    /api
      /auth/[...nextauth]/route.ts
      /v1
        /plans/route.ts
        /comments/route.ts
        /follow/route.ts
        /weight-logs/route.ts
        /notifications/route.ts
        /admin/route.ts
  /components
    /ui                         -> shadcn components
    /layout                     -> Header, Footer, Sidebar
    /plan                       -> PlanCard, PlanForm, PlanDetail
    /profile                    -> ProfileCard, ProfileStats
    /tracking                   -> WeightChart, PhotoGallery
    /admin                      -> AdminTable, AdminStats
  /lib
    /auth.ts                    -> NextAuth config
    /db.ts                      -> Prisma client
    /redis.ts                   -> Redis client
    /rate-limit.ts              -> Rate limiting
    /sanitize.ts                -> XSS sanitization
    /utils.ts                   -> Helpers
  /services
    /plan.service.ts            -> Plan business logic
    /user.service.ts            -> User business logic
    /notification.service.ts    -> Notification logic
  /types
    /index.ts                   -> TypeScript types
  /validations
    /plan.schema.ts             -> Zod schemas
    /user.schema.ts
/prisma
  /schema.prisma
  /migrations
/public
  /images
  /icons
/config
  /ecosystem.config.js          -> PM2 config
  /nginx.conf.example           -> Nginx config
/scripts
  /backup-db.sh                 -> Database backup
  /healthcheck.mjs              -> Health check
.env.example
package.json
tsconfig.json
tailwind.config.ts
next.config.js
README.md
```

## 🔐 Security

- Zod validation on all inputs
- XSS sanitization (server-side)
- Rate limiting (Redis)
  - Login: 5 attempts/15min
  - Plan create: 10/hour
  - Comment: 20/hour
- CSRF protection (NextAuth)
- SQL injection protection (Prisma)
- RBAC (USER, ADMIN)

## 🚀 Performance

- ISR for public pages (revalidate: 60s)
- Redis cache for hot paths
- Image optimization (next/image)
- Database indexes
- Pagination (20 items/page)

## 📊 Success Metrics

- User registration rate
- Plan creation rate
- Comment/engagement rate
- Daily active users (DAU)
- 7-day retention
- Average weight loss

## 🎯 MVP Timeline (3 Months)

### Month 1: Core Features
- Week 1-2: Setup + Auth + Database
- Week 3-4: Plan CRUD + Basic UI

### Month 2: Social Features
- Week 5-6: Comments + Likes + Follow
- Week 7-8: Tracking + Photos

### Month 3: Polish + Admin
- Week 9-10: Admin panel + Moderation
- Week 11-12: Testing + Deployment

## ✅ MVP Acceptance Criteria

- [ ] User can register and login
- [ ] User can create and publish a plan
- [ ] User can browse and search plans
- [ ] User can like and comment on plans
- [ ] User can follow other users
- [ ] User can track weight with graph
- [ ] User can upload progress photos
- [ ] User receives notifications
- [ ] Admin can moderate plans
- [ ] Admin can manage users
- [ ] App is deployed and accessible
- [ ] Mobile responsive
- [ ] Performance: Lighthouse > 80

## 🚫 NOT in MVP (Future)

- AI recommendations
- Voice notes
- Seasons & Leagues
- Guilds
- Battle Pass
- Advanced gamification
- Email campaigns
- Webhooks
- A/B testing
- Analytics dashboard
