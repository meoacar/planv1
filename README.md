# ZayiflamaPlanim.com — MVP

Gerçek insanların gerçek zayıflama planlarını paylaştığı, topluluk destekli platform.

## 🚀 Özellikler

- ✅ Kullanıcı kayıt/giriş (Email + Google OAuth)
- ✅ Plan oluşturma ve paylaşma
- ✅ Plan keşfetme (arama, filtre)
- ✅ Sosyal etkileşim (beğeni, yorum, takip)
- ✅ Kilo takibi (grafik)
- ✅ Fotoğraf paylaşımı (önce/sonra)
- ✅ Bildirimler
- ✅ Admin paneli (moderasyon)

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router, RSC)
- **Database:** MySQL 8 + Prisma ORM
- **Auth:** NextAuth v5
- **Cache:** Redis
- **UI:** Tailwind CSS + shadcn/ui
- **Validation:** Zod + React Hook Form

## 📋 Gereksinimler

- Node.js 20+
- pnpm 8+
- MySQL 8+
- Redis 7+ (opsiyonel - rate limiting ve cache için)

## 🏁 Kurulum

### 1. Projeyi klonlayın

```bash
git clone <repo-url>
cd zayiflamaplanim
```

### 2. Bağımlılıkları yükleyin

```bash
pnpm install
```

### 3. Environment variables

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
DATABASE_URL="mysql://root:password@localhost:3306/zayiflamaplanim"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
```

### 4. Database setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# (Optional) Open Prisma Studio
pnpm db:studio
```

### 5. Redis'i başlatın (Opsiyonel)

**Geliştirme ortamı için:**
```bash
redis-server
```

**Canlı ortam için (Önerilen):**
- [Upstash](https://upstash.com/) ücretsiz hesap oluştur
- Redis database oluştur
- `REDIS_URL` environment variable'ını ekle
- Detaylı kurulum: `docs/REDIS_HIZLI_KURULUM.md`

> **Not:** Redis olmadan da uygulama çalışır. Redis yoksa rate limiting ve cache devre dışı kalır.

### 6. Development server

```bash
pnpm dev
```

Tarayıcıda açın: [http://localhost:3000](http://localhost:3000)

## 📁 Proje Yapısı

```
/src
  /app                  -> Next.js pages
  /components           -> React components
  /lib                  -> Utilities (db, redis, auth)
  /services             -> Business logic
  /validations          -> Zod schemas
  /types                -> TypeScript types
/prisma
  /schema.prisma        -> Database schema
  /migrations           -> Database migrations
/public                 -> Static files
```

## 🗄️ Database Schema

### Core Models
- **User** - Kullanıcı bilgileri
- **Plan** - Diyet planları
- **PlanDay** - Günlük menüler
- **Comment** - Yorumlar
- **Like** - Beğeniler
- **Follow** - Takip ilişkileri
- **WeightLog** - Kilo kayıtları
- **ProgressPhoto** - İlerleme fotoğrafları
- **Notification** - Bildirimler

## 🔐 Authentication

NextAuth v5 kullanılıyor:
- Email/Password (Credentials)
- Google OAuth

## 🎨 UI Components

shadcn/ui component library kullanılıyor:
- Button, Input, Card, Dialog, etc.
- Tailwind CSS ile özelleştirilebilir

## 📊 Admin Panel

`/admin` rotasından erişilebilir (sadece ADMIN rolü):
- Plan moderasyonu
- Kullanıcı yönetimi
- Yorum moderasyonu
- İstatistikler

## 🚀 Production Deployment

### Vercel'e Deploy

1. **GitHub'a push**
   ```bash
   git push origin main
   ```

2. **Vercel'e import et**
   - [vercel.com](https://vercel.com) hesabı oluştur
   - "Import Project" > GitHub repo seç
   - Otomatik deploy başlar

3. **Environment Variables Ekle**
   ```
   DATABASE_URL=mysql://...
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=https://your-app.vercel.app
   REDIS_URL=redis://... (Upstash'ten al)
   ```

4. **Database Migration**
   ```bash
   pnpm db:migrate:deploy
   ```

### Redis Kurulumu (Canlı Ortam)

**⚡ 5 dakikada kurulum:**
```
1. https://upstash.com/ → Ücretsiz hesap
2. Redis database oluştur (Europe/Frankfurt)
3. REDIS_URL kopyala
4. Vercel Environment Variables'a ekle
5. Redeploy
```

Detaylı kurulum: `docs/REDIS_HIZLI_KURULUM.md`

### Build (Manuel Deploy)

```bash
pnpm build
```

### Start (Manuel Deploy)

```bash
pnpm start
```

## 📝 Scripts

- `pnpm dev` - Development server
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to DB (dev)
- `pnpm db:migrate` - Create migration (dev)
- `pnpm db:migrate:deploy` - Run migrations (prod)
- `pnpm db:studio` - Open Prisma Studio

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Credits

Built with ❤️ by the ZayiflamaPlanim.com team
