# Cohort Builder Migration Guide

## ⚠️ ÖNEMLİ: Migration Öncesi

Bu migration yeni tablolar ekler, mevcut verilere dokunmaz. Güvenlidir.

## 📋 Migration Adımları

### 1. Schema Değişikliklerini Kontrol Et
```bash
npx prisma format
npx prisma validate
```

### 2. Migration Oluştur (DEV)
```bash
npx prisma migrate dev --name add_cohort_system
```

### 3. Production'a Deploy
```bash
npx prisma migrate deploy
```

## 🗄️ Yeni Tablolar

### cohort_definitions
- Cohort tanımları ve filtreleri
- JSON formatında esnek filter yapısı

### user_cohorts
- Kullanıcı-cohort ilişkileri
- Many-to-many relationship

### retention_metrics
- Retention analiz verileri
- Gün bazlı tutunma oranları

### ab_tests
- A/B test tanımları
- Variant yapılandırmaları

### ab_test_assignments
- Kullanıcı-test atamaları
- Variant tracking

## 🔍 Migration Sonrası Kontrol

```sql
-- Tabloların oluşturulduğunu kontrol et
SHOW TABLES LIKE '%cohort%';
SHOW TABLES LIKE '%ab_test%';

-- Index'lerin oluşturulduğunu kontrol et
SHOW INDEX FROM cohort_definitions;
SHOW INDEX FROM user_cohorts;
SHOW INDEX FROM retention_metrics;
```

## 🧪 Test Cohort Oluşturma

Admin panel'den veya API ile test cohort oluşturun:

```bash
curl -X POST http://localhost:3000/api/admin/cohorts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Cohort",
    "description": "İlk test cohort",
    "filters": {
      "xp": { "gte": 100 }
    }
  }'
```

## 🔄 Rollback (Gerekirse)

```bash
# Son migration'ı geri al
npx prisma migrate resolve --rolled-back <migration_name>

# Veya manuel olarak:
DROP TABLE IF EXISTS ab_test_assignments;
DROP TABLE IF EXISTS ab_tests;
DROP TABLE IF EXISTS retention_metrics;
DROP TABLE IF EXISTS user_cohorts;
DROP TABLE IF EXISTS cohort_definitions;
```

## ✅ Başarı Kriterleri

- [ ] Tüm tablolar oluşturuldu
- [ ] Index'ler mevcut
- [ ] Admin panel'de Cohorts menüsü görünüyor
- [ ] Yeni cohort oluşturulabiliyor
- [ ] Kullanıcılar cohort'a ekleniyor
- [ ] Export çalışıyor
- [ ] Refresh fonksiyonu çalışıyor

## 📊 Performans Notları

- `user_cohorts` tablosu büyüyebilir (her kullanıcı x cohort sayısı)
- Index'ler sorgu performansını optimize eder
- Büyük cohort'lar için pagination eklenebilir
- Export işlemleri için background job düşünülebilir

## 🐛 Sorun Giderme

### Migration Hatası
```bash
# Migration durumunu kontrol et
npx prisma migrate status

# Prisma client'ı yeniden oluştur
npx prisma generate
```

### Tablo Bulunamadı Hatası
```bash
# Schema'yı tekrar push et (DEV ONLY!)
npx prisma db push
```

### Foreign Key Hatası
- User tablosunun mevcut olduğundan emin olun
- Cascade delete ayarlarını kontrol edin
