# 🚀 ZayiflamaPlan - Kurulum Rehberi

## ✅ Gereksinimler

- **Node.js** 20+ ([İndir](https://nodejs.org/))
- **pnpm** 8+ (Kurulum: `npm install -g pnpm`)
- **MySQL** 8+ ([İndir](https://dev.mysql.com/downloads/mysql/))
- **Redis** 7+ ([İndir](https://redis.io/download))

## 📦 Adım 1: Bağımlılıkları Yükle

```bash
pnpm install
```

## 🗄️ Adım 2: MySQL Database Oluştur

MySQL'e bağlan:

```bash
mysql -u root -p
```

Database oluştur:

```sql
CREATE DATABASE zayiflamaplan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## ⚙️ Adım 3: Environment Variables

`.env` dosyası oluştur:

```bash
cp .env.example .env
```

`.env` dosyasını düzenle:

```env
# Database
DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/zayiflamaplan?connection_limit=10&pool_timeout=30"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Google OAuth (opsiyonel)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

**NEXTAUTH_SECRET oluşturmak için:**

```bash
openssl rand -base64 32
```

## 🔧 Adım 4: Prisma Setup

Prisma client oluştur:

```bash
pnpm db:generate
```

Database migration çalıştır:

```bash
pnpm db:migrate
```

Migration adı sor: `init` yazıp Enter

## 🔴 Adım 5: Redis'i Başlat

Yeni terminal aç ve Redis'i başlat:

```bash
redis-server
```

## 🚀 Adım 6: Development Server

```bash
pnpm dev
```

Tarayıcıda aç: **http://localhost:3000**

## ✅ Başarılı Kurulum Kontrolü

Eğer şunları görüyorsan başarılı:

```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 1.2s
```

Tarayıcıda "ZayiflamaPlan" yazısını görmelisin! 🎉

## 🛠️ Ek Komutlar

```bash
# Prisma Studio (Database GUI)
pnpm db:studio

# Production build
pnpm build

# Production start
pnpm start

# Lint
pnpm lint
```

## ❌ Sorun Giderme

### MySQL bağlantı hatası

```
Error: P1001: Can't reach database server
```

**Çözüm:**
- MySQL çalışıyor mu kontrol et: `mysql -u root -p`
- `.env` dosyasındaki şifreyi kontrol et
- Database oluşturuldu mu kontrol et: `SHOW DATABASES;`

### Redis bağlantı hatası

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Çözüm:**
- Redis çalışıyor mu kontrol et: `redis-cli ping` (PONG dönmeli)
- Redis'i başlat: `redis-server`

### Port 3000 kullanımda

```
Error: Port 3000 is already in use
```

**Çözüm:**
- Farklı port kullan: `PORT=3001 pnpm dev`
- Veya 3000'i kullanan uygulamayı kapat

### Prisma migration hatası

```
Error: Migration failed
```

**Çözüm:**
- Database'i sıfırla (DEV ONLY!):
  ```bash
  mysql -u root -p
  DROP DATABASE zayiflamaplan;
  CREATE DATABASE zayiflamaplan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  EXIT;
  pnpm db:migrate
  ```

## 🎯 Sonraki Adımlar

1. **Admin kullanıcı oluştur** (Database'de manuel)
2. **Google OAuth ayarla** (opsiyonel)
3. **İlk planı oluştur**
4. **Test et!**

## 📚 Daha Fazla Bilgi

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Sorun mu yaşıyorsun?** Issue aç veya bize ulaş! 💪
