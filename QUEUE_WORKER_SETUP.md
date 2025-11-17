# Queue & Worker Setup Guide

Bu dokümantasyon, İtiraf Duvarı özelliği için Redis queue ve worker sisteminin kurulumu ve kullanımını açıklar.

## 📋 İçindekiler

- [Gereksinimler](#gereksinimler)
- [Kurulum](#kurulum)
- [Worker'ları Çalıştırma](#workerlari-calistirma)
- [Queue Sistemi](#queue-sistemi)
- [Cron Jobs](#cron-jobs)
- [Cache Sistemi](#cache-sistemi)
- [Performance Optimization](#performance-optimization)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🔧 Gereksinimler

- **Redis**: 4.0 veya üzeri
- **Node.js**: 20.0 veya üzeri
- **pnpm**: 8.0 veya üzeri

## 📦 Kurulum

### 1. Redis Kurulumu

**Windows (XAMPP ile):**
```bash
# Redis'i indirin ve çalıştırın
# Varsayılan port: 6379
```

**Linux/Mac:**
```bash
# Redis'i yükleyin
sudo apt-get install redis-server  # Ubuntu/Debian
brew install redis                  # macOS

# Redis'i başlatın
redis-server
```

### 2. Environment Variables

`.env` dosyanıza Redis ayarlarını ekleyin:

```env
# Redis Configuration
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=

# OpenAI API (AI yanıtlar için)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Dependencies

Gerekli paketler zaten yüklü:
```bash
pnpm install
```

## 🚀 Worker'ları Çalıştırma

### Development Ortamında

**Tüm worker'ları ayrı terminallerde çalıştırın:**

```bash
# Terminal 1: Next.js development server
pnpm dev

# Terminal 2: AI Response Worker
pnpm worker:ai

# Terminal 3: Cron Jobs Worker
pnpm worker:cron
```

### Production Ortamında

**PM2 ile çalıştırma (önerilen):**

```bash
# PM2'yi yükleyin
npm install -g pm2

# Worker'ları başlatın
pm2 start pnpm --name "ai-worker" -- worker:ai
pm2 start pnpm --name "cron-worker" -- worker:cron

# Durumu kontrol edin
pm2 status

# Logları görüntüleyin
pm2 logs ai-worker
pm2 logs cron-worker

# Worker'ları durdurun
pm2 stop all

# Worker'ları yeniden başlatın
pm2 restart all
```

## 📨 Queue Sistemi

### AI Response Generation Queue

**Nasıl Çalışır:**

1. Kullanıcı itiraf oluşturur
2. İtiraf veritabanına kaydedilir (status: `pending`)
3. AI yanıt üretimi için job queue'ya eklenir
4. Worker job'ı alır ve AI yanıtı üretir
5. Confession güncellenir (status: `published`)

**Queue Özellikleri:**

- **Concurrency**: 5 (aynı anda 5 job işlenir)
- **Retry**: 3 deneme
- **Timeout**: 10 saniye
- **Backoff**: Exponential (2s, 4s, 8s)

**Fallback Mekanizması:**

AI başarısız olursa:
1. Retry mekanizması devreye girer (3 deneme)
2. Tüm denemeler başarısız olursa fallback yanıt kullanılır
3. Confession yine de yayınlanır (kullanıcı deneyimi kesintisiz)

### Queue İstatistikleri

```typescript
import { getQueueStats } from '@/lib/queue';

const stats = await getQueueStats();
console.log(stats);
// {
//   waiting: 5,
//   active: 2,
//   completed: 150,
//   failed: 3,
//   delayed: 0,
//   total: 160
// }
```

## ⏰ Cron Jobs

### Popüler İtiraf Güncelleme

**Schedule**: Her 6 saatte bir (00:00, 06:00, 12:00, 18:00)

**Görev**:
- 100+ empati alan itirafları `isPopular: true` yapar
- İtiraf sahibine "Viral İtiraf" rozetini verir

**Manuel Çalıştırma**:
```typescript
import { updatePopularConfessions } from '@/services/confession.service';

await updatePopularConfessions();
```

## 💾 Cache Sistemi

### Cache TTL (Time To Live)

| Cache Type | TTL | Açıklama |
|------------|-----|----------|
| Feed | 5 dakika | İtiraf listesi |
| Popular | 1 saat | Popüler itiraflar |
| Stats | 1 saat | İstatistikler |
| Daily Limit | 24 saat | Günlük itiraf limiti |
| AI Response | 1 hafta | AI yanıtları |
| User Confessions | 10 dakika | Kullanıcı itirafları |

### Cache Invalidation

Cache otomatik olarak temizlenir:

- **Yeni itiraf**: Feed, Stats, User Confessions cache'i temizlenir
- **Empati ekleme/kaldırma**: Feed, Popular, Stats cache'i temizlenir
- **İtiraf güncelleme**: İlgili tüm cache'ler temizlenir

### Manuel Cache Temizleme

```typescript
import {
  clearFeedCache,
  clearPopularCache,
  clearStatsCache,
  clearAllConfessionCaches,
} from '@/lib/cache';

// Tüm feed cache'lerini temizle
await clearFeedCache();

// Popüler itiraflar cache'ini temizle
await clearPopularCache();

// İstatistikler cache'ini temizle
await clearStatsCache();

// Tüm confession cache'lerini temizle
await clearAllConfessionCaches();
```

## ⚡ Performance Optimization

### 1. Database Query Optimization

**Select Only Needed Fields:**
```typescript
// ❌ Kötü: Tüm alanları seç
const confessions = await prisma.confession.findMany();

// ✅ İyi: Sadece gerekli alanları seç
const confessions = await prisma.confession.findMany({
  select: {
    id: true,
    content: true,
    category: true,
    empathyCount: true,
    // ... sadece gerekli alanlar
  },
});
```

### 2. Cursor-Based Pagination

Offset-based pagination yerine cursor-based kullanın (daha performanslı):

```typescript
import { getConfessionsCursor } from '@/services/confession.service';

// İlk sayfa
const page1 = await getConfessionsCursor({}, { limit: 20 });

// Sonraki sayfa
const page2 = await getConfessionsCursor({}, {
  cursor: page1.nextCursor,
  limit: 20,
});
```

### 3. Eager Loading

İlişkili verileri tek sorguda çekin:

```typescript
// ❌ Kötü: N+1 query problemi
const confessions = await prisma.confession.findMany();
for (const confession of confessions) {
  const user = await prisma.user.findUnique({ where: { id: confession.userId } });
}

// ✅ İyi: Eager loading
const confessions = await prisma.confession.findMany({
  include: {
    user: {
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
      },
    },
  },
});
```

### 4. Image Lazy Loading

Next.js Image component kullanın:

```tsx
import Image from 'next/image';

<Image
  src={user.image}
  alt={user.name}
  width={40}
  height={40}
  loading="lazy"
  placeholder="blur"
  blurDataURL={getBlurDataURL()}
/>
```

## 📊 Monitoring

### Queue Monitoring

```typescript
import { aiResponseQueue } from '@/lib/queue';

// Event listeners
aiResponseQueue.on('completed', (job, result) => {
  console.log(`✓ Job ${job.id} completed`);
});

aiResponseQueue.on('failed', (job, error) => {
  console.error(`❌ Job ${job.id} failed:`, error);
});

aiResponseQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} stalled`);
});
```

### Performance Monitoring

```typescript
import { measureQueryTime } from '@/lib/performance';

const confessions = await measureQueryTime(
  'getConfessions',
  () => getConfessions({ category: 'night_attack' })
);
// ✓ Query getConfessions completed in 45ms
```

### Memory Monitoring

```typescript
import { logMemoryUsage } from '@/lib/performance';

logMemoryUsage('Before query');
const result = await heavyQuery();
logMemoryUsage('After query');
```

## 🔍 Troubleshooting

### Redis Bağlantı Hatası

**Hata**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**Çözüm**:
1. Redis'in çalıştığından emin olun: `redis-cli ping` (PONG dönmeli)
2. `.env` dosyasındaki Redis ayarlarını kontrol edin
3. Firewall ayarlarını kontrol edin

### Worker Çalışmıyor

**Hata**: Worker başlatıldı ama job'lar işlenmiyor

**Çözüm**:
1. Redis bağlantısını kontrol edin
2. Worker loglarını kontrol edin: `pm2 logs ai-worker`
3. Queue'da bekleyen job var mı kontrol edin:
   ```typescript
   const stats = await getQueueStats();
   console.log(stats);
   ```

### AI Timeout

**Hata**: OpenAI API timeout (5s)

**Çözüm**:
1. OpenAI API key'in geçerli olduğundan emin olun
2. İnternet bağlantınızı kontrol edin
3. Fallback yanıt kullanılacak, endişelenmeyin

### Cache Çalışmıyor

**Hata**: Cache'den veri gelmiyor

**Çözüm**:
1. Redis'in çalıştığından emin olun
2. Cache key'leri kontrol edin: `redis-cli KEYS "confessions:*"`
3. TTL'leri kontrol edin: `redis-cli TTL "confessions:feed:p:1:l:20"`

### Memory Leak

**Hata**: Memory kullanımı sürekli artıyor

**Çözüm**:
1. Worker'ları yeniden başlatın: `pm2 restart all`
2. Redis memory kullanımını kontrol edin: `redis-cli INFO memory`
3. Cache TTL'lerini gözden geçirin
4. Eski job'ları temizleyin:
   ```typescript
   import { cleanQueue } from '@/lib/queue';
   await cleanQueue();
   ```

## 📚 Daha Fazla Bilgi

- [Bull Documentation](https://github.com/OptimalBits/bull)
- [Redis Documentation](https://redis.io/documentation)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

## 🆘 Destek

Sorun yaşıyorsanız:
1. Bu dokümantasyonu kontrol edin
2. Worker loglarını inceleyin
3. Redis loglarını inceleyin
4. GitHub Issues'da sorun açın

---

**Not**: Production ortamında mutlaka monitoring ve alerting sistemi kurun (Sentry, Datadog, vb.)
