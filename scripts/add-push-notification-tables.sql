-- Push Notification Tables Migration
-- Bu script sadece eksik tabloları ekler, mevcut verilere dokunmaz

-- 1. PushSubscription tablosu
CREATE TABLE IF NOT EXISTS `push_subscriptions` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `endpoint` TEXT NOT NULL,
  `p256dh` TEXT NOT NULL,
  `auth` TEXT NOT NULL,
  `userAgent` TEXT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `push_subscriptions_userId_idx` (`userId`),
  INDEX `push_subscriptions_isActive_idx` (`isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. PushNotification tablosu
CREATE TABLE IF NOT EXISTS `push_notifications` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `type` ENUM('daily_reminder', 'weekly_summary', 'badge_earned', 'challenge_reminder', 'streak_warning', 'friend_activity', 'custom') NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `body` TEXT NOT NULL,
  `icon` VARCHAR(191) NULL,
  `badge` VARCHAR(191) NULL,
  `data` TEXT NULL,
  `status` ENUM('pending', 'sent', 'failed', 'clicked') NOT NULL DEFAULT 'pending',
  `sentAt` DATETIME(3) NULL,
  `clickedAt` DATETIME(3) NULL,
  `errorMessage` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `push_notifications_userId_idx` (`userId`),
  INDEX `push_notifications_type_idx` (`type`),
  INDEX `push_notifications_status_idx` (`status`),
  INDEX `push_notifications_createdAt_idx` (`createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. NotificationSettings tablosu
CREATE TABLE IF NOT EXISTS `notification_settings` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `dailyReminder` BOOLEAN NOT NULL DEFAULT true,
  `dailyReminderTime` VARCHAR(191) NOT NULL DEFAULT '20:00',
  `weeklySummary` BOOLEAN NOT NULL DEFAULT true,
  `badgeEarned` BOOLEAN NOT NULL DEFAULT true,
  `challengeReminder` BOOLEAN NOT NULL DEFAULT true,
  `streakWarning` BOOLEAN NOT NULL DEFAULT true,
  `friendActivity` BOOLEAN NOT NULL DEFAULT false,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `notification_settings_userId_key` (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign key constraints (sadece tablo yoksa ekle)
ALTER TABLE `push_subscriptions` 
ADD CONSTRAINT `push_subscriptions_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `push_notifications` 
ADD CONSTRAINT `push_notifications_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `notification_settings` 
ADD CONSTRAINT `notification_settings_userId_fkey` 
FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
