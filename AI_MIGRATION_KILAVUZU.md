# 🔧 AI Tabloları Manuel Migration Kılavuzu

## ⚠️ Durum
Prisma migration reset istiyor ama **verileriniz güvenli**. Manuel SQL ile tabloları ekleyeceğiz.

## 📋 Adımlar

### 1. phpMyAdmin'i Aç
```
http://localhost/phpmyadmin
```

### 2. Veritabanını Seç
- Sol menüden **`zayiflamaplan`** veritabanını seç

### 3. SQL Sekmesine Git
- Üst menüden **SQL** sekmesine tıkla

### 4. Aşağıdaki SQL'i Yapıştır ve Çalıştır

```sql
-- AI/ML Tabloları - Güvenli Migration
-- Sadece yeni tablolar oluşturur, mevcut verilere dokunmaz

-- 1. AIRecommendation tablosu
CREATE TABLE IF NOT EXISTS `ai_recommendations` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `recommendationType` VARCHAR(50) NOT NULL,
  `targetId` VARCHAR(191) NOT NULL,
  `targetTitle` VARCHAR(191) NULL,
  `score` DOUBLE NOT NULL DEFAULT 0,
  `reason` TEXT NULL,
  `metadata` TEXT NULL,
  `clicked` BOOLEAN NOT NULL DEFAULT false,
  `clickedAt` DATETIME(3) NULL,
  `dismissed` BOOLEAN NOT NULL DEFAULT false,
  `dismissedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expiresAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  INDEX `ai_recommendations_userId_recommendationType_createdAt_idx`(`userId`, `recommendationType`, `createdAt`),
  INDEX `ai_recommendations_userId_clicked_idx`(`userId`, `clicked`),
  INDEX `ai_recommendations_score_idx`(`score`),
  INDEX `ai_recommendations_expiresAt_idx`(`expiresAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. SmartReminder tablosu
CREATE TABLE IF NOT EXISTS `smart_reminders` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `reminderType` VARCHAR(50) NOT NULL,
  `optimalTime` VARCHAR(5) NOT NULL,
  `frequency` VARCHAR(20) NOT NULL DEFAULT 'daily',
  `enabled` BOOLEAN NOT NULL DEFAULT true,
  `lastSentAt` DATETIME(3) NULL,
  `nextSendAt` DATETIME(3) NULL,
  `clickRate` DOUBLE NOT NULL DEFAULT 0,
  `totalSent` INTEGER NOT NULL DEFAULT 0,
  `totalClicked` INTEGER NOT NULL DEFAULT 0,
  `metadata` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `smart_reminders_userId_reminderType_key`(`userId`, `reminderType`),
  INDEX `smart_reminders_userId_enabled_idx`(`userId`, `enabled`),
  INDEX `smart_reminders_nextSendAt_enabled_idx`(`nextSendAt`, `enabled`),
  INDEX `smart_reminders_reminderType_idx`(`reminderType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. "Go" Butonuna Tıkla

### 6. Başarı Mesajını Kontrol Et
Şöyle bir mesaj görmelisiniz:
```
2 queries executed successfully
```

### 7. Prisma Client'ı Güncelle
Terminal'de:
```bash
npx prisma generate
```

## ✅ Doğrulama

Tabloların oluştuğunu kontrol et:
```sql
SHOW TABLES LIKE '%ai%';
SHOW TABLES LIKE '%smart%';
```

Şunları görmelisiniz:
- `ai_recommendations`
- `smart_reminders`

## 🎯 Sonraki Adımlar

1. ✅ Tabloları oluştur (yukarıdaki SQL)
2. ✅ `npx prisma generate` çalıştır
3. ✅ API'leri test et
4. ✅ Worker'ları başlat

## 📝 Notlar

- **Veri Kaybı Yok:** Sadece yeni tablolar ekleniyor
- **Güvenli:** `IF NOT EXISTS` kullanıldı
- **Geri Alınabilir:** Tabloları silmek için:
  ```sql
  DROP TABLE IF EXISTS ai_recommendations;
  DROP TABLE IF EXISTS smart_reminders;
  ```

## 🆘 Sorun Çıkarsa

Hata alırsanız:
1. SQL'i satır satır çalıştırın
2. Hata mesajını kontrol edin
3. Tablo zaten varsa "already exists" hatası normaldir

## 🚀 Hazır!

Migration tamamlandıktan sonra AI özellikleri kullanıma hazır olacak!
