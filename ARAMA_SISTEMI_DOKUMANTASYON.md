# 🔍 Arama Sistemi Dokümantasyonu

## ✅ Tamamlanan Özellikler

### 1. FULLTEXT Search İndeksi
- **Durum**: ✅ Hazır (migration oluşturuldu, uygulanmayı bekliyor)
- **Tablo**: `plans`
- **Alanlar**: `title`, `description`
- **Avantajlar**:
  - Çok daha hızlı arama
  - Alakalılık skoru (relevance)
  - Doğal dil işleme
  - Büyük veritabanlarında optimize performans

### 2. API Endpoint'leri

#### `/api/v1/search` (YENİ) ✅
Gelişmiş arama endpoint'i - FULLTEXT search kullanır

**Method**: GET

**Query Parameters**:
- `q` (required): Arama terimi (min 2 karakter)
- `type` (optional): Arama tipi - `all`, `plans`, `users` (default: `all`)
- `page` (optional): Sayfa numarası (default: 1)
- `limit` (optional): Sayfa başına sonuç (default: 20)
- `difficulty` (optional): Plan zorluğu - `easy`, `medium`, `hard`
- `duration` (optional): Plan süresi - `short`, `medium`, `long`
- `tag` (optional): Tag filtresi

**Örnek Kullanım**:
```bash
# Genel arama
GET /api/v1/search?q=keto

# Sadece planları ara
GET /api/v1/search?q=keto&type=plans

# Filtreli arama
GET /api/v1/search?q=keto&difficulty=easy&duration=short

# Sayfalama
GET /api/v1/search?q=keto&page=2&limit=10
```

**Response**:
```json
{
  "query": "keto",
  "plans": [...],
  "users": [...],
  "plansCount": 15,
  "usersCount": 3,
  "total": 18,
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1,
    "hasMore": false
  }
}
```

#### `/api/plans/explore` (İYİLEŞTİRİLDİ) ✅
Mevcut keşfet endpoint'i optimize edildi

**Değişiklikler**:
- `mode: 'insensitive'` eklendi (büyük/küçük harf duyarsız)
- Tag araması eklendi
- Arama yapıldığında sonuçlar alakalılığa göre sıralanıyor
- Performans iyileştirmeleri

### 3. Search Service ✅
`src/services/search.service.ts`

**İki arama metodu**:

1. **`searchWithFullText()`**: FULLTEXT index kullanır (önerilen)
   - MySQL MATCH AGAINST kullanır
   - Alakalılık skoruna göre sıralar
   - Çok daha hızlı
   - Fallback mekanizması var

2. **`searchWithLike()`**: Basit LIKE sorgusu (fallback)
   - FULLTEXT çalışmazsa otomatik kullanılır
   - Eski sistemlerle uyumlu

### 4. Keşfet Sayfası ✅
`src/app/kesfet/page.tsx`

**Mevcut Özellikler**:
- ✅ Arama kutusu
- ✅ Zorluk filtreleri (Kolay, Orta, Zor)
- ✅ Süre filtreleri (Kısa, Orta, Uzun)
- ✅ Tag bazlı arama
- ✅ Aktif filtre özeti
- ✅ Sayfalama (Load More)
- ✅ Responsive tasarım

## 🚀 Migration Uygulama

**ÖNEMLİ**: Migration henüz uygulanmadı! Veritabanını değiştirecek.

### Adım 1: Migration'ı İncele
```bash
# Migration dosyası:
prisma/migrations/20251115002822_add_fulltext_search_to_plans/migration.sql

# İçeriği:
CREATE FULLTEXT INDEX `plans_title_description_idx` ON `plans`(`title`, `description`);
```

### Adım 2: Yedek Al (ÖNERİLİR)
```bash
mysqldump -u root -p zayiflamaplan > backup_before_fulltext_$(date +%Y%m%d_%H%M%S).sql
```

### Adım 3: Migration'ı Uygula
```bash
npx prisma migrate dev
```

### Adım 4: Prisma Client'ı Güncelle
```bash
npx prisma generate
```

## 📊 Performans Karşılaştırması

### Öncesi (LIKE sorgusu):
```sql
SELECT * FROM plans 
WHERE title LIKE '%keto%' OR description LIKE '%keto%'
```
- ❌ Yavaş (tüm satırları tarar)
- ❌ Index kullanamaz
- ❌ Alakalılık skoru yok

### Sonrası (FULLTEXT):
```sql
SELECT *, MATCH(title, description) AGAINST('keto' IN NATURAL LANGUAGE MODE) as relevance
FROM plans 
WHERE MATCH(title, description) AGAINST('keto' IN NATURAL LANGUAGE MODE)
ORDER BY relevance DESC
```
- ✅ Çok hızlı (index kullanır)
- ✅ Alakalılık skoruna göre sıralar
- ✅ Doğal dil işleme

## 🔧 Kullanım Örnekleri

### Frontend'den Kullanım

```typescript
// Basit arama
const response = await fetch('/api/v1/search?q=keto')
const data = await response.json()

// Filtreli arama
const response = await fetch('/api/v1/search?q=keto&type=plans&difficulty=easy')
const data = await response.json()

// Sayfalama
const response = await fetch('/api/v1/search?q=keto&page=2&limit=10')
const data = await response.json()
```

### Service'den Kullanım

```typescript
import { SearchService } from '@/services/search.service'

// FULLTEXT search
const results = await SearchService.searchWithFullText({
  query: 'keto',
  type: 'plans',
  page: 1,
  limit: 20,
  filters: {
    difficulty: 'easy',
    duration: 'short',
  }
})

// Fallback search
const results = await SearchService.searchWithLike({
  query: 'keto',
  type: 'all',
})
```

## 🎯 Sonraki Adımlar (Opsiyonel)

### 1. Elasticsearch Entegrasyonu
Çok büyük veritabanları için:
- Fuzzy search (typo tolerance)
- Synonym support
- Advanced filtering
- Faceted search

### 2. Arama Analitiği
- Popüler aramalar
- Arama trendleri
- Sonuç bulunamayan aramalar

### 3. Autocomplete
- Arama önerileri
- Gerçek zamanlı sonuçlar

### 4. Arama Geçmişi
- Kullanıcı bazlı arama geçmişi
- Hızlı erişim

## 📝 Notlar

1. **FULLTEXT Index Gereksinimleri**:
   - MySQL 5.7+ veya MariaDB 10.0.5+
   - InnoDB engine (varsayılan)
   - Minimum kelime uzunluğu: 3 karakter (MySQL default)

2. **Fallback Mekanizması**:
   - FULLTEXT çalışmazsa otomatik olarak LIKE kullanır
   - Hata durumunda sistem çalışmaya devam eder

3. **Performans**:
   - FULLTEXT index ilk oluşturulduğunda biraz zaman alabilir
   - Büyük tablolarda (10k+ satır) performans farkı çok belirgin

4. **Güvenlik**:
   - SQL injection koruması var (Prisma raw query)
   - Input validation yapılıyor
   - Rate limiting eklenebilir (opsiyonel)

## ✅ Kontrol Listesi

- [x] FULLTEXT index migration oluşturuldu
- [x] `/api/v1/search` endpoint'i eklendi
- [x] Search service oluşturuldu
- [x] Mevcut explore endpoint optimize edildi
- [x] Fallback mekanizması eklendi
- [x] Dokümantasyon hazırlandı
- [ ] Migration uygulandı (kullanıcı onayı bekleniyor)
- [ ] Test edildi

## 🎉 Özet

Arama sistemi tamamen yenilendi ve optimize edildi:
- ✅ FULLTEXT search desteği
- ✅ Yeni `/api/v1/search` endpoint'i
- ✅ Gelişmiş filtreleme
- ✅ Alakalılık skoruna göre sıralama
- ✅ Fallback mekanizması
- ✅ Mevcut yapı korundu

**Tek yapman gereken**: Migration'ı uygulamak!
