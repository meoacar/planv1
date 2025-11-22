-- Mağaza Sistemi Tabloları
-- Bu SQL dosyasını çalıştırarak mağaza tablolarını ekleyebilirsiniz
-- Mevcut verileriniz korunur

-- Products tablosu
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `description` TEXT NOT NULL,
  `price` DOUBLE NOT NULL,
  `originalPrice` DOUBLE NULL,
  `stock` INTEGER NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `category` VARCHAR(191) NOT NULL,
  `image` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `products_category_idx`(`category`),
  INDEX `products_isActive_idx`(`isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Orders tablosu
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `total` DOUBLE NOT NULL,
  `status` ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `orders_userId_createdAt_idx`(`userId`, `createdAt`),
  INDEX `orders_status_idx`(`status`),
  CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Order Items tablosu
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(191) NOT NULL,
  `orderId` VARCHAR(191) NOT NULL,
  `productId` VARCHAR(191) NOT NULL,
  `quantity` INTEGER NOT NULL DEFAULT 1,
  `price` DOUBLE NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `order_items_orderId_idx`(`orderId`),
  INDEX `order_items_productId_idx`(`productId`),
  CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Coupons tablosu
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(191) NOT NULL,
  `discountType` ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
  `discountValue` DOUBLE NOT NULL,
  `minPurchase` DOUBLE NULL,
  `maxDiscount` DOUBLE NULL,
  `usageLimit` INTEGER NULL,
  `usageCount` INTEGER NOT NULL DEFAULT 0,
  `expiresAt` DATETIME(3) NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `coupons_code_key`(`code`),
  INDEX `coupons_code_idx`(`code`),
  INDEX `coupons_isActive_idx`(`isActive`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
