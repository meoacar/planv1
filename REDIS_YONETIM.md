# Redis Yönetimi - Admin Panel

## ✅ Tamamlanan Özellikler

### 1. Redis İstatistikleri
Admin panelinde Redis cache metrikleri görüntüleniyor:
- Redis versiyon bilgisi
- Uptime (çalışma süresi)
- Bağlı istemci sayısı
- Toplam key sayısı
- Kullanılan bellek (current ve peak)
- İşlem/saniye (ops/sec)
- Hit rate (cache başarı oranı)

### 2. Redis Key Listesi
- Aktif cache key'lerinin listesi (ilk 50)
- Her key için:
  - Key adı
  - Veri tipi (string, hash, list, vb.)
  - TTL (Time To Live) süresi

### 3. Redis Cache Yönetimi
- **Cache Temizle**: Uygulama cache'ini temizler
- **Redis Temizle**: Tüm Redis cache'ini temizler (onay gerektirir)
- **Servisleri Yenile**: Servisleri yeniden başlatır

### 4. Servis Durumu
Redis servisi için durum göstergesi:
- ✅ Çalışıyor (healthy)
- ⚠️ Yapılandırılmamış (not_configured)
- ❌ Hata (error)

## 📋 Kurulum

### 🖥️ Geliştirme Ortamı (Windows)

1. **Redis İndir**
   ```
   https://github.com/microsoftarchive/redis/releases
   Redis-x64-3.0.504.msi indir ve kur
   ```

2. **Redis Servisini Başlat**
   ```cmd
   redis-server
   ```
   
   Veya Windows Service olarak:
   ```cmd
   redis-server --service-install
   redis-server --service-start
   ```

3. **Ortam Değişkenlerini Ayarla**
   
   `.env` dosyasına ekle:
   ```env
   REDIS_URL=redis://localhost:6379
   ```

4. **Uygulamayı Yeniden Başlat**
   ```bash
   pnpm dev
   ```

### ☁️ Canlı Ortam (Production)

#### Seçenek 1: Upstash Redis (Önerilen - Ücretsiz Plan)
**En kolay ve ücretsiz seçenek**

1. **Upstash Hesabı Oluştur**
   - https://upstash.com/ adresine git
   - GitHub ile giriş yap (ücretsiz)

2. **Redis Database Oluştur**
   - "Create Database" butonuna tıkla
   - İsim ver (örn: zayiflama-plan-cache)
   - Region seç (Europe/Frankfurt - Türkiye'ye yakın)
   - Type: Regional (ücretsiz)
   - "Create" butonuna tıkla

3. **Connection String Al**
   - Database detaylarında "REDIS_URL" değerini kopyala
   - Örnek: `redis://default:xxxxx@eu1-xxxxx.upstash.io:6379`

4. **Vercel'e Ekle**
   - Vercel Dashboard > Proje > Settings > Environment Variables
   - `REDIS_URL` ekle ve değeri yapıştır
   - Production, Preview, Development ortamları için işaretle
   - "Save" butonuna tıkla

5. **Redeploy**
   - Deployments sekmesine git
   - Son deployment'ın yanındaki "..." menüsünden "Redeploy"

**Upstash Ücretsiz Plan:**
- 10,000 komut/gün
- 256 MB depolama
- TLS/SSL güvenlik
- Çoğu küçük-orta proje için yeterli

#### Seçenek 2: Railway Redis
**Kolay kurulum, ücretli**

1. **Railway Hesabı Oluştur**
   - https://railway.app/ adresine git
   - GitHub ile giriş yap

2. **Redis Ekle**
   - "New Project" > "Add Redis"
   - Otomatik olarak Redis instance oluşturulur

3. **Connection String Al**
   - Redis service'e tıkla
   - "Connect" sekmesinde `REDIS_URL` değerini kopyala

4. **Vercel'e Ekle**
   - Environment Variables'a `REDIS_URL` ekle

**Railway Fiyatlandırma:**
- $5/ay'dan başlayan planlar
- Pay-as-you-go model

#### Seçenek 3: Redis Cloud (Redis Labs)
**Profesyonel çözüm**

1. **Redis Cloud Hesabı**
   - https://redis.com/try-free/ adresine git
   - Ücretsiz hesap oluştur

2. **Database Oluştur**
   - "New Database" butonuna tıkla
   - Free tier seç (30 MB)
   - Region seç

3. **Connection String Al**
   - Database detaylarından endpoint ve password al
   - Format: `redis://default:PASSWORD@HOST:PORT`

**Redis Cloud Ücretsiz Plan:**
- 30 MB depolama
- Sınırsız bağlantı
- Yüksek performans

#### Seçenek 4: Vercel KV (Upstash Tabanlı)
**Vercel entegrasyonu**

1. **Vercel Dashboard**
   - Proje > Storage > Create Database
   - "KV" seç (Redis tabanlı)

2. **Otomatik Kurulum**
   - Vercel otomatik olarak environment variables ekler
   - `KV_REST_API_URL` ve `KV_REST_API_TOKEN` oluşturulur

3. **Kod Değişikliği Gerekli**
   ```typescript
   // src/lib/redis.ts dosyasını güncelle
   import { createClient } from '@vercel/kv'
   export const redis = createClient({
     url: process.env.KV_REST_API_URL,
     token: process.env.KV_REST_API_TOKEN,
   })
   ```

**Vercel KV Fiyatlandırma:**
- Hobby: Ücretsiz (256 MB, 10K komut/gün)
- Pro: $1/100K komut

### 🎯 Hangi Seçeneği Seçmeliyim?

| Seçenek | Ücretsiz Plan | Kurulum | Önerilen |
|---------|---------------|---------|----------|
| **Upstash** | ✅ 10K komut/gün | ⭐⭐⭐⭐⭐ Çok Kolay | ✅ **En İyi** |
| **Vercel KV** | ✅ 10K komut/gün | ⭐⭐⭐⭐⭐ Çok Kolay | ✅ Vercel için |
| **Redis Cloud** | ✅ 30 MB | ⭐⭐⭐⭐ Kolay | ✅ Profesyonel |
| **Railway** | ❌ Ücretli | ⭐⭐⭐⭐ Kolay | Bütçe varsa |

### 💡 Önerilen Kurulum (Upstash)

**5 dakikada kurulum:**

```bash
# 1. Upstash'e git ve database oluştur
https://upstash.com/

# 2. REDIS_URL'i kopyala
redis://default:xxxxx@eu1-xxxxx.upstash.io:6379

# 3. Vercel'e ekle
Vercel Dashboard > Settings > Environment Variables
REDIS_URL = redis://default:xxxxx@eu1-xxxxx.upstash.io:6379

# 4. Redeploy
Deployments > ... > Redeploy
```

**Test Et:**
- Canlı siteye git: `https://your-app.vercel.app/admin/sistem`
- "Servis Durumu" bölümünde Redis'in "Çalışıyor" olduğunu kontrol et
- "Redis Cache İstatistikleri" kartını gör

### Redis Bağlantısını Test Et

1. Admin paneline git: `/admin/sistem`
2. "Servis Durumu" bölümünde Redis'in durumunu kontrol et
3. Redis çalışıyorsa "Redis Cache İstatistikleri" kartı görünecek

## 🎯 Kullanım

### Cache Temizleme

**Uygulama Cache:**
- Sağ üstteki "Cache Temizle" butonuna tıkla
- Settings cache ve diğer uygulama cache'leri temizlenir

**Redis Cache:**
- Sağ üstteki "Redis Temizle" butonuna tıkla
- Onay dialogunda "Temizle" butonuna tıkla
- Tüm Redis verileri silinir (rate limiting sayaçları dahil)

### İstatistikleri Görüntüleme

Admin panelinde otomatik olarak gösterilir:
- Sistem metrikleri (CPU, RAM, Uptime)
- Servis durumları (Database, Redis, Email)
- Redis istatistikleri (eğer Redis aktifse)
- Database istatistikleri
- Yedekleme bilgileri

## 🔧 Teknik Detaylar

### Redis Yapılandırması
Dosya: `src/lib/redis.ts`

```typescript
// REDIS_URL veya ayrı ayarları destekler
const redisConfig = process.env.REDIS_URL 
  ? { url: process.env.REDIS_URL }
  : {
      socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      password: process.env.REDIS_PASSWORD || undefined,
    }
```

### Graceful Fallback
Redis bağlantısı yoksa:
- Rate limiting devre dışı kalır (tüm istekler geçer)
- Cache atlanır (direkt fonksiyon çağrılır)
- Uygulama normal çalışmaya devam eder

### Admin Actions
Dosya: `src/app/admin/sistem/actions.ts`

Yeni fonksiyonlar:
- `getRedisStats()`: Redis istatistiklerini getirir
- `getRedisKeys()`: Redis key listesini getirir
- `clearRedisCache()`: Tüm Redis cache'ini temizler

## 📊 Metrikler

### Hit Rate Hesaplama
```typescript
hitRate = (keyspace_hits / (keyspace_hits + keyspace_misses)) * 100
```

### Uptime Formatı
```typescript
// Örnek: "2 gün, 5 saat, 30 dakika"
formatUptime(seconds)
```

## ⚠️ Önemli Notlar

1. **Redis Opsiyonel**: Redis olmadan da uygulama çalışır
2. **Rate Limiting**: Redis yoksa rate limiting devre dışı kalır
3. **Cache**: Redis yoksa cache atlanır
4. **Production**: Production'da Redis kullanılması önerilir
5. **Güvenlik**: Production'da Redis şifre korumalı olmalı
6. **Upstash Önerisi**: Ücretsiz ve kolay kurulum için Upstash kullan
7. **Connection String**: Mutlaka `REDIS_URL` environment variable'ını ekle

## 🔒 Güvenlik

### Production Checklist

- ✅ Redis şifre korumalı olmalı
- ✅ TLS/SSL bağlantı kullan (Upstash otomatik sağlar)
- ✅ REDIS_URL'i environment variable olarak sakla (kod içinde değil)
- ✅ Firewall kuralları ayarla (sadece uygulama sunucusu erişebilmeli)
- ✅ Düzenli yedekleme yap (Upstash otomatik yapar)

### Upstash Güvenlik Özellikleri

- 🔐 TLS/SSL şifreleme (varsayılan)
- 🔑 Güçlü şifre oluşturma (otomatik)
- 🌍 Global replication (opsiyonel)
- 💾 Otomatik yedekleme
- 🛡️ DDoS koruması

## 🚀 Sonraki Adımlar

Önerilen geliştirmeler:
- [ ] Redis Cluster desteği
- [ ] Cache invalidation stratejileri
- [ ] Redis Sentinel desteği
- [ ] Detaylı cache analytics
- [ ] Key pattern bazlı temizleme
- [ ] Cache warming stratejileri

## 📝 Değişiklik Geçmişi

### v1.0.0 (2024-11-12)
- ✅ Redis istatistikleri eklendi
- ✅ Redis key listesi eklendi
- ✅ Redis cache temizleme eklendi
- ✅ Servis durumu göstergesi eklendi
- ✅ Graceful fallback implementasyonu
- ✅ Admin panel entegrasyonu
