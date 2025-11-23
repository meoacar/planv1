-- Abonelik Sistemi Migration
-- Bu SQL dosyası mevcut verilere zarar vermeden yeni tabloları ve kolonları ekler

-- User tablosuna premium alanları ekle
ALTER TABLE `users` 
ADD COLUMN `isPremium` BOOLEAN NOT NULL DEFAULT false AFTER `biggestChallenge`,
ADD COLUMN `premiumUntil` DATETIME(3) NULL AFTER `isPremium`,
ADD COLUMN `premiumType` ENUM('monthly', 'yearly', 'lifetime') NULL AFTER `premiumUntil`;

-- Subscriptions tablosu
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `premiumType` ENUM('monthly', 'yearly', 'lifetime') NOT NULL,
    `status` ENUM('active', 'cancelled', 'expired', 'pending') NOT NULL DEFAULT 'pending',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `autoRenew` BOOLEAN NOT NULL DEFAULT false,
    `cancelledAt` DATETIME(3) NULL,
    `paymentProvider` ENUM('stripe', 'iyzico', 'paytr') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'TRY',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `subscriptions_userId_status_idx`(`userId`, `status`),
    INDEX `subscriptions_status_endDate_idx`(`status`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Payments tablosu
CREATE TABLE `payments` (
    `id` VARCHAR(191) NOT NULL,
    `subscriptionId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'TRY',
    `status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `paymentProvider` ENUM('stripe', 'iyzico', 'paytr') NOT NULL,
    `providerOrderId` VARCHAR(191) NULL,
    `providerToken` VARCHAR(191) NULL,
    `metadata` TEXT NULL,
    `paidAt` DATETIME(3) NULL,
    `failedReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `payments_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `payments_status_idx`(`status`),
    INDEX `payments_providerOrderId_idx`(`providerOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Premium Features tablosu
CREATE TABLE `premium_features` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `icon` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `premium_features_key_key`(`key`),
    INDEX `premium_features_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Foreign key constraints
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `payments` ADD CONSTRAINT `payments_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Premium özellikleri ekle
INSERT INTO `premium_features` (`id`, `key`, `name`, `description`, `icon`, `isActive`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
(CONCAT('pf_', UUID()), 'xp_boost', '2x XP Kazancı', 'Tüm aktivitelerden 2 kat daha fazla XP kazanın', '⚡', true, 1, NOW(), NOW()),
(CONCAT('pf_', UUID()), 'no_ads', 'Reklamsız Deneyim', 'Hiç reklam görmeden uygulamayı kullanın', '🚫', true, 2, NOW(), NOW()),
(CONCAT('pf_', UUID()), 'exclusive_badges', 'Özel Rozetler', 'Sadece premium üyelere özel rozetler kazanın', '🏆', true, 3, NOW(), NOW()),
(CONCAT('pf_', UUID()), 'priority_support', 'Öncelikli Destek', 'Sorularınıza öncelikli yanıt alın', '💬', true, 4, NOW(), NOW()),
(CONCAT('pf_', UUID()), 'custom_profile', 'Özel Profil Teması', 'Profilinizi istediğiniz gibi özelleştirin', '🎨', true, 5, NOW(), NOW()),
(CONCAT('pf_', UUID()), 'advanced_stats', 'Gelişmiş İstatistikler', 'Detaylı analiz ve raporlar görün', '📊', true, 6, NOW(), NOW());
