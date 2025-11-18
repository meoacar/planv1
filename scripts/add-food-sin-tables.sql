-- ============================================
-- YEMEK GÜNAH SAYACI (FOOD SIN TRACKER) TABLES
-- ============================================

-- Food Sins Table
CREATE TABLE IF NOT EXISTS `food_sins` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `sinType` ENUM('tatli', 'fastfood', 'gazli', 'alkol', 'diger') NOT NULL,
  `note` TEXT NULL,
  `emoji` VARCHAR(10) NOT NULL,
  `sinDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `reactionText` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `food_sins_userId_sinDate_idx`(`userId`, `sinDate`),
  INDEX `food_sins_sinType_sinDate_idx`(`sinType`, `sinDate`),
  INDEX `food_sins_userId_createdAt_idx`(`userId`, `createdAt`),
  CONSTRAINT `food_sins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sin Reactions Table
CREATE TABLE IF NOT EXISTS `sin_reactions` (
  `id` VARCHAR(191) NOT NULL,
  `sinType` ENUM('tatli', 'fastfood', 'gazli', 'alkol', 'diger') NOT NULL,
  `reactionText` TEXT NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `usageCount` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `sin_reactions_sinType_isActive_idx`(`sinType`, `isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sin Badges Table
CREATE TABLE IF NOT EXISTS `sin_badges` (
  `id` VARCHAR(191) NOT NULL,
  `key` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `icon` VARCHAR(191) NOT NULL,
  `sinType` ENUM('tatli', 'fastfood', 'gazli', 'alkol', 'diger') NULL,
  `requirement` TEXT NOT NULL,
  `xpReward` INTEGER NOT NULL DEFAULT 0,
  `coinReward` INTEGER NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sin_badges_key_key`(`key`),
  INDEX `sin_badges_isActive_idx`(`isActive`),
  INDEX `sin_badges_sinType_idx`(`sinType`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User Sin Badges Table
CREATE TABLE IF NOT EXISTS `user_sin_badges` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `badgeId` VARCHAR(191) NOT NULL,
  `earnedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_sin_badges_userId_badgeId_key`(`userId`, `badgeId`),
  INDEX `user_sin_badges_userId_earnedAt_idx`(`userId`, `earnedAt`),
  INDEX `user_sin_badges_badgeId_idx`(`badgeId`),
  CONSTRAINT `user_sin_badges_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `sin_badges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sin_badges_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sin Challenges Table
CREATE TABLE IF NOT EXISTS `sin_challenges` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `sinType` ENUM('tatli', 'fastfood', 'gazli', 'alkol', 'diger') NULL,
  `targetDays` INTEGER NOT NULL,
  `maxSins` INTEGER NOT NULL,
  `xpReward` INTEGER NOT NULL DEFAULT 0,
  `coinReward` INTEGER NOT NULL DEFAULT 0,
  `startDate` DATETIME(3) NOT NULL,
  `endDate` DATETIME(3) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `sin_challenges_isActive_startDate_endDate_idx`(`isActive`, `startDate`, `endDate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User Sin Challenges Table
CREATE TABLE IF NOT EXISTS `user_sin_challenges` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `challengeId` VARCHAR(191) NOT NULL,
  `progress` INTEGER NOT NULL DEFAULT 0,
  `completed` BOOLEAN NOT NULL DEFAULT false,
  `completedAt` DATETIME(3) NULL,
  `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_sin_challenges_userId_challengeId_key`(`userId`, `challengeId`),
  INDEX `user_sin_challenges_userId_completed_idx`(`userId`, `completed`),
  INDEX `user_sin_challenges_challengeId_idx`(`challengeId`),
  CONSTRAINT `user_sin_challenges_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `sin_challenges`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sin_challenges_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sin Weekly Summaries Table
CREATE TABLE IF NOT EXISTS `sin_weekly_summaries` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `weekStart` DATETIME(3) NOT NULL,
  `weekEnd` DATETIME(3) NOT NULL,
  `totalSins` INTEGER NOT NULL DEFAULT 0,
  `cleanDays` INTEGER NOT NULL DEFAULT 0,
  `mostCommonSin` ENUM('tatli', 'fastfood', 'gazli', 'alkol', 'diger') NULL,
  `sinBreakdown` TEXT NULL,
  `aiSummary` TEXT NULL,
  `motivationBar` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `sin_weekly_summaries_userId_weekStart_key`(`userId`, `weekStart`),
  INDEX `sin_weekly_summaries_userId_weekStart_idx`(`userId`, `weekStart`),
  CONSTRAINT `sin_weekly_summaries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
