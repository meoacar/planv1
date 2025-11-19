-- ActivityLog tablosunu ekle
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` VARCHAR(191) NOT NULL,
  `actorId` VARCHAR(191) NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity` VARCHAR(100) NOT NULL,
  `entityId` VARCHAR(191) NULL,
  `ip` VARCHAR(45) NULL,
  `userAgent` TEXT NULL,
  `metadata` LONGTEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `activity_logs_actorId_createdAt_idx` (`actorId`, `createdAt`),
  INDEX `activity_logs_entity_entityId_idx` (`entity`, `entityId`),
  INDEX `activity_logs_action_createdAt_idx` (`action`, `createdAt`),
  INDEX `activity_logs_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
