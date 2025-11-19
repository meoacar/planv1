-- Arkadaş Sistemi Tabloları
-- Tarih: 18 Kasım 2025

-- 1. Arkadaş İstekleri Tablosu
CREATE TABLE IF NOT EXISTS `friend_requests` (
  `id` VARCHAR(191) NOT NULL,
  `senderId` VARCHAR(191) NOT NULL,
  `receiverId` VARCHAR(191) NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending',
  `message` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `respondedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `friend_requests_senderId_receiverId_key` (`senderId`, `receiverId`),
  INDEX `friend_requests_senderId_idx` (`senderId`),
  INDEX `friend_requests_receiverId_idx` (`receiverId`),
  INDEX `friend_requests_status_idx` (`status`),
  CONSTRAINT `friend_requests_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friend_requests_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Arkadaşlıklar Tablosu (Kabul edilmiş arkadaşlıklar)
CREATE TABLE IF NOT EXISTS `friendships` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `friendId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `friendships_userId_friendId_key` (`userId`, `friendId`),
  INDEX `friendships_userId_idx` (`userId`),
  INDEX `friendships_friendId_idx` (`friendId`),
  CONSTRAINT `friendships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friendships_friendId_fkey` FOREIGN KEY (`friendId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Arkadaş Aktiviteleri Tablosu (Feed için)
CREATE TABLE IF NOT EXISTS `friend_activities` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `activityType` ENUM('sin_added', 'badge_earned', 'streak_milestone', 'challenge_completed', 'level_up') NOT NULL,
  `activityData` JSON NULL,
  `isPublic` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `friend_activities_userId_idx` (`userId`),
  INDEX `friend_activities_activityType_idx` (`activityType`),
  INDEX `friend_activities_createdAt_idx` (`createdAt`),
  INDEX `friend_activities_isPublic_idx` (`isPublic`),
  CONSTRAINT `friend_activities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Arkadaş Ayarları Tablosu (Gizlilik)
CREATE TABLE IF NOT EXISTS `friend_settings` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `allowFriendRequests` BOOLEAN NOT NULL DEFAULT true,
  `showStreak` BOOLEAN NOT NULL DEFAULT true,
  `showBadges` BOOLEAN NOT NULL DEFAULT true,
  `showStats` BOOLEAN NOT NULL DEFAULT true,
  `showActivity` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `friend_settings_userId_key` (`userId`),
  CONSTRAINT `friend_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
