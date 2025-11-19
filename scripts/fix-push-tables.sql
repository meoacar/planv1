-- Push Subscription tablosuna eksik kolonları ekle

-- userAgent kolonu ekle
ALTER TABLE `push_subscriptions` 
ADD COLUMN IF NOT EXISTS `userAgent` TEXT NULL AFTER `auth`;

-- isActive kolonu ekle
ALTER TABLE `push_subscriptions` 
ADD COLUMN IF NOT EXISTS `isActive` BOOLEAN NOT NULL DEFAULT true AFTER `userAgent`;

-- isActive için index ekle
CREATE INDEX IF NOT EXISTS `push_subscriptions_isActive_idx` ON `push_subscriptions`(`isActive`);
