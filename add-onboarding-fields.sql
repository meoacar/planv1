-- Onboarding alanlarını güvenli şekilde ekle
-- Mevcut verilere dokunmaz, sadece yeni kolonlar ekler

ALTER TABLE `users` 
ADD COLUMN `onboardingCompleted` BOOLEAN NOT NULL DEFAULT FALSE AFTER `xpBoostUntil`,
ADD COLUMN `onboardingCompletedAt` DATETIME(3) NULL AFTER `onboardingCompleted`,
ADD COLUMN `goal` VARCHAR(191) NULL AFTER `onboardingCompletedAt`,
ADD COLUMN `activityLevel` VARCHAR(191) NULL AFTER `goal`,
ADD COLUMN `dailyWaterGoal` DOUBLE NULL AFTER `activityLevel`,
ADD COLUMN `averageSleep` VARCHAR(191) NULL AFTER `dailyWaterGoal`,
ADD COLUMN `biggestChallenge` VARCHAR(191) NULL AFTER `averageSleep`;
