# Production Deployment Guide

Bu dokuman, Confession Wall özelliğinin production ortamına deploy edilmesi için gerekli adımları içerir.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

- [ ] `.env.production` dosyası oluşturuldu
- [ ] `NEXTAUTH_SECRET` güçlü bir değerle ayarlandı (`openssl rand -base64 32`)
- [ ] `DATABASE_URL` production veritabanına işaret ediyor
- [ ] `REDIS_URL` production Redis'e işaret ediyor
- [ ] `OPENAI_API_KEY` geçerli ve aktif
- [ ] `RESEND_API_KEY` production key ile ayarlandı
- [ ] Tüm kritik environment variables kontrol edildi

### 2. Database

- [ ] Production veritabanı oluşturuldu
- [ ] Database migrations çalıştırıldı (`pnpm db:migrate:deploy`)
- [ ] Seed data yüklendi (badges, seasonal themes)
- [ ] Database backup stratejisi kuruldu
- [ ] Backup cron job ayarlandı
- [ ] Database connection pool ayarları optimize edildi

### 3. Redis

- [ ] Production Redis instance kuruldu
- [ ] Redis password ayarlandı
- [ ] Redis persistence (AOF/RDB) konfigüre edildi
- [ ] Redis maxmemory policy ayarlandı (`allkeys-lru`)
- [ ] Redis monitoring aktif

### 4. OpenAI API

- [ ] OpenAI API key oluşturuldu
- [ ] Usage limits kontrol edildi
- [ ] Billing ayarlandı
- [ ] Rate limits belirlendi
- [ ] Fallback responses hazırlandı

### 5. Monitoring & Error Tracking

- [ ] Sentry projesi oluşturuldu
- [ ] Sentry DSN environment variable'a eklendi
- [ ] Vercel Analytics aktif
- [ ] Custom metrics endpoint konfigüre edildi
- [ ] Alert rules ayarlandı

### 6. Security

- [ ] HTTPS sertifikası kuruldu
- [ ] CORS ayarları yapıldı
- [ ] Rate limiting aktif
- [ ] Content Security Policy ayarlandı
- [ ] SQL injection koruması test edildi
- [ ] XSS koruması test edildi

### 7. Performance

- [ ] Redis cache aktif
- [ ] Database indexes oluşturuldu
- [ ] Image optimization ayarlandı
- [ ] CDN konfigüre edildi (opsiyonel)
- [ ] Load testing yapıldı

### 8. Testing

- [ ] Staging ortamında test edildi
- [ ] API endpoints test edildi
- [ ] AI response generation test edildi
- [ ] Queue worker test edildi
- [ ] Cron jobs test edildi
- [ ] Error scenarios test edildi

## 🚀 Deployment Steps

### Step 1: Environment Setup

```bash
# 1. Production environment variables dosyasını oluştur
cp .env.production.example .env.production

# 2. Tüm değerleri güncelle
nano .env.production

# 3. Environment variables'ı doğrula
node -e "require('dotenv').config({path:'.env.production'}); console.log('✓ Environment loaded')"
```

### Step 2: Database Migration

```bash
# 1. Database connection'ı test et
pnpm prisma db pull --schema=./prisma/schema.prisma

# 2. Migrations'ı deploy et (VERİ KAYBI RİSKİ!)
# ⚠️ ÖNCE BACKUP AL!
./scripts/backup-database.sh

# 3. Migrations'ı çalıştır
pnpm db:migrate:deploy

# 4. Prisma client'ı generate et
pnpm db:generate

# 5. Seed data'yı yükle
pnpm db:seed
```

### Step 3: Redis Setup

```bash
# 1. Redis connection'ı test et
redis-cli -h <REDIS_HOST> -p <REDIS_PORT> -a <REDIS_PASSWORD> ping

# 2. Redis konfigürasyonunu kontrol et
redis-cli -h <REDIS_HOST> -p <REDIS_PORT> -a <REDIS_PASSWORD> CONFIG GET maxmemory-policy

# 3. Gerekirse maxmemory-policy ayarla
redis-cli -h <REDIS_HOST> -p <REDIS_PORT> -a <REDIS_PASSWORD> CONFIG SET maxmemory-policy allkeys-lru
```

### Step 4: Build & Deploy

```bash
# 1. Dependencies'leri yükle
pnpm install --frozen-lockfile

# 2. Production build
pnpm build

# 3. Build'i test et
NODE_ENV=production pnpm start

# 4. Deploy (Vercel/Railway/Custom)
# Vercel:
vercel --prod

# Railway:
railway up

# Custom server:
pm2 start npm --name "zayiflamaplan" -- start
```

### Step 5: Background Workers

```bash
# 1. AI Response Worker'ı başlat
pm2 start "pnpm worker:ai" --name "ai-worker"

# 2. Cron Jobs Worker'ı başlat
pm2 start "pnpm worker:cron" --name "cron-worker"

# 3. Worker'ları kontrol et
pm2 status

# 4. Logs'ları izle
pm2 logs
```

### Step 6: Backup Automation

```bash
# 1. Backup script'ine execute permission ver
chmod +x scripts/backup-database.sh
chmod +x scripts/restore-database.sh

# 2. Cron job ekle (her gece 02:00)
crontab -e

# Aşağıdaki satırı ekle:
0 2 * * * /path/to/zayiflamaplan/scripts/backup-database.sh >> /var/log/db-backup.log 2>&1

# 3. Backup'ı manuel test et
./scripts/backup-database.sh
```

### Step 7: Monitoring Setup

```bash
# 1. Sentry'yi test et
curl -X POST https://sentry.io/api/0/projects/<ORG>/<PROJECT>/keys/ \
  -H "Authorization: Bearer <SENTRY_AUTH_TOKEN>"

# 2. Test error gönder
node -e "
const Sentry = require('@sentry/nextjs');
Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN });
Sentry.captureMessage('Test deployment');
"

# 3. Metrics endpoint'i test et
curl -X POST https://metrics.zayiflamaplan.com/api/metrics \
  -H "Authorization: Bearer <METRICS_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"metric":"test","value":1}'
```

## 🔍 Post-Deployment Verification

### 1. Health Checks

```bash
# API health check
curl https://zayiflamaplan.com/api/health

# Database connection
curl https://zayiflamaplan.com/api/health/db

# Redis connection
curl https://zayiflamaplan.com/api/health/redis

# OpenAI connection
curl https://zayiflamaplan.com/api/health/openai
```

### 2. Functional Tests

- [ ] Kullanıcı kaydı çalışıyor
- [ ] Login çalışıyor
- [ ] İtiraf oluşturma çalışıyor
- [ ] AI yanıt üretiliyor
- [ ] Empati gösterme çalışıyor
- [ ] Feed yükleniyor
- [ ] Admin panel erişilebilir
- [ ] Moderasyon çalışıyor

### 3. Performance Tests

```bash
# Load test (Apache Bench)
ab -n 1000 -c 10 https://zayiflamaplan.com/api/v1/confessions

# Response time test
curl -w "@curl-format.txt" -o /dev/null -s https://zayiflamaplan.com/api/v1/confessions
```

### 4. Monitoring Verification

- [ ] Sentry'de error tracking çalışıyor
- [ ] Vercel Analytics data geliyor
- [ ] Custom metrics kaydediliyor
- [ ] Alert rules test edildi

## 🔄 Rollback Plan

Deployment başarısız olursa:

```bash
# 1. Önceki version'a dön
vercel rollback

# 2. Database'i restore et
./scripts/restore-database.sh ./backups/zayiflamaplan_backup_YYYYMMDD_HHMMSS.sql.gz

# 3. Redis'i flush et (cache temizle)
redis-cli -h <REDIS_HOST> -p <REDIS_PORT> -a <REDIS_PASSWORD> FLUSHDB

# 4. Worker'ları restart et
pm2 restart all

# 5. Logs'ları kontrol et
pm2 logs --lines 100
```

## 📊 Monitoring Dashboards

### Sentry Dashboard
- URL: https://sentry.io/organizations/<ORG>/projects/<PROJECT>/
- Metrics: Error rate, response time, user impact

### Vercel Analytics
- URL: https://vercel.com/<TEAM>/<PROJECT>/analytics
- Metrics: Page views, performance, Web Vitals

### Custom Metrics
- Confession creation rate
- AI response success rate
- Queue processing time
- Cache hit rate
- Database query time

## 🚨 Alert Rules

### Critical Alerts (Immediate action required)

1. **Database Down**
   - Condition: Database connection fails
   - Action: Check database server, restart if needed

2. **Redis Down**
   - Condition: Redis connection fails
   - Action: Check Redis server, graceful degradation active

3. **OpenAI API Failure**
   - Condition: AI response success rate < 50%
   - Action: Check API key, usage limits, fallback active

4. **High Error Rate**
   - Condition: Error rate > 5%
   - Action: Check Sentry, investigate errors

### Warning Alerts (Monitor closely)

1. **Slow Response Time**
   - Condition: P95 response time > 2s
   - Action: Check database queries, cache hit rate

2. **Queue Overflow**
   - Condition: Queue size > 1000
   - Action: Scale workers, check processing time

3. **High Memory Usage**
   - Condition: Memory usage > 80%
   - Action: Check for memory leaks, restart if needed

## 📞 Support Contacts

- **DevOps Lead**: devops@zayiflamaplan.com
- **Backend Lead**: backend@zayiflamaplan.com
- **On-Call**: +90 XXX XXX XX XX

## 📚 Additional Resources

- [Database Migration Guide](./DATABASE_MIGRATION.md)
- [Redis Setup Guide](../REDIS_KURULUM.md)
- [Queue Worker Setup](../QUEUE_WORKER_SETUP.md)
- [Admin Guide](../.kiro/specs/confession-wall/admin-guide.md)
- [Moderation Best Practices](../.kiro/specs/confession-wall/moderation-best-practices.md)
