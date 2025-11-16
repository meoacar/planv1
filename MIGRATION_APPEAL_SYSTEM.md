# 🔄 Appeal System Migration Talimatları

## ⚠️ ÖNEMLİ UYARILAR

Bu migration **VERİTABANI DEĞİŞİKLİĞİ** içerir. Lütfen aşağıdaki adımları dikkatlice takip edin.

## 📋 Ön Hazırlık

### 1. Yedek Alın (ÇOK ÖNEMLİ!)

```bash
# MySQL için yedek alma
mysqldump -u root -p zayiflamaplan > backup_$(date +%Y%m%d_%H%M%S).sql

# Veya MySQL Workbench kullanarak yedek alın
```

### 2. Geliştirme Ortamında Test Edin

Bu migration'ı önce development veritabanınızda test edin!

## 🚀 Migration Adımları

### Adım 1: Schema Değişikliklerini Kontrol Edin

```bash
# Migration dosyasını oluştur (henüz uygulamadan)
npx prisma migrate dev --create-only --name add_appeal_system
```

Bu komut `prisma/migrations/` klasöründe yeni bir migration dosyası oluşturur.

### Adım 2: Migration Dosyasını İnceleyin

Migration dosyasını açın ve şunları kontrol edin:

```sql
-- Beklenen değişiklikler:

-- 1. ContentAppeal tablosu oluşturulacak
CREATE TABLE `content_appeals` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `contentType` ENUM('plan', 'recipe', 'comment', 'recipe_comment', 'group_post') NOT NULL,
  `contentId` VARCHAR(191) NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `priority` INTEGER NOT NULL DEFAULT 0,
  `adminNote` TEXT NULL,
  `resolvedBy` VARCHAR(191) NULL,
  `resolvedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `content_appeals_userId_createdAt_idx`(`userId`, `createdAt`),
  INDEX `content_appeals_status_priority_idx`(`status`, `priority`),
  INDEX `content_appeals_contentType_contentId_idx`(`contentType`, `contentId`),
  INDEX `content_appeals_createdAt_idx`(`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Foreign key constraints
ALTER TABLE `content_appeals` 
  ADD CONSTRAINT `content_appeals_userId_fkey` 
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) 
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `content_appeals` 
  ADD CONSTRAINT `content_appeals_resolvedBy_fkey` 
  FOREIGN KEY (`resolvedBy`) REFERENCES `users`(`id`) 
  ON DELETE SET NULL ON UPDATE CASCADE;
```

### Adım 3: Migration'ı Uygulayın

Eğer migration dosyası doğru görünüyorsa:

```bash
# Migration'ı uygula
npx prisma migrate dev
```

Veya production için:

```bash
npx prisma migrate deploy
```

### Adım 4: Prisma Client'ı Güncelleyin

```bash
npx prisma generate
```

### Adım 5: Veritabanını Kontrol Edin

```sql
-- Tablo oluşturuldu mu?
SHOW TABLES LIKE 'content_appeals';

-- Tablo yapısını kontrol et
DESCRIBE content_appeals;

-- Index'ler oluşturuldu mu?
SHOW INDEX FROM content_appeals;
```

## ✅ Doğrulama

### 1. API Testleri

```bash
# Sunucuyu başlat
npm run dev

# API endpoint'lerini test et
curl http://localhost:3000/api/appeals
```

### 2. UI Testleri

1. Admin paneline gidin: `http://localhost:3000/admin/itirazlar`
2. Kullanıcı paneline gidin: `http://localhost:3000/dashboard/itirazlarim`
3. Bir içeriği reddedin ve itiraz edin

### 3. Veritabanı Testleri

```sql
-- Test verisi ekle
INSERT INTO content_appeals (
  id, userId, contentType, contentId, reason, status, priority, createdAt, updatedAt
) VALUES (
  'test123', 'user_id_here', 'plan', 'plan_id_here', 
  'Test itiraz sebebi', 'pending', 50, NOW(), NOW()
);

-- Veriyi kontrol et
SELECT * FROM content_appeals WHERE id = 'test123';

-- Test verisini sil
DELETE FROM content_appeals WHERE id = 'test123';
```

## 🔄 Rollback (Geri Alma)

Eğer bir sorun olursa:

### Yöntem 1: Migration Geri Alma

```bash
# Son migration'ı geri al
npx prisma migrate resolve --rolled-back [migration_name]
```

### Yöntem 2: Manuel Geri Alma

```sql
-- Tabloyu sil
DROP TABLE IF EXISTS `content_appeals`;

-- Enum'ları temizle (gerekirse)
-- MySQL'de enum'lar tablo ile birlikte silinir
```

### Yöntem 3: Yedekten Geri Yükleme

```bash
# Yedek dosyasından geri yükle
mysql -u root -p zayiflamaplan < backup_20240101_120000.sql
```

## 📊 Migration Sonrası Kontroller

### 1. Performans Kontrolü

```sql
-- Index'lerin kullanıldığını kontrol et
EXPLAIN SELECT * FROM content_appeals 
WHERE status = 'pending' 
ORDER BY priority DESC, createdAt DESC;
```

### 2. Veri Bütünlüğü

```sql
-- Foreign key'lerin çalıştığını kontrol et
SELECT ca.*, u.username 
FROM content_appeals ca
LEFT JOIN users u ON ca.userId = u.id
WHERE u.id IS NULL;
-- Sonuç boş olmalı

-- Orphan kayıt kontrolü
SELECT * FROM content_appeals 
WHERE userId NOT IN (SELECT id FROM users);
-- Sonuç boş olmalı
```

### 3. Uygulama Logları

```bash
# Sunucu loglarını kontrol et
# Hata var mı?
tail -f logs/app.log
```

## 🐛 Yaygın Sorunlar ve Çözümleri

### Sorun 1: "Table already exists"

```sql
-- Tabloyu kontrol et
SHOW TABLES LIKE 'content_appeals';

-- Eğer varsa ve boşsa, silin
DROP TABLE IF EXISTS content_appeals;

-- Migration'ı tekrar çalıştırın
```

### Sorun 2: "Foreign key constraint fails"

```sql
-- User tablosunun var olduğunu kontrol et
SHOW TABLES LIKE 'users';

-- User ID'lerinin doğru olduğunu kontrol et
SELECT id FROM users LIMIT 5;
```

### Sorun 3: "Enum value not found"

```sql
-- Enum değerlerini kontrol et
SHOW COLUMNS FROM content_appeals LIKE 'status';
SHOW COLUMNS FROM content_appeals LIKE 'contentType';
```

### Sorun 4: Prisma Client Hatası

```bash
# Prisma Client'ı temizle ve yeniden oluştur
rm -rf node_modules/.prisma
npx prisma generate
```

## 📈 Production Deployment

### Adım 1: Bakım Modu

```bash
# Uygulamayı bakım moduna alın
# Kullanıcılara bildirim gösterin
```

### Adım 2: Yedek Alın

```bash
# Production veritabanı yedeği
mysqldump -u prod_user -p prod_db > prod_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Adım 3: Migration Uygulayın

```bash
# Production migration
npx prisma migrate deploy
```

### Adım 4: Smoke Test

```bash
# Temel fonksiyonları test edin
curl https://yourdomain.com/api/appeals
```

### Adım 5: Bakım Modunu Kaldırın

```bash
# Uygulamayı tekrar açın
```

## 📞 Acil Durum İletişimi

Eğer production'da sorun yaşarsanız:

1. **Hemen rollback yapın**
2. **Yedekten geri yükleyin**
3. **Logları kaydedin**
4. **Teknik ekiple iletişime geçin**

## ✨ Migration Başarılı!

Eğer her şey yolunda gittiyse:

- ✅ `content_appeals` tablosu oluşturuldu
- ✅ Index'ler eklendi
- ✅ Foreign key'ler kuruldu
- ✅ API endpoint'leri çalışıyor
- ✅ UI sayfaları erişilebilir
- ✅ Testler geçti

Artık Appeal System kullanıma hazır! 🎉

## 📚 Ek Kaynaklar

- [Prisma Migration Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [MySQL Backup Guide](https://dev.mysql.com/doc/refman/8.0/en/backup-and-recovery.html)
- [Appeal System Dokümantasyonu](./APPEAL_SYSTEM.md)
