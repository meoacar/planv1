-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: zayiflamaplan
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_blogposttoblogtag`
--

DROP TABLE IF EXISTS `_blogposttoblogtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_blogposttoblogtag` (
  `A` varchar(191) NOT NULL,
  `B` varchar(191) NOT NULL,
  UNIQUE KEY `_BlogPostToBlogTag_AB_unique` (`A`,`B`),
  KEY `_BlogPostToBlogTag_B_index` (`B`),
  CONSTRAINT `_BlogPostToBlogTag_A_fkey` FOREIGN KEY (`A`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_BlogPostToBlogTag_B_fkey` FOREIGN KEY (`B`) REFERENCES `blog_tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_blogposttoblogtag`
--

LOCK TABLES `_blogposttoblogtag` WRITE;
/*!40000 ALTER TABLE `_blogposttoblogtag` DISABLE KEYS */;
INSERT INTO `_blogposttoblogtag` VALUES ('cmi44btpo00021vvnmnnf3nwk','cmi37obbu0027my6rlh2knxvo'),('cmi45b8et00037lxpyo5bl15o','cmi37obbu0027my6rlh2knxvo'),('cmi45ey8900057lxpvj7ac46k','cmi37obbu0027my6rlh2knxvo'),('cmi45m97h000d7lxpzwklxe9f','cmi37obbu0027my6rlh2knxvo');
/*!40000 ALTER TABLE `_blogposttoblogtag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_conversationparticipants`
--

DROP TABLE IF EXISTS `_conversationparticipants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_conversationparticipants` (
  `A` varchar(191) NOT NULL,
  `B` varchar(191) NOT NULL,
  UNIQUE KEY `_ConversationParticipants_AB_unique` (`A`,`B`),
  KEY `_ConversationParticipants_B_index` (`B`),
  CONSTRAINT `_ConversationParticipants_A_fkey` FOREIGN KEY (`A`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `_ConversationParticipants_B_fkey` FOREIGN KEY (`B`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_conversationparticipants`
--

LOCK TABLES `_conversationparticipants` WRITE;
/*!40000 ALTER TABLE `_conversationparticipants` DISABLE KEYS */;
INSERT INTO `_conversationparticipants` VALUES ('cmhyxbfcu0002u207r83pctzc','cmhxnqibq0000n3zb1nyhdaso'),('cmhyxbfcu0002u207r83pctzc','cmhy68hs50000g0xkj2slheo4');
/*!40000 ALTER TABLE `_conversationparticipants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('0a5a7e0e-7abe-449a-8fb1-d57bc7f61c1d','fbb1f974aa4e2ab03b472f8179dd798796b747543c2222dcf774ea72b78329a3','2025-11-15 00:42:51.133','20251115002822_add_fulltext_search_to_plans',NULL,NULL,'2025-11-15 00:42:51.070',1),('11e69f5a-4492-4aba-9b9c-e39c805af1aa','a336bd9e9febfa01052d140bb61db6ed3fe0a370210d69d1dd0b5083b60e6d44','2025-11-15 00:42:54.017','20251115004253_add_recipe_system',NULL,NULL,'2025-11-15 00:42:53.737',1),('17b19551-0ca8-42c5-88de-a750e1de1af4','2009bd4aa0ab58cb7f61a12a87e4f9c21c69d10f5cbe3193b54aa4af67e294f0','2025-11-14 13:43:37.516','20251114134210_add_messaging_system',NULL,NULL,'2025-11-14 13:43:37.294',1),('1cdca256-f812-4f91-b92c-8e313f2c3aa0','4c95007c712080fdddf10c522123ae7f911f2739ac564eb3d658f49004273592','2025-11-15 23:40:15.339','20251115233739_add_guild_modern_features',NULL,NULL,'2025-11-15 23:40:15.319',1),('1e3cf419-fa6f-4857-a870-eace2bbc0a6b','886a3c4d59d67f55802989160014597a5ff313dc623e9c9619de81e3545d1b70','2025-11-15 18:08:14.319','20251115180756_add_rejection_reason_and_under_review',NULL,NULL,'2025-11-15 18:08:14.175',1),('2e0c1b5a-1ea2-4684-a96a-4107b7846139','1f61a8592a84575133fc325b7d47c71aefd900342349cbeb33208f8f31b48f73','2025-11-15 01:24:40.448','20251115012427_add_gamification_system',NULL,NULL,'2025-11-15 01:24:39.250',1),('3ecb268a-67bb-43bf-bf16-af94da4ed276','d89614fc0dc2044143d89322c02fc43a5f9bad4db6f9d322a50370a2f1a34ae6','2025-11-16 13:37:25.811','20251116133655_fix_user_cohort_relation',NULL,NULL,'2025-11-16 13:37:25.769',1),('3f4d1d2f-ab37-4bfa-9f8f-f5157c42427e','22f161120ed54e8f9455f1b3e81f8b6baac42d19af77066e95402d12e21d720e','2025-11-13 02:53:10.228','20251113025310_add_plan_views',NULL,NULL,'2025-11-13 02:53:10.158',1),('413391cc-159c-4a6b-9287-a454f522d8e1','176a75085ef5db21f3576b9565184fff81350351c547df8a46721fec7db0c9de','2025-11-15 22:44:41.821','20251115214635_add_group_approval_system',NULL,NULL,'2025-11-15 22:44:41.688',1),('43c8621c-d626-4723-85b4-1bce4ee0409d','a9e04510c1d7a4bb35f0d1da51b2651a6ccd311fa6021dde305e87e92b1fbe61','2025-11-15 19:16:52.092','20251115191630_add_ban_details',NULL,NULL,'2025-11-15 19:16:52.081',1),('4c80a130-6a8b-4d83-9b94-ceb924c34fac','aa5547532da51f40486969b0f5e7cc23d8db213f137734e70819a4cbbd0d3f07','2025-11-17 01:24:46.660','20251117012446_add_league_promotion_coin_type',NULL,NULL,'2025-11-17 01:24:46.653',1),('54c58777-9a2c-448c-86b7-917a3fa1ae8d','6701948b6a0df738d176c6e06e4ab496440f0d051cebda70128b02a23993895b','2025-11-15 23:16:48.141','20251115231629_add_guild_approval_system',NULL,NULL,'2025-11-15 23:16:48.123',1),('586a2563-2bb2-4f2a-b36f-8f12635443be','b923fc868497a38a5f8722f318e113ec649ba19b80741d325208c921486baf9c','2025-11-16 19:45:22.202','20251116194506_add_favorites',NULL,NULL,'2025-11-16 19:45:22.112',1),('5f178182-0683-455c-b47f-05195f774eb1','3d282860fa7e2d82bfca21a10a143ac81dfbbc0ebe1e58d6183cb269c7d816c6','2025-11-13 02:53:08.648','20251112005858_init',NULL,NULL,'2025-11-13 02:53:07.969',1),('6c3af1f4-9686-479f-90cc-aa2c4e04feb0','122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec','2025-11-15 01:28:14.674','20251115012802_add_gamification_system',NULL,NULL,'2025-11-15 01:28:14.669',1),('73f60d28-29f8-4cc9-9302-8a09706022a1','fab8f8a6c3e06d2b8f730391dc633d872b263dc51e9a7805c3f499e5ba9aa802','2025-11-17 13:35:01.932','20251117133359_add_blog_system','',NULL,'2025-11-17 13:35:01.932',0),('7defc116-ac05-40fb-8136-1f4a3ac2c7f9','03aa2d7a742f37ec7a225fbd41a06ce05485af2032e8b7d8a25a245882f79bb0','2025-11-16 14:08:00.295','20251116140740_add_password_reset',NULL,NULL,'2025-11-16 14:08:00.225',1),('89d38d15-7967-4ff3-a134-ac3006c99513','6f89fab038e3c283fe58e5305f5eee2e13bb6b8404cf792fb8f15a01bd1d934c','2025-11-16 19:42:48.037','20251116194215_add_plan_rating_and_progress',NULL,NULL,'2025-11-16 19:42:47.822',1),('967ea719-03f5-4e33-81ea-9ffdd8d2d176','fab8f8a6c3e06d2b8f730391dc633d872b263dc51e9a7805c3f499e5ba9aa802',NULL,'20251117133359_add_blog_system','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251117133359_add_blog_system\n\nDatabase error code: 1050\n\nDatabase error:\nTable \'blog_posts\' already exists\n\nPlease check the query number 1 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20251117133359_add_blog_system\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20251117133359_add_blog_system\"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:226','2025-11-17 13:35:01.931','2025-11-17 13:34:55.216',0),('a27a9cc3-06bf-4c94-8f15-7e2a5d75090d','441b9a08fc63278e70f9e3bc63390923c254d9d2bf182bd40b08a47ea798f082','2025-11-15 00:58:15.782','20251115005815_add_recipe_images',NULL,NULL,'2025-11-15 00:58:15.717',1),('a8576327-b528-48d2-ae45-ff8d761d3dab','3022b7e5e96409637475171b49b40267e176c3265b7eebe5a949720a12950124','2025-11-16 12:55:42.441','20251116125523_add_guild_join_requests',NULL,NULL,'2025-11-16 12:55:42.347',1),('aa9462e2-44b9-4c96-94ba-725f293859d7','8209e053ccc5bdde78d4e9f037392ac0080792e4533824077824b5372b6942be','2025-11-16 14:34:01.741','20251116143401_add_push_subscriptions',NULL,NULL,'2025-11-16 14:34:01.682',1),('ae65690d-4669-4321-ab41-4321beaa5c31','968060608f1ca966430cdd45fe683bb588f8bcc5d4c0b54fff5b5957e620c1a9','2025-11-15 02:20:28.087','20251115022000_add_groups_system',NULL,NULL,'2025-11-15 02:20:27.802',1),('afeeed0b-096c-4842-86cd-fa8d18316fa0','b51e8811d91cf08a7ef3bbcb91cf3b9557b2a62fda377aa6e078186e085eddc0','2025-11-17 03:14:53.504','20251117031453_add_confession_system',NULL,NULL,'2025-11-17 03:14:53.253',1),('b1e8f835-ec44-4167-8acd-34f3d4490341','0ceef91b5810c64e143587b3c9ce6d15259ebd018ab824d93f94fa38020c04db','2025-11-14 13:13:42.146','20251114131342_update_image_field',NULL,NULL,'2025-11-14 13:13:42.102',1),('c68f9c94-38c7-4012-9a0f-1f333340a3b1','9635b1b0802d687664d146a4c2a1fd6f06d99c6716c1383ad371c8d2218bc5b8',NULL,'20251117133359_add_blog_system','A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251117133359_add_blog_system\n\nDatabase error code: 1061\n\nDatabase error:\nDuplicate key name \'_conversationparticipants_AB_unique\'\n\nPlease check the query number 12 from the migration file.\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name=\"20251117133359_add_blog_system\"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name=\"20251117133359_add_blog_system\"\n             at schema-engine\\core\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:226','2025-11-17 13:34:49.426','2025-11-17 13:34:27.649',0),('c6d2f339-d631-497d-8c0b-d9659434d274','9686aa1c3fac83e1ce142c20f60b1ba75423e57aa7a4f29f4d5aa87a163793c1','2025-11-16 16:27:18.706','20251116162636_add_cms_and_footer',NULL,NULL,'2025-11-16 16:27:18.625',1),('c814a992-56c2-4826-988f-c0c9264da24a','c2c66fa483b37c651a738bcc884e0e2be315f003c9f84f303dc11c4f129bd3b2','2025-11-15 17:38:23.013','20251115173734_add_appeal_system',NULL,NULL,'2025-11-15 17:38:22.908',1),('eaffda02-94cc-4984-b751-667852a13a45','b01e345a786693ac0376581b523d6d8443faab7ed84bae8ae9eb8d5ffa61a727','2025-11-17 00:00:39.547','20251117000039_add_cosmetic_fields_to_user',NULL,NULL,'2025-11-17 00:00:39.540',1),('f9da905c-0b52-4a56-800d-95c2ed891f3b','1d7f0ebdd42212e8dd9f0bd401ee890ff715ffa493d64ff424391bc0d3e88f7a','2025-11-16 17:00:46.983','20251116170029_add_contact_system',NULL,NULL,'2025-11-16 17:00:46.958',1),('fdd2318b-49b0-4252-a818-4d203e03ed90','89ea6ab336ec93d0a9de6e5a811d61ba953ee3bf8fe2c89bb1a5d5cbd98d2c4d','2025-11-16 13:26:52.102','20251116132625_add_cohort_system',NULL,NULL,'2025-11-16 13:26:51.884',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ab_test_assignments`
--

DROP TABLE IF EXISTS `ab_test_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ab_test_assignments` (
  `id` varchar(191) NOT NULL,
  `testId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `variant` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ab_test_assignments_testId_userId_key` (`testId`,`userId`),
  KEY `ab_test_assignments_userId_idx` (`userId`),
  KEY `ab_test_assignments_testId_variant_idx` (`testId`,`variant`),
  CONSTRAINT `ab_test_assignments_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `ab_tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ab_test_assignments`
--

LOCK TABLES `ab_test_assignments` WRITE;
/*!40000 ALTER TABLE `ab_test_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `ab_test_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ab_tests`
--

DROP TABLE IF EXISTS `ab_tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ab_tests` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `variants` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`variants`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `startDate` datetime(3) DEFAULT NULL,
  `endDate` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ab_tests_isActive_startDate_idx` (`isActive`,`startDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ab_tests`
--

LOCK TABLES `ab_tests` WRITE;
/*!40000 ALTER TABLE `ab_tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `ab_tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerAccountId` varchar(191) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) DEFAULT NULL,
  `scope` varchar(191) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  KEY `accounts_userId_idx` (`userId`),
  CONSTRAINT `accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_logs` (
  `id` varchar(191) NOT NULL,
  `actorId` varchar(191) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `entity` varchar(100) NOT NULL,
  `entityId` varchar(191) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `metadata` longtext DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `idx_actor` (`actorId`,`createdAt`),
  KEY `idx_entity` (`entity`,`entityId`),
  KEY `idx_action` (`action`,`createdAt`),
  KEY `idx_created` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_logs`
--

LOCK TABLES `activity_logs` WRITE;
/*!40000 ALTER TABLE `activity_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_recommendations`
--

DROP TABLE IF EXISTS `ai_recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_recommendations` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `recommendationType` varchar(50) NOT NULL,
  `targetId` varchar(191) NOT NULL,
  `targetTitle` varchar(191) DEFAULT NULL,
  `score` double NOT NULL DEFAULT 0,
  `reason` text DEFAULT NULL,
  `metadata` text DEFAULT NULL,
  `clicked` tinyint(1) NOT NULL DEFAULT 0,
  `clickedAt` datetime(3) DEFAULT NULL,
  `dismissed` tinyint(1) NOT NULL DEFAULT 0,
  `dismissedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expiresAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ai_recommendations_userId_recommendationType_createdAt_idx` (`userId`,`recommendationType`,`createdAt`),
  KEY `ai_recommendations_userId_clicked_idx` (`userId`,`clicked`),
  KEY `ai_recommendations_score_idx` (`score`),
  KEY `ai_recommendations_expiresAt_idx` (`expiresAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_recommendations`
--

LOCK TABLES `ai_recommendations` WRITE;
/*!40000 ALTER TABLE `ai_recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `api_keys`
--

DROP TABLE IF EXISTS `api_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `api_keys` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `permissions` text NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `lastUsedAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `createdBy` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `api_keys_key_key` (`key`),
  KEY `api_keys_key_idx` (`key`),
  KEY `api_keys_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `api_keys`
--

LOCK TABLES `api_keys` WRITE;
/*!40000 ALTER TABLE `api_keys` DISABLE KEYS */;
/*!40000 ALTER TABLE `api_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `badges`
--

DROP TABLE IF EXISTS `badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `badges` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(191) NOT NULL,
  `category` enum('achievement','milestone','social','special') NOT NULL DEFAULT 'achievement',
  `rarity` enum('common','rare','epic','legendary') NOT NULL DEFAULT 'common',
  `xpReward` int(11) NOT NULL DEFAULT 0,
  `coinReward` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `badges_key_key` (`key`),
  KEY `badges_category_idx` (`category`),
  KEY `badges_rarity_idx` (`rarity`),
  KEY `badges_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badges`
--

LOCK TABLES `badges` WRITE;
/*!40000 ALTER TABLE `badges` DISABLE KEYS */;
INSERT INTO `badges` VALUES ('cmhzm13it00009tn4eximvfnq','first_plan','İlk Plan','İlk planını oluşturdun!','📝','achievement','common',50,10,1,1,'2025-11-15 01:30:28.757','2025-11-17 03:15:47.463'),('cmhzm13j600019tn4eoko25vt','first_recipe','İlk Tarif','İlk tarifini paylaştın!','👨‍🍳','achievement','common',50,10,1,2,'2025-11-15 01:30:28.770','2025-11-17 03:15:47.467'),('cmhzm13j800029tn48b9la57z','first_comment','İlk Yorum','İlk yorumunu yaptın!','💬','achievement','common',25,5,1,3,'2025-11-15 01:30:28.773','2025-11-17 03:15:47.470'),('cmhzm13jd00039tn4c4spv6va','weight_loss_5kg','5kg Kaybı','5kg verdin, harikasın!','🎯','milestone','rare',100,25,1,1,'2025-11-15 01:30:28.777','2025-11-17 03:15:47.473'),('cmhzm13jf00049tn47aks1cgr','weight_loss_10kg','10kg Kaybı','10kg verdin, inanılmaz!','🏆','milestone','epic',200,50,1,2,'2025-11-15 01:30:28.780','2025-11-17 03:15:47.475'),('cmhzm13jh00059tn4fgroa5n8','weight_loss_20kg','20kg Kaybı','20kg verdin, efsanesin!','👑','milestone','legendary',500,100,1,3,'2025-11-15 01:30:28.782','2025-11-17 03:15:47.478'),('cmhzm13jk00069tn4mqgr24iu','streak_7','7 Günlük Seri','7 gün üst üste check-in yaptın!','🔥','milestone','rare',75,20,1,4,'2025-11-15 01:30:28.784','2025-11-17 03:15:47.480'),('cmhzm13jm00079tn4lb1lq7td','streak_30','30 Günlük Seri','30 gün üst üste check-in yaptın!','⚡','milestone','epic',250,75,1,5,'2025-11-15 01:30:28.787','2025-11-17 03:15:47.483'),('cmhzm13jo00089tn49fujdunu','streak_100','100 Günlük Seri','100 gün üst üste check-in yaptın!','💎','milestone','legendary',1000,250,1,6,'2025-11-15 01:30:28.789','2025-11-17 03:15:47.486'),('cmhzm13jq00099tn4rj1pcgu7','social_10_followers','10 Takipçi','10 takipçiye ulaştın!','👥','social','common',50,10,1,1,'2025-11-15 01:30:28.791','2025-11-17 03:15:47.488'),('cmhzm13jt000a9tn4q5pyi53b','social_50_followers','50 Takipçi','50 takipçiye ulaştın!','🌟','social','rare',150,30,1,2,'2025-11-15 01:30:28.793','2025-11-17 03:15:47.492'),('cmhzm13jv000b9tn4z3zvvspr','social_100_likes','100 Beğeni','İçeriklerine 100 beğeni aldın!','❤️','social','rare',100,25,1,3,'2025-11-15 01:30:28.795','2025-11-17 03:15:47.495'),('cmhzm13jx000c9tn4u3dl4vv0','early_adopter','Erken Katılan','Platformun ilk kullanıcılarındansın!','🚀','special','legendary',500,100,1,1,'2025-11-15 01:30:28.798','2025-11-17 03:15:47.497'),('cmhzm13jz000d9tn4zpbzt9vx','guild_founder','Lonca Kurucusu','Bir lonca kurdun!','🏰','special','epic',200,50,1,2,'2025-11-15 01:30:28.800','2025-11-17 03:15:47.500'),('cmi28gz79000eqpmb3fujyxtf','first_weight_log','İlk Tartı','İlk kilo kaydını girdin!','⚖️','achievement','common',25,5,1,4,'2025-11-16 21:34:13.558','2025-11-17 03:15:47.502'),('cmi28gz7c000fqpmbocnabgsz','weight_loss_1kg','İlk Kilo','İlk kilonu verdin!','🎈','milestone','common',50,10,1,7,'2025-11-16 21:34:13.561','2025-11-17 03:15:47.505'),('cmi28gz7h000gqpmbfho98ss8','weight_loss_50kg','Süper Transformasyon','50kg verdin, inanılmaz bir başarı!','🦸','milestone','legendary',2000,500,1,8,'2025-11-16 21:34:13.565','2025-11-17 03:15:47.507'),('cmi28gz7j000hqpmbznsby3dl','first_progress_photo','İlk Fotoğraf','İlk ilerleme fotoğrafını yükledin!','📸','achievement','common',30,10,1,5,'2025-11-16 21:34:13.568','2025-11-17 03:15:47.509'),('cmi28gz7m000iqpmbrub7zf7r','photo_streak_30','Fotoğraf Koleksiyoncusu','30 gün boyunca fotoğraf çektin!','📷','milestone','epic',200,50,1,9,'2025-11-16 21:34:13.570','2025-11-17 03:15:47.511'),('cmi28gz7o000jqpmbo3b96m00','first_check_in','İlk Check-in','İlk günlük check-in\'ini yaptın!','✅','achievement','common',20,5,1,6,'2025-11-16 21:34:13.572','2025-11-17 03:15:47.514'),('cmi28gz7q000kqpmbyf3vmezn','streak_365','Yılın Şampiyonu','365 gün üst üste check-in yaptın!','🏅','milestone','legendary',5000,1000,1,10,'2025-11-16 21:34:13.574','2025-11-17 03:15:47.516'),('cmi28gz7s000lqpmbfc419mid','first_measurement','İlk Ölçüm','İlk vücut ölçümünü yaptın!','📏','achievement','common',25,5,1,7,'2025-11-16 21:34:13.576','2025-11-17 03:15:47.519'),('cmi28gz7u000mqpmbhqravqsk','mood_tracker','Ruh Hali Takipçisi','30 gün ruh hali kaydı tuttun!','😊','milestone','rare',100,25,1,11,'2025-11-16 21:34:13.578','2025-11-17 03:15:47.521'),('cmi28gz7w000nqpmbcl91emuz','first_voice_note','İlk Ses Notu','İlk ses notunu kaydettın!','🎙️','achievement','common',30,10,1,8,'2025-11-16 21:34:13.580','2025-11-17 03:15:47.523'),('cmi28gz7y000oqpmby2bur7n4','voice_diary_master','Ses Günlüğü Ustası','50 ses notu kaydettın!','🎧','milestone','epic',250,75,1,12,'2025-11-16 21:34:13.582','2025-11-17 03:15:47.525'),('cmi28gz80000pqpmbt070ehyu','recipe_master_10','Tarif Ustası','10 tarif paylaştın!','👨‍🍳','achievement','rare',150,30,1,9,'2025-11-16 21:34:13.585','2025-11-17 03:15:47.528'),('cmi28gz82000qqpmbz38hi9e7','recipe_master_50','Şef','50 tarif paylaştın!','🧑‍🍳','achievement','epic',500,100,1,10,'2025-11-16 21:34:13.587','2025-11-17 03:15:47.530'),('cmi28gz84000rqpmbzsys9jrh','recipe_viral','Viral Tarif','Tarifin 1000 beğeni aldı!','🔥','special','legendary',1000,250,1,3,'2025-11-16 21:34:13.589','2025-11-17 03:15:47.532'),('cmi28gz86000sqpmbrhx3nzjm','plan_creator_10','Plan Uzmanı','10 plan oluşturdun!','📋','achievement','rare',150,30,1,11,'2025-11-16 21:34:13.591','2025-11-17 03:15:47.534'),('cmi28gz88000tqpmb5zbcqe5t','plan_popular','Popüler Plan','Planın 500 kişi tarafından kullanıldı!','⭐','special','epic',500,100,1,4,'2025-11-16 21:34:13.593','2025-11-17 03:15:47.537'),('cmi28gz8b000uqpmbt931y39e','comment_master_100','Yorum Ustası','100 yorum yaptın!','💭','achievement','rare',100,25,1,12,'2025-11-16 21:34:13.595','2025-11-17 03:15:47.542'),('cmi28gz8d000vqpmbf6f4f9op','helpful_commenter','Yardımsever','Yorumların 100 beğeni aldı!','🤝','social','rare',150,30,1,4,'2025-11-16 21:34:13.597','2025-11-17 03:15:47.548'),('cmi28gz8f000wqpmb3p0kfdom','social_100_followers','100 Takipçi','100 takipçiye ulaştın!','🎯','social','epic',300,75,1,5,'2025-11-16 21:34:13.599','2025-11-17 03:15:47.550'),('cmi28gz8h000xqpmbr3fwee11','social_500_followers','İnfluencer','500 takipçiye ulaştın!','🌟','social','legendary',1000,250,1,6,'2025-11-16 21:34:13.601','2025-11-17 03:15:47.553'),('cmi28gz8j000yqpmb60kgsrv9','social_networker','Sosyal Kelebek','50 kişiyi takip ettin!','🦋','social','common',50,10,1,7,'2025-11-16 21:34:13.603','2025-11-17 03:15:47.555'),('cmi28gz8l000zqpmb7b6gecm5','first_group_join','Grup Üyesi','İlk gruba katıldın!','👥','social','common',25,5,1,8,'2025-11-16 21:34:13.605','2025-11-17 03:15:47.557'),('cmi28gz8n0010qpmb6ptxszil','group_creator','Grup Kurucusu','Bir grup oluşturdun!','🏛️','social','rare',100,25,1,9,'2025-11-16 21:34:13.608','2025-11-17 03:15:47.559'),('cmi28gz8p0011qpmb23l1g70b','group_active_member','Aktif Üye','Gruplarda 100 gönderi paylaştın!','📢','social','epic',200,50,1,10,'2025-11-16 21:34:13.610','2025-11-17 03:15:47.561'),('cmi28gz8r0012qpmbi0lgs6pg','guild_member','Lonca Üyesi','Bir loncaya katıldın!','⚔️','social','common',50,10,1,11,'2025-11-16 21:34:13.612','2025-11-17 03:15:47.563'),('cmi28gz8t0013qpmbshirwj3u','guild_officer','Lonca Subayı','Lonca subayı oldun!','🛡️','special','epic',300,75,1,5,'2025-11-16 21:34:13.613','2025-11-17 03:15:47.566'),('cmi28gz8v0014qpmbjr4b0hac','guild_champion','Lonca Şampiyonu','Loncan 1. lige çıktı!','🏆','special','legendary',1000,250,1,6,'2025-11-16 21:34:13.615','2025-11-17 03:15:47.568'),('cmi28gz8x0015qpmbhvr3ym48','first_message','İlk Mesaj','İlk mesajını gönderdin!','✉️','social','common',20,5,1,12,'2025-11-16 21:34:13.618','2025-11-17 03:15:47.570'),('cmi28gz8z0016qpmbagbm6m2v','social_butterfly','Sohbet Canavarı','100 mesaj gönderdin!','💌','social','rare',100,25,1,13,'2025-11-16 21:34:13.620','2025-11-17 03:15:47.572'),('cmi28gz910017qpmbhmyh35cm','first_referral','İlk Davet','İlk arkadaşını davet ettin!','🎁','social','common',50,10,1,14,'2025-11-16 21:34:13.621','2025-11-17 03:15:47.574'),('cmi28gz930018qpmbrj4aab1l','referral_master_10','Davet Ustası','10 arkadaşını davet ettin!','🎉','social','epic',500,100,1,15,'2025-11-16 21:34:13.624','2025-11-17 03:15:47.576'),('cmi28gz950019qpmb62as5f4j','referral_legend','Davet Efsanesi','50 arkadaşını davet ettin!','👑','social','legendary',2000,500,1,16,'2025-11-16 21:34:13.626','2025-11-17 03:15:47.578'),('cmi28gz98001aqpmb0vrgqb3s','level_10','Seviye 10','10. seviyeye ulaştın!','🔟','milestone','rare',100,25,1,13,'2025-11-16 21:34:13.628','2025-11-17 03:15:47.581'),('cmi28gz99001bqpmbhuejc2xj','level_25','Seviye 25','25. seviyeye ulaştın!','🎖️','milestone','epic',250,75,1,14,'2025-11-16 21:34:13.630','2025-11-17 03:15:47.583'),('cmi28gz9b001cqpmbqyuh4raf','level_50','Seviye 50','50. seviyeye ulaştın!','👑','milestone','legendary',1000,250,1,15,'2025-11-16 21:34:13.632','2025-11-17 03:15:47.585'),('cmi28gz9e001dqpmbw3m70qpc','level_100','Efsane','100. seviyeye ulaştın!','💎','milestone','legendary',5000,1000,1,16,'2025-11-16 21:34:13.634','2025-11-17 03:15:47.587'),('cmi28gz9f001eqpmbgfeoutg0','quest_master_10','Görev Tamamlayıcı','10 görev tamamladın!','📝','achievement','common',50,10,1,13,'2025-11-16 21:34:13.636','2025-11-17 03:15:47.589'),('cmi28gz9i001fqpmbxc4tq8yl','quest_master_100','Görev Ustası','100 görev tamamladın!','📜','achievement','epic',500,100,1,14,'2025-11-16 21:34:13.638','2025-11-17 03:15:47.591'),('cmi28gz9k001gqpmbkki6ugbr','daily_quest_streak_30','Günlük Görev Şampiyonu','30 gün üst üste günlük görevleri tamamladın!','🎯','milestone','epic',300,75,1,17,'2025-11-16 21:34:13.640','2025-11-17 03:15:47.597'),('cmi28gz9m001hqpmb7fdebjhu','coin_collector_1000','Coin Koleksiyoncusu','1000 coin biriktirdin!','💰','milestone','rare',100,50,1,18,'2025-11-16 21:34:13.642','2025-11-17 03:15:47.602'),('cmi28gz9o001iqpmbjm4mwzyj','coin_collector_10000','Zengin','10000 coin biriktirdin!','💎','milestone','legendary',1000,250,1,19,'2025-11-16 21:34:13.644','2025-11-17 03:15:47.604'),('cmi28gz9q001jqpmb7slos8zy','first_purchase','İlk Alışveriş','Mağazadan ilk alışverişini yaptın!','🛒','achievement','common',25,5,1,15,'2025-11-16 21:34:13.646','2025-11-17 03:15:47.606'),('cmi28gz9s001kqpmbopopc76m','shopaholic','Alışveriş Tutkunu','Mağazadan 20 ürün aldın!','🛍️','achievement','rare',150,30,1,16,'2025-11-16 21:34:13.648','2025-11-17 03:15:47.609'),('cmi28gz9u001lqpmbcltpxa63','league_bronze','Bronz Lig','Bronz lige ulaştın!','🥉','milestone','common',50,10,1,20,'2025-11-16 21:34:13.650','2025-11-17 03:15:47.611'),('cmi28gz9w001mqpmbseljns18','league_silver','Gümüş Lig','Gümüş lige ulaştın!','🥈','milestone','rare',100,25,1,21,'2025-11-16 21:34:13.652','2025-11-17 03:15:47.613'),('cmi28gz9y001nqpmb66x8r5n5','league_gold','Altın Lig','Altın lige ulaştın!','🥇','milestone','epic',250,75,1,22,'2025-11-16 21:34:13.654','2025-11-17 03:15:47.615'),('cmi28gza0001oqpmbvdf218hn','league_platinum','Platin Lig','Platin lige ulaştın!','💿','milestone','epic',500,100,1,23,'2025-11-16 21:34:13.656','2025-11-17 03:15:47.617'),('cmi28gza2001pqpmb0cnbm70v','league_diamond','Elmas Lig','Elmas lige ulaştın!','💎','milestone','legendary',1000,250,1,24,'2025-11-16 21:34:13.658','2025-11-17 03:15:47.619'),('cmi28gza4001qqpmb0n8lmvis','season_winner','Sezon Şampiyonu','Bir sezonu 1. sırada bitirdin!','🏆','special','legendary',2000,500,1,7,'2025-11-16 21:34:13.660','2025-11-17 03:15:47.621'),('cmi28gza6001rqpmbnvvcfuzo','beta_tester','Beta Tester','Beta döneminde katıldın!','🧪','special','legendary',1000,250,1,8,'2025-11-16 21:34:13.662','2025-11-17 03:15:47.623'),('cmi28gza8001sqpmb4fyiuxr2','bug_hunter','Bug Avcısı','10 bug rapor ettin!','🐛','special','epic',500,100,1,9,'2025-11-16 21:34:13.664','2025-11-17 03:15:47.625'),('cmi28gzaa001tqpmbtletlwr3','community_hero','Topluluk Kahramanı','Topluluk moderatörü oldun!','🦸‍♂️','special','legendary',1000,250,1,10,'2025-11-16 21:34:13.667','2025-11-17 03:15:47.627'),('cmi28gzac001uqpmbxncfhp4t','verified_user','Onaylı Kullanıcı','Hesabın onaylandı!','✓','special','rare',100,25,1,11,'2025-11-16 21:34:13.669','2025-11-17 03:15:47.629'),('cmi2ko8j3001ve8itl6gb8iiz','confession_first','Dürüst Ruh','İlk itirafını yaptın!','🙏','achievement','common',50,10,1,17,'2025-11-17 03:15:47.631','2025-11-17 03:15:47.631'),('cmi2ko8j6001we8itljp1ggeu','confession_master','İtiraf Ustası','10 itiraf yaptın!','📿','achievement','rare',150,50,1,18,'2025-11-17 03:15:47.634','2025-11-17 03:15:47.634'),('cmi2ko8ja001xe8it9g3lhcis','empathy_hero','Empati Kahramanı','50 kez empati gösterdin!','💝','social','epic',200,50,1,17,'2025-11-17 03:15:47.639','2025-11-17 03:15:47.639'),('cmi2ko8jc001ye8it3t8hny91','night_warrior','Gece Savaşçısı','Gece saatlerinde itiraf yaptın!','🌙','special','rare',100,25,1,12,'2025-11-17 03:15:47.641','2025-11-17 03:15:47.641'),('cmi2ko8je001ze8it1hs3z71y','seasonal_ramadan','Ramazan Mücahidi','Ramazan ayında itiraf yaptın!','🌙','special','epic',150,40,1,13,'2025-11-17 03:15:47.643','2025-11-17 03:15:47.643'),('cmi2ko8jg0020e8itclbwnqvm','seasonal_newyear','Yılbaşı Kurbanı','Yılbaşı döneminde itiraf yaptın!','🎄','special','epic',150,40,1,14,'2025-11-17 03:15:47.645','2025-11-17 03:15:47.645'),('cmi2ko8ji0021e8itni7lyuh5','seasonal_bayram','Bayram Şekeri Avcısı','Bayram döneminde itiraf yaptın!','🍬','special','epic',150,40,1,15,'2025-11-17 03:15:47.647','2025-11-17 03:15:47.647'),('cmi2ko8jk0022e8it4c7do1aj','popular_confession','Viral İtiraf','İtirafın 100+ empati aldı!','🔥','special','legendary',500,100,1,16,'2025-11-17 03:15:47.649','2025-11-17 03:15:47.649');
/*!40000 ALTER TABLE `badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `battle_pass_rewards`
--

DROP TABLE IF EXISTS `battle_pass_rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battle_pass_rewards` (
  `id` varchar(191) NOT NULL,
  `passId` varchar(191) NOT NULL,
  `level` int(11) NOT NULL,
  `rewardType` enum('badge','coins','xp','item') NOT NULL,
  `rewardId` varchar(191) DEFAULT NULL,
  `rewardValue` int(11) DEFAULT NULL,
  `description` varchar(191) NOT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `battle_pass_rewards_passId_level_key` (`passId`,`level`),
  KEY `battle_pass_rewards_passId_idx` (`passId`),
  CONSTRAINT `battle_pass_rewards_passId_fkey` FOREIGN KEY (`passId`) REFERENCES `battle_passes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battle_pass_rewards`
--

LOCK TABLES `battle_pass_rewards` WRITE;
/*!40000 ALTER TABLE `battle_pass_rewards` DISABLE KEYS */;
/*!40000 ALTER TABLE `battle_pass_rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `battle_passes`
--

DROP TABLE IF EXISTS `battle_passes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `battle_passes` (
  `id` varchar(191) NOT NULL,
  `seasonId` varchar(191) NOT NULL,
  `tier` enum('free','premium') NOT NULL DEFAULT 'free',
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL DEFAULT 0,
  `maxLevel` int(11) NOT NULL DEFAULT 50,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `battle_passes_seasonId_tier_key` (`seasonId`,`tier`),
  KEY `battle_passes_seasonId_idx` (`seasonId`),
  CONSTRAINT `battle_passes_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `battle_passes`
--

LOCK TABLES `battle_passes` WRITE;
/*!40000 ALTER TABLE `battle_passes` DISABLE KEYS */;
/*!40000 ALTER TABLE `battle_passes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_categories`
--

DROP TABLE IF EXISTS `blog_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_categories` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `color` varchar(191) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_categories_name_key` (`name`),
  UNIQUE KEY `blog_categories_slug_key` (`slug`),
  KEY `blog_categories_slug_idx` (`slug`),
  KEY `blog_categories_order_idx` (`order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_categories`
--

LOCK TABLES `blog_categories` WRITE;
/*!40000 ALTER TABLE `blog_categories` DISABLE KEYS */;
INSERT INTO `blog_categories` VALUES ('cmi37dfod0012t7ne8ziymnvf','Beslenme','beslenme','Sağlıklı beslenme, diyet ve besin değerleri hakkında bilgiler','🥗','#10b981',1,'2025-11-17 13:51:14.846','2025-11-17 13:51:14.846'),('cmi37dfoh0013t7nedecs5sn8','Egzersiz','egzersiz','Spor, fitness ve egzersiz programları','💪','#3b82f6',2,'2025-11-17 13:51:14.849','2025-11-17 13:51:14.849'),('cmi37dfoj0014t7nef7bpjq80','Motivasyon','motivasyon','Motivasyon hikayeleri ve ilham verici içerikler','⭐','#f59e0b',3,'2025-11-17 13:51:14.852','2025-11-17 13:51:14.852'),('cmi37dfoo0015t7neqxe75oj0','Tarifler','tarifler','Sağlıklı ve lezzetli tarifler','🍳','#ef4444',4,'2025-11-17 13:51:14.856','2025-11-17 13:51:14.856'),('cmi37dfoq0016t7neksypk4ko','Sağlık','saglik','Genel sağlık, wellness ve yaşam tarzı','❤️','#ec4899',5,'2025-11-17 13:51:14.858','2025-11-17 13:51:14.858'),('cmi37glov00177pfm2pkh0v38','Psikoloji','psikoloji','Duygusal yeme, stres yönetimi ve zihinsel sağlık','🧠','#8b5cf6',6,'2025-11-17 13:53:42.608','2025-11-17 13:53:42.608'),('cmi37gloy00187pfmgdkkj7vm','Başarı Hikayeleri','basari-hikayeleri','Gerçek kullanıcı deneyimleri ve dönüşüm hikayeleri','🏆','#f97316',7,'2025-11-17 13:53:42.610','2025-11-17 13:53:42.610'),('cmi37glp300197pfma41t7u9e','Yaşam Tarzı','yasam-tarzi','Günlük alışkanlıklar, uyku ve yaşam kalitesi','🌟','#06b6d4',8,'2025-11-17 13:53:42.615','2025-11-17 13:53:42.615'),('cmi37glp5001a7pfmrhbhnbfm','Uzman Tavsiyeleri','uzman-tavsiyeleri','Diyetisyen, doktor ve antrenörlerden profesyonel öneriler','👨‍⚕️','#14b8a6',9,'2025-11-17 13:53:42.617','2025-11-17 13:53:42.617'),('cmi37glp7001b7pfm9yefgcdf','Hızlı İpuçları','hizli-ipuclari','Pratik ve uygulanabilir günlük ipuçları','💡','#eab308',10,'2025-11-17 13:53:42.619','2025-11-17 13:53:42.619');
/*!40000 ALTER TABLE `blog_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_comments`
--

DROP TABLE IF EXISTS `blog_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_comments` (
  `id` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','SPAM') NOT NULL DEFAULT 'PENDING',
  `postId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `blog_comments_postId_status_idx` (`postId`,`status`),
  KEY `blog_comments_userId_idx` (`userId`),
  KEY `blog_comments_status_createdAt_idx` (`status`,`createdAt`),
  KEY `blog_comments_createdAt_idx` (`createdAt`),
  CONSTRAINT `blog_comments_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `blog_comments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_comments`
--

LOCK TABLES `blog_comments` WRITE;
/*!40000 ALTER TABLE `blog_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_posts` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` varchar(300) DEFAULT NULL,
  `coverImage` varchar(191) DEFAULT NULL,
  `coverImageAlt` varchar(191) DEFAULT NULL,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` varchar(160) DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `featuredOrder` int(11) DEFAULT NULL,
  `viewCount` int(11) NOT NULL DEFAULT 0,
  `readingTime` int(11) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_key` (`slug`),
  KEY `blog_posts_slug_idx` (`slug`),
  KEY `blog_posts_status_publishedAt_idx` (`status`,`publishedAt`),
  KEY `blog_posts_categoryId_idx` (`categoryId`),
  KEY `blog_posts_featured_idx` (`featured`),
  KEY `blog_posts_authorId_idx` (`authorId`),
  KEY `blog_posts_createdAt_idx` (`createdAt`),
  FULLTEXT KEY `blog_posts_title_content_idx` (`title`,`content`),
  CONSTRAINT `blog_posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `blog_posts_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `blog_categories` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES ('cmi37kqoa001d6jd8snf1thrp','Sağlıklı Kilo Vermenin 10 Altın Kuralı','saglikli-kilo-vermenin-10-altin-kurali','<h2>Giriş</h2>\n<p>Sağlıklı kilo vermek, sadece daha iyi görünmekle ilgili değil; aynı zamanda genel sağlığınızı iyileştirmek ve yaşam kalitenizi artırmakla ilgilidir. Bu yazıda, sürdürülebilir ve sağlıklı kilo verme yolculuğunuzda size rehberlik edecek 10 temel kuralı paylaşacağız.</p>\n\n<h2>1. Gerçekçi Hedefler Belirleyin</h2>\n<p>Haftada 0.5-1 kg kilo vermek sağlıklı ve sürdürülebilir bir hedeftir. Aşırı hızlı kilo verme, kas kaybına ve metabolizmanın yavaşlamasına neden olabilir.</p>\n\n<h2>2. Kalori Açığı Oluşturun</h2>\n<p>Kilo vermek için harcadığınız kaloriden daha az kalori almanız gerekir. Ancak bu açık çok büyük olmamalı - günlük 500-750 kalori açığı idealdir.</p>\n\n<h2>3. Protein Tüketiminizi Artırın</h2>\n<p>Protein, tokluk hissi verir, kas kütlesini korur ve metabolizmayı hızlandırır. Her öğünde kaliteli protein kaynağı bulundurun.</p>\n\n<h2>4. Bol Su İçin</h2>\n<p>Günde en az 2-3 litre su içmek, metabolizmayı hızlandırır ve açlık hissini azaltır. Bazen susuzluğu açlıkla karıştırabiliriz.</p>\n\n<h2>5. Düzenli Egzersiz Yapın</h2>\n<p>Haftada en az 150 dakika orta şiddette egzersiz yapın. Kardiyo ve kuvvet antrenmanlarını birleştirin.</p>\n\n<h2>6. Yeterli Uyuyun</h2>\n<p>Uyku eksikliği, açlık hormonlarını etkiler ve kilo vermeyi zorlaştırır. Günde 7-9 saat kaliteli uyku hedefleyin.</p>\n\n<h2>7. Stres Yönetimi</h2>\n<p>Kronik stres, kortizol seviyesini artırır ve kilo almaya neden olabilir. Meditasyon, yoga veya nefes egzersizleri deneyin.</p>\n\n<h2>8. İşlenmiş Gıdalardan Kaçının</h2>\n<p>Tam, doğal gıdaları tercih edin. İşlenmiş gıdalar genellikle yüksek kalorili ve düşük besin değerlidir.</p>\n\n<h2>9. Öğün Atlama</h2>\n<p>Düzenli öğünler, metabolizmanızı aktif tutar ve aşırı yeme isteğini önler. Günde 3 ana öğün ve 2 ara öğün ideal olabilir.</p>\n\n<h2>10. Sabırlı Olun</h2>\n<p>Kilo verme bir maraton, sprint değil. Küçük adımlarla ilerleyin ve süreçten keyif alın. Hatalar yaptığınızda kendinizi affetmeyi öğrenin.</p>\n\n<h2>Sonuç</h2>\n<p>Bu 10 kuralı hayatınıza entegre ederek, sağlıklı ve sürdürülebilir bir kilo verme yolculuğuna başlayabilirsiniz. Unutmayın, en önemli şey tutarlılıktır!</p>','Sağlıklı ve sürdürülebilir kilo verme için bilmeniz gereken 10 temel kural. Gerçekçi hedeflerden stres yönetimine kadar her şey bu yazıda.','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80','Sağlıklı beslenme ve egzersiz','Sağlıklı Kilo Vermenin 10 Altın Kuralı | Zayıflama Planı','Sağlıklı kilo vermek için bilmeniz gereken 10 temel kural. Gerçekçi hedefler, kalori açığı, protein tüketimi ve daha fazlası.','PUBLISHED',1,1,0,5,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfod0012t7ne8ziymnvf','2025-11-10 13:56:55.690','2025-11-17 13:56:55.691','2025-11-18 14:03:57.362',NULL),('cmi37kqow001f6jd8qrmriwf5','Evde Yapabileceğiniz 15 Dakikalık HIIT Antrenmanı','evde-yapabileceginiz-15-dakikalik-hiit-antrenman','<h2>HIIT Nedir?</h2>\n<p>HIIT (High Intensity Interval Training), yüksek yoğunluklu egzersizlerin kısa dinlenme periyotlarıyla birleştirildiği bir antrenman yöntemidir. Kısa sürede maksimum kalori yakar ve metabolizmayı saatlerce hızlı tutar.</p>\n\n<h2>Isınma (3 dakika)</h2>\n<ul>\n<li>Yerinde yürüyüş - 1 dakika</li>\n<li>Kol çevirme - 30 saniye</li>\n<li>Bacak sallamaları - 30 saniye</li>\n<li>Hafif zıplamalar - 1 dakika</li>\n</ul>\n\n<h2>Ana Antrenman (10 dakika)</h2>\n<p>Her hareketi 40 saniye yapın, 20 saniye dinlenin. 2 tur tekrarlayın.</p>\n\n<h3>1. Jumping Jacks</h3>\n<p>Klasik bir kardiyo hareketi. Kollarınızı ve bacaklarınızı açıp kapatarak zıplayın.</p>\n\n<h3>2. Squat</h3>\n<p>Ayaklar omuz genişliğinde, kalçayı geriye iterek çömelme hareketi yapın.</p>\n\n<h3>3. Mountain Climbers</h3>\n<p>Plank pozisyonunda, dizlerinizi göğsünüze doğru hızlıca çekin.</p>\n\n<h3>4. Burpees</h3>\n<p>Tam vücut hareketi: Çömel, plank yap, şınav çek, zıpla.</p>\n\n<h3>5. High Knees</h3>\n<p>Yerinde koşarken dizlerinizi mümkün olduğunca yukarı kaldırın.</p>\n\n<h2>Soğuma (2 dakika)</h2>\n<ul>\n<li>Yavaş yürüyüş - 1 dakika</li>\n<li>Germe hareketleri - 1 dakika</li>\n</ul>\n\n<h2>İpuçları</h2>\n<ul>\n<li>Hareketleri doğru formda yapmaya odaklanın</li>\n<li>Kendi temponu bul, aşırı zorlama</li>\n<li>Haftada 3-4 kez yapabilirsiniz</li>\n<li>Bol su için</li>\n</ul>\n\n<h2>Sonuç</h2>\n<p>Bu 15 dakikalık HIIT antrenmanı, yoğun bir gününüzde bile yapabileceğiniz etkili bir egzersizdir. Düzenli yapıldığında harika sonuçlar verir!</p>','Sadece 15 dakikada evde yapabileceğiniz etkili HIIT antrenmanı. Ekipman gerektirmez, maksimum kalori yakar!','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80','HIIT antrenmanı yapan kişi','15 Dakikalık Evde HIIT Antrenmanı | Zayıflama Planı','Evde ekipmansız yapabileceğiniz 15 dakikalık HIIT antrenmanı. Maksimum kalori yakın, fit kalın!','PUBLISHED',1,2,0,4,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfoh0013t7nedecs5sn8','2025-11-12 13:56:55.690','2025-11-17 13:56:55.712','2025-11-18 05:28:26.726',NULL),('cmi37kqoz001h6jd8i80uglwo','30 Kilo Verdim: Benim Hikayem','30-kilo-verdim-benim-hikayem','<h2>Başlangıç</h2>\n<p>Merhaba! Ben Ayşe, 32 yaşındayım ve 18 ayda 30 kilo verdim. Bu yazıda sizlerle yolculuğumu, zorluklarımı ve başarı sırlarımı paylaşmak istiyorum.</p>\n\n<h2>Neden Karar Verdim?</h2>\n<p>95 kiloydum ve kendimi hiç iyi hissetmiyordum. Merdiven çıkarken nefes nefese kalıyor, eski kıyafetlerim artık olmuyor, fotoğraf çektirilmekten kaçınıyordum. Bir gün aynaya baktım ve \"yeter\" dedim.</p>\n\n<h2>İlk Adımlar</h2>\n<p>Önce küçük değişikliklerle başladım:</p>\n<ul>\n<li>Şekerli içecekleri bıraktım</li>\n<li>Porsiyon kontrolü yapmaya başladım</li>\n<li>Günde 10.000 adım yürümeye başladım</li>\n<li>Su tüketimimi artırdım</li>\n</ul>\n\n<h2>Zorluklar</h2>\n<p>Tabii ki her şey pembe değildi. İlk 3 ay çok zordu. Sosyal ortamlarda yemek seçmek, arkadaşlarımın \"bir tane yesen ne olur\" baskısı, plato dönemleri... Ama pes etmedim.</p>\n\n<h2>Dönüm Noktası</h2>\n<p>4. ayda spor salonuna yazdım. Başta çok utanıyordum ama herkes kendi işine bakıyordu. Kuvvet antrenmanı yapmaya başladığımda her şey değişti. Sadece kilo vermekle kalmadım, vücudum şekillendi.</p>\n\n<h2>Beslenme Düzenim</h2>\n<ul>\n<li><strong>Kahvaltı:</strong> Yumurta, tam buğday ekmeği, avokado</li>\n<li><strong>Ara öğün:</strong> Meyve veya kuruyemiş</li>\n<li><strong>Öğle:</strong> Izgara tavuk/balık, salata, bulgur</li>\n<li><strong>Ara öğün:</strong> Yoğurt veya protein bar</li>\n<li><strong>Akşam:</strong> Sebze yemeği, protein kaynağı</li>\n</ul>\n\n<h2>Egzersiz Programım</h2>\n<ul>\n<li>Pazartesi, Çarşamba, Cuma: Kuvvet antrenmanı (45 dk)</li>\n<li>Salı, Perşembe: Kardiyo (30 dk)</li>\n<li>Cumartesi: Aktif dinlenme (yürüyüş, yoga)</li>\n<li>Pazar: Tam dinlenme</li>\n</ul>\n\n<h2>Öğrendiklerim</h2>\n<ol>\n<li>Kilo verme bir maraton, sprint değil</li>\n<li>Mükemmel olmak zorunda değilsiniz</li>\n<li>Kendinizi sevmek en önemlisi</li>\n<li>Destek sistemi çok önemli</li>\n<li>Sabır ve tutarlılık her şeydir</li>\n</ol>\n\n<h2>Şimdi</h2>\n<p>65 kiloyum ve kendimi harika hissediyorum. Enerji doluyum, özgüvenim arttı, sağlığım çok daha iyi. Ama en önemlisi, artık sağlıklı yaşamı bir diyet değil, yaşam tarzı olarak görüyorum.</p>\n\n<h2>Size Tavsiyem</h2>\n<p>Eğer siz de bu yolculuğa başlamayı düşünüyorsanız, bugün başlayın. Mükemmel zamanı beklemeyin. Küçük adımlarla başlayın ve asla pes etmeyin. Siz de yapabilirsiniz!</p>','18 ayda 30 kilo veren Ayşe\'nin ilham verici hikayesi. Zorluklardan başarıya giden yolda neler yaşadı?','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80','Başarı hikayesi - önce ve sonra','30 Kilo Verdim: İlham Verici Başarı Hikayesi | Zayıflama Planı','18 ayda 30 kilo veren Ayşe\'nin gerçek hikayesi. Zorluklardan başarıya giden yolda neler yaşadı, nasıl başardı?','PUBLISHED',1,3,0,6,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfoj0014t7nef7bpjq80','2025-11-14 13:56:55.690','2025-11-17 13:56:55.716','2025-11-18 05:28:26.501',NULL),('cmi37kqp3001j6jd8mz36evnl','Protein Pancake Tarifi: Sağlıklı ve Lezzetli','protein-pancake-tarifi-saglikli-ve-lezzetli','<h2>Malzemeler</h2>\n<ul>\n<li>1 orta boy muz</li>\n<li>2 yumurta</li>\n<li>30g yulaf unu</li>\n<li>1 ölçek protein tozu (vanilya)</li>\n<li>1 çay kaşığı kabartma tozu</li>\n<li>Tarçın (isteğe bağlı)</li>\n<li>Hindistan cevizi yağı (pişirmek için)</li>\n</ul>\n\n<h2>Besin Değerleri (1 porsiyon)</h2>\n<ul>\n<li><strong>Kalori:</strong> 320 kcal</li>\n<li><strong>Protein:</strong> 28g</li>\n<li><strong>Karbonhidrat:</strong> 35g</li>\n<li><strong>Yağ:</strong> 8g</li>\n</ul>\n\n<h2>Hazırlanışı</h2>\n\n<h3>Adım 1: Hamuru Hazırlayın</h3>\n<p>Muzu bir kaseye alın ve çatalla ezin. Yumurtaları ekleyin ve iyice karıştırın.</p>\n\n<h3>Adım 2: Kuru Malzemeleri Ekleyin</h3>\n<p>Yulaf unu, protein tozu, kabartma tozu ve tarçını ekleyin. Pürüzsüz bir hamur elde edene kadar karıştırın.</p>\n\n<h3>Adım 3: Pişirin</h3>\n<p>Yapışmaz bir tavayı orta ateşte ısıtın. Hindistan cevizi yağı sürün. Hamurdan kepçe ile alıp tavaya dökün. Her iki tarafı da 2-3 dakika pişirin.</p>\n\n<h3>Adım 4: Servis Yapın</h3>\n<p>Pancake\'leri tabağa alın. Üzerine taze meyveler, bal veya fıstık ezmesi ekleyebilirsiniz.</p>\n\n<h2>İpuçları</h2>\n<ul>\n<li>Hamur çok koyu olursa biraz süt ekleyebilirsiniz</li>\n<li>Tavayı çok sıcak yapmayın, yanabilir</li>\n<li>Önceden hazırlayıp buzdolabında saklayabilirsiniz</li>\n<li>Dondurucuda 1 ay saklanabilir</li>\n</ul>\n\n<h2>Varyasyonlar</h2>\n\n<h3>Çikolatalı Versiyon</h3>\n<p>1 yemek kaşığı kakao tozu ekleyin ve çikolata parçacıkları serpin.</p>\n\n<h3>Yaban Mersinli Versiyon</h3>\n<p>Hamura bir avuç yaban mersini ekleyin.</p>\n\n<h3>Fıstık Ezmeli Versiyon</h3>\n<p>Hamura 1 yemek kaşığı fıstık ezmesi ekleyin.</p>\n\n<h2>Neden Bu Tarif?</h2>\n<p>Bu protein pancake tarifi, yüksek protein içeriği sayesinde tokluk hissi verir ve kas yapımını destekler. Kahvaltıda veya antrenman sonrası mükemmel bir seçenektir. Ayrıca çok lezzetli!</p>\n\n<h2>Sonuç</h2>\n<p>Sağlıklı beslenmenin sıkıcı olması gerekmiyor. Bu protein pancake tarifi hem lezzetli hem de besleyici. Hemen deneyin!</p>','Yüksek proteinli, düşük kalorili ve çok lezzetli pancake tarifi. Kahvaltıda veya antrenman sonrası ideal!','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80','Protein pancake tabağı','Protein Pancake Tarifi: Sağlıklı Kahvaltı | Zayıflama Planı','Yüksek proteinli, düşük kalorili protein pancake tarifi. Sadece 5 malzeme ile hazırlayın!','PUBLISHED',0,NULL,0,3,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfoo0015t7neqxe75oj0','2025-11-15 13:56:55.690','2025-11-17 13:56:55.719','2025-11-18 14:04:56.684',NULL),('cmi37kqp6001l6jd8rw0hk5nr','Su İçmenin Kilo Vermeye Etkisi','su-icmenin-kilo-vermeye-etkisi','<h2>Giriş</h2>\n<p>Su içmek, kilo verme sürecinde en çok göz ardı edilen faktörlerden biridir. Ancak yeterli su tüketimi, metabolizmayı hızlandırır ve kilo vermeyi kolaylaştırır. Bu yazıda, suyun kilo vermeye etkilerini bilimsel açıdan inceleyeceğiz.</p>\n\n<h2>Su ve Metabolizma</h2>\n<p>Araştırmalar, 500 ml su içmenin metabolizmayı %30 oranında hızlandırdığını gösteriyor. Bu etki yaklaşık 30-40 dakika sürer. Günde 2 litre su içmek, ekstra 96 kalori yakmanıza yardımcı olabilir.</p>\n\n<h2>Tokluk Hissi</h2>\n<p>Yemeklerden önce 1-2 bardak su içmek, tokluk hissini artırır ve daha az kalori almanıza yardımcı olur. Bir çalışmada, yemek öncesi su içen kişilerin %44 daha fazla kilo verdiği bulunmuş.</p>\n\n<h2>Susuzluk vs Açlık</h2>\n<p>Beyin bazen susuzluğu açlıkla karıştırabilir. Su içmek, gereksiz atıştırmaları önleyebilir. Açlık hissettiğinizde önce bir bardak su için ve 10 dakika bekleyin.</p>\n\n<h2>Günde Ne Kadar Su İçmeliyiz?</h2>\n<ul>\n<li><strong>Kadınlar:</strong> 2-2.5 litre</li>\n<li><strong>Erkekler:</strong> 2.5-3 litre</li>\n<li><strong>Egzersiz yapıyorsanız:</strong> +500-1000 ml</li>\n<li><strong>Sıcak havalarda:</strong> +500-1000 ml</li>\n</ul>\n\n<h2>Su İçme İpuçları</h2>\n\n<h3>1. Sabah Kalkar Kalkmaz</h3>\n<p>Uyandığınızda 1-2 bardak su için. Bu metabolizmayı uyandırır.</p>\n\n<h3>2. Her Öğün Öncesi</h3>\n<p>Yemeklerden 30 dakika önce su için.</p>\n\n<h3>3. Hatırlatıcı Kullanın</h3>\n<p>Telefon uygulamaları veya alarm kurun.</p>\n\n<h3>4. Şişe Taşıyın</h3>\n<p>Yanınızda her zaman su şişesi bulundurun.</p>\n\n<h3>5. Lezzet Katın</h3>\n<p>Limon, salatalık veya nane ekleyerek suyu daha lezzetli hale getirin.</p>\n\n<h2>Suyun Diğer Faydaları</h2>\n<ul>\n<li>Cildi nemlendirir ve parlatır</li>\n<li>Toksinleri atar</li>\n<li>Enerji seviyesini artırır</li>\n<li>Baş ağrısını önler</li>\n<li>Sindirim sistemini düzenler</li>\n<li>Böbrek sağlığını korur</li>\n</ul>\n\n<h2>Dikkat Edilmesi Gerekenler</h2>\n<p>Aşırı su tüketimi (günde 4-5 litreden fazla) hiponatremi (kan sodyum seviyesinin düşmesi) riskini artırabilir. Dengeli olun.</p>\n\n<h2>Sonuç</h2>\n<p>Su içmek, kilo verme yolculuğunuzda en basit ama en etkili adımlardan biridir. Bugün su tüketiminizi artırın ve farkı görün!</p>','Su içmenin kilo vermeye bilimsel olarak kanıtlanmış etkileri. Metabolizmayı hızlandırır, tokluk hissi verir.','https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80','Su içen kişi','Su İçmenin Kilo Vermeye Etkisi | Bilimsel Açıklama','Su içmenin kilo vermeye bilimsel olarak kanıtlanmış etkileri. Günde ne kadar su içmelisiniz?','DRAFT',0,NULL,0,2,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfoq0016t7neksypk4ko',NULL,'2025-11-17 13:56:55.722','2025-11-17 18:56:05.314','2025-11-18 17:41:39.000'),('cmi44btpo00021vvnmnnf3nwk','meoacar','mwq','<p>asdasdsadasdasdasasdasdadasdaskjdhfsadfhbsajdfbhsjadfbsadhjfbadsfbhajsbfdahjsbfdashjfbdasjhfbdashjfbdasjhfbasdhjfbdsahjkfbaskhjfbahjksdbfhasjbfshajdbfshajdbfajsdhbfhasdbfawhrefılwaherfıwhfhbwfdasdfdfasdfads</p>','asdasd','data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA1kAAAGuCAYAAABiCcy7AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAKOeSURBVHhe7N13fNT1/Qfw193lsvfeCVlA2FsUHDhQQK11FkW0tY5ar','Zayiflama Plani','asdsadasd','asdasdadadadasd','PUBLISHED',0,NULL,0,1,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfod0012t7ne8ziymnvf','2025-11-18 05:13:47.051','2025-11-18 05:13:47.053','2025-11-18 05:14:35.534','2025-11-18 05:14:35.533'),('cmi456k4f00017lxpyh9tal28','Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberi','dengeli-beslenmenin-altin-cagi-modern-hizda-saglikli-yasam-rehberi','<h1><strong>Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberi</strong></h1><p>Beslenme meselesi, eskiden “yediğin önünde, yemediğin ardında” diye özetlenirdi. Şimdi işler değişti: hız çağına girdik, ekran süresi arttı, öğünler kaydı, uyku bozuldu. Ama bir gerçek hâlâ değişmedi… <strong>Vücudun dürüsttür. Ne verirsen onu alır.</strong></p><p>Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, kendi geleceğini besliyorsun.</p><hr><h2><strong>1. Modern Beslenme Düzeni: Ne Yiyoruz, Neden Yiyoruz?</strong></h2><p>Günümüzde çoğumuz “acıkınca” değil, <em>bildirim gelince</em>, <em>sıkılınca</em>, <em>stres basınca</em> yiyoruz. Fiziksel açlıkla duygusal açlık birbirine karışmış durumda.</p><p><strong>Fiziksel açlık sinyalleri:</strong></p><ul><li><p>Miden hafifçe boş hisseder</p></li><li><p>Enerjin düşer</p></li><li><p>Hafif baş dönmesi olabilir</p></li><li><p>Birçok yiyecekle doyabilirsin</p></li></ul><p><strong>Duygusal açlık sinyalleri:</strong></p><ul><li><p>Ansızın tatlı krizi</p></li><li><p>Sıkıntı, stres, öfke tetiklenmesi</p></li><li><p>Belirli bir yiyeceğe saplanma</p></li><li><p>Yedikten sonra pişmanlık</p></li></ul><p>Vücudu değil, <em>ruh halini doyurursun.</em></p><p>Bu ayrımı anlamak, beslenme düzeninin yarısını çözmek demektir.</p><hr><h2><strong>2. Öğün Düzeni Neden Bu Kadar Önemli?</strong></h2><p>Büyükler “Kahvaltını kral gibi yapacaksın.” derdi. Modern bilim de buna yakın konuşuyor, sadece “kral gibi” kısmının kişiye göre değiştiğini ekliyor.</p><p><strong>Sağlıklı bir öğün düzeni şöyle çalışır:</strong></p><ul><li><p>Sabah protein + kompleks karbonhidrat</p></li><li><p>Öğlen dengeli tabak</p></li><li><p>Akşam hafif, mümkünse sebze ağırlıklı</p></li><li><p>Aralarda gerçek açlık varsa meyve, yoğurt, kuruyemiş</p></li></ul><p>Bu sistemi oturtunca:<br>• Kan şekerin stabil kalır<br>• Gereksiz yeme isteği azalır<br>• Daha az yorulursun<br>• O meşhur “kendime gelemiyorum” hissi azalır</p><hr><h2><strong>3. Altın Tabak Kuralı: Her Öğünde 4 Temel</strong></h2><p>Bu modern çağın “tabağım nasıl olmalı?” sorusuna en net formülü:</p><p><strong>➜ 1 Protein</strong> (yumurta, tavuk, balık, yoğurt, baklagil)<br><strong>➜ 1 Kaliteli Karbonhidrat</strong> (yulaf, bulgur, tam tahıl, sebze)<br><strong>➜ 1 Yağ Kaynağı</strong> (zeytinyağı, avokado, ceviz)<br><strong>➜ 1 Lif/Sebze</strong> (yeşillik, brokoli, salata)</p><p>Bunu kuran zaten %60 düzene giriyor.</p><hr><h2><strong>4. Metabolizma: Hızlandırılabilir mi, Yoksa Biz Yalan mı Söyledik?</strong></h2><p>Metabolizma hızlandırmak sihir değil. Üç şeyle ciddi fark ediyor:</p><ol><li><p><strong>Kas kütlesi artırmak</strong> → Kas, yağdan daha çok kalori harcar.</p></li><li><p><strong>Uyku</strong> → 6 saat uyuyan birinin açlık hormonları %30 daha aktif.</p></li><li><p><strong>Yeterli su</strong> → Susuz beden, metabolizmayı frene basar.</p></li></ol><p>En eski kural en doğrusu: <em>Vücut fabrika gibi çalışır. Yakıt, su ve bakım ister.</em></p><hr><h2><strong>5. Tatlı Krizleri Nerden Çıkıyor?</strong></h2><p>Sen tatlı istemiyorsun aslında.<br>Vücudun <em>ani enerji</em> istiyor.</p><p>Tatlı krizi genellikle şunlardan olur:</p><ul><li><p>Düşük proteinli öğün</p></li><li><p>Uykusuzluk</p></li><li><p>Stres hormonu yüksekliği</p></li><li><p>Gün içinde uzun süre aç kalmak</p></li><li><p>Yetersiz su tüketimi</p></li></ul><p>Tatlıyı kesmek yerine sistemi onarmak daha mantıklı.</p><hr><h2><strong>6. “Temiz Beslenme” Nedir, Nasıl Uygulanır?</strong></h2><p>Temiz beslenme şu değil:<br>✘ “Glüten yemeyeceğim.”<br>✘ “Her şey organik olacak.”<br>✘ “Ekmeği tamamen sileceğim.”</p><p>Temiz beslenme şu:<br>✔ Etiketi sade ürünler<br>✔ Şekeri minimumda tutmak<br>✔ Yağ–proteini dengelemek<br>✔ Yarım değil <em>tam</em> gıda tüketmek<br>✔ Fast food’u nadir yapmak</p><p>Bir anlamda: <strong>Ninenin tanımadığı şeyi çok sık yeme.</strong></p><hr><h2><strong>7. Günlük Hayatta Uygulanabilir Mini Plan</strong></h2><p>Sabah → 1 bardak su + proteinli kahvaltı<br>Öğlen → Tabağın yarısı sebze, çeyreği protein, çeyreği karbonhidrat<br>Akşam → Hafif/Yağsız yemek<br>Ara → Meyve, yoğurt, ceviz<br>Günde → 2–2.5 litre su, 30–40 dakika hareket</p><p>Bu kadar basit bir düzen bile birkaç haftada vücudun matematiğini değiştirir.</p><hr><h2><strong>8. Son Söz: Beslenme Bir Maraton, Sprint Değil</strong></h2><p>Kimse her günü mükemmel geçirmiyor.<br>Bazen kaçamak olur, bazen geç yatarsın, bazen öğün kayar.</p><p>Önemli olan <strong>ortalama</strong>.<br>Günün değil, sistemin doğru olsun.</p><p>Uzun ömürlülük çalışmalarında da görüldü:<br>Düzenli uyku + dengeli tabak + düzenli hareket = daha genç bağışıklık, daha sağlam zihin.</p><p>Kısacası:</p><p><strong>Vücuduna yatırım yaparsan, vücudun seni yarı yolda bırakmaz.</strong></p>','Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, kendi geleceğini besliyorsun.','https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80',NULL,'Dengeli Beslenme Rehberi: Sağlıklı Yaşam İçin İpuçları','asdasdasdsasadsad','PUBLISHED',0,NULL,0,3,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfod0012t7ne8ziymnvf','2025-11-18 05:37:40.958','2025-11-18 05:37:40.960','2025-11-18 05:43:14.570','2025-11-18 05:43:14.569'),('cmi45b8et00037lxpyo5bl15o','Deneme','deneme','<h1><strong>Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberi</strong></h1><p>Beslenme meselesi, eskiden “yediğin önünde, yemediğin ardında” diye özetlenirdi. Şimdi işler değişti: hız çağına girdik, ekran süresi arttı, öğünler kaydı, uyku bozuldu. Ama bir gerçek hâlâ değişmedi… <strong>Vücudun dürüsttür. Ne verirsen onu alır.</strong></p><p>Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, kendi geleceğini besliyorsun.</p><hr><h2><strong>1. Modern Beslenme Düzeni: Ne Yiyoruz, Neden Yiyoruz?</strong></h2><p>Günümüzde çoğumuz “acıkınca” değil, <em>bildirim gelince</em>, <em>sıkılınca</em>, <em>stres basınca</em> yiyoruz. Fiziksel açlıkla duygusal açlık birbirine karışmış durumda.</p><p><strong>Fiziksel açlık sinyalleri:</strong></p><ul><li><p>Miden hafifçe boş hisseder</p></li><li><p>Enerjin düşer</p></li><li><p>Hafif baş dönmesi olabilir</p></li><li><p>Birçok yiyecekle doyabilirsin</p></li></ul><p><strong>Duygusal açlık sinyalleri:</strong></p><ul><li><p>Ansızın tatlı krizi</p></li><li><p>Sıkıntı, stres, öfke tetiklenmesi</p></li><li><p>Belirli bir yiyeceğe saplanma</p></li><li><p>Yedikten sonra pişmanlık</p></li></ul><p>Vücudu değil, <em>ruh halini doyurursun.</em></p><p>Bu ayrımı anlamak, beslenme düzeninin yarısını çözmek demektir.</p><hr><h2><strong>2. Öğün Düzeni Neden Bu Kadar Önemli?</strong></h2><p>Büyükler “Kahvaltını kral gibi yapacaksın.” derdi. Modern bilim de buna yakın konuşuyor, sadece “kral gibi” kısmının kişiye göre değiştiğini ekliyor.</p><p><strong>Sağlıklı bir öğün düzeni şöyle çalışır:</strong></p><ul><li><p>Sabah protein + kompleks karbonhidrat</p></li><li><p>Öğlen dengeli tabak</p></li><li><p>Akşam hafif, mümkünse sebze ağırlıklı</p></li><li><p>Aralarda gerçek açlık varsa meyve, yoğurt, kuruyemiş</p></li></ul><p>Bu sistemi oturtunca:<br>• Kan şekerin stabil kalır<br>• Gereksiz yeme isteği azalır<br>• Daha az yorulursun<br>• O meşhur “kendime gelemiyorum” hissi azalır</p><hr><h2><strong>3. Altın Tabak Kuralı: Her Öğünde 4 Temel</strong></h2><p>Bu modern çağın “tabağım nasıl olmalı?” sorusuna en net formülü:</p><p><strong>➜ 1 Protein</strong> (yumurta, tavuk, balık, yoğurt, baklagil)<br><strong>➜ 1 Kaliteli Karbonhidrat</strong> (yulaf, bulgur, tam tahıl, sebze)<br><strong>➜ 1 Yağ Kaynağı</strong> (zeytinyağı, avokado, ceviz)<br><strong>➜ 1 Lif/Sebze</strong> (yeşillik, brokoli, salata)</p><p>Bunu kuran zaten %60 düzene giriyor.</p><hr><h2><strong>4. Metabolizma: Hızlandırılabilir mi, Yoksa Biz Yalan mı Söyledik?</strong></h2><p>Metabolizma hızlandırmak sihir değil. Üç şeyle ciddi fark ediyor:</p><ol><li><p><strong>Kas kütlesi artırmak</strong> → Kas, yağdan daha çok kalori harcar.</p></li><li><p><strong>Uyku</strong> → 6 saat uyuyan birinin açlık hormonları %30 daha aktif.</p></li><li><p><strong>Yeterli su</strong> → Susuz beden, metabolizmayı frene basar.</p></li></ol><p>En eski kural en doğrusu: <em>Vücut fabrika gibi çalışır. Yakıt, su ve bakım ister.</em></p><hr><h2><strong>5. Tatlı Krizleri Nerden Çıkıyor?</strong></h2><p>Sen tatlı istemiyorsun aslında.<br>Vücudun <em>ani enerji</em> istiyor.</p><p>Tatlı krizi genellikle şunlardan olur:</p><ul><li><p>Düşük proteinli öğün</p></li><li><p>Uykusuzluk</p></li><li><p>Stres hormonu yüksekliği</p></li><li><p>Gün içinde uzun süre aç kalmak</p></li><li><p>Yetersiz su tüketimi</p></li></ul><p>Tatlıyı kesmek yerine sistemi onarmak daha mantıklı.</p><hr><h2><strong>6. “Temiz Beslenme” Nedir, Nasıl Uygulanır?</strong></h2><p>Temiz beslenme şu değil:<br>✘ “Glüten yemeyeceğim.”<br>✘ “Her şey organik olacak.”<br>✘ “Ekmeği tamamen sileceğim.”</p><p>Temiz beslenme şu:<br>✔ Etiketi sade ürünler<br>✔ Şekeri minimumda tutmak<br>✔ Yağ–proteini dengelemek<br>✔ Yarım değil <em>tam</em> gıda tüketmek<br>✔ Fast food’u nadir yapmak</p><p>Bir anlamda: <strong>Ninenin tanımadığı şeyi çok sık yeme.</strong></p><hr><h2><strong>7. Günlük Hayatta Uygulanabilir Mini Plan</strong></h2><p>Sabah → 1 bardak su + proteinli kahvaltı<br>Öğlen → Tabağın yarısı sebze, çeyreği protein, çeyreği karbonhidrat<br>Akşam → Hafif/Yağsız yemek<br>Ara → Meyve, yoğurt, ceviz<br>Günde → 2–2.5 litre su, 30–40 dakika hareket</p><p>Bu kadar basit bir düzen bile birkaç haftada vücudun matematiğini değiştirir.</p><hr><h2><strong>8. Son Söz: Beslenme Bir Maraton, Sprint Değil</strong></h2><p>Kimse her günü mükemmel geçirmiyor.<br>Bazen kaçamak olur, bazen geç yatarsın, bazen öğün kayar.</p><p>Önemli olan <strong>ortalama</strong>.<br>Günün değil, sistemin doğru olsun.</p><p>Uzun ömürlülük çalışmalarında da görüldü:<br>Düzenli uyku + dengeli tabak + düzenli hareket = daha genç bağışıklık, daha sağlam zihin.</p><p>Kısacası:</p><p><strong>Vücuduna yatırım yaparsan, vücudun seni yarı yolda bırakmaz.</strong></p>','deneme',NULL,NULL,'Deneme','deneme','PUBLISHED',0,NULL,0,3,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfod0012t7ne8ziymnvf','2025-11-18 05:41:19.061','2025-11-18 05:41:19.062','2025-11-18 05:43:18.104','2025-11-18 05:43:18.103'),('cmi45ey8900057lxpvj7ac46k','Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberis','dengeli-beslenmenin-altin-cagi-modern-hizda-saglikli-yasam-rehberis','<h1><strong>Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberi</strong></h1><p>Beslenme meselesi, eskiden “yediğin önünde, yemediğin ardında” diye özetlenirdi. Şimdi işler değişti: hız çağına girdik, ekran süresi arttı, öğünler kaydı, uyku bozuldu. Ama bir gerçek hâlâ değişmedi… <strong>Vücudun dürüsttür. Ne verirsen onu alır.</strong></p><p>Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, kendi geleceğini besliyorsun.</p><hr><h2><strong>1. Modern Beslenme Düzeni: Ne Yiyoruz, Neden Yiyoruz?</strong></h2><p>Günümüzde çoğumuz “acıkınca” değil, <em>bildirim gelince</em>, <em>sıkılınca</em>, <em>stres basınca</em> yiyoruz. Fiziksel açlıkla duygusal açlık birbirine karışmış durumda.</p><p><strong>Fiziksel açlık sinyalleri:</strong></p><ul><li><p>Miden hafifçe boş hisseder</p></li><li><p>Enerjin düşer</p></li><li><p>Hafif baş dönmesi olabilir</p></li><li><p>Birçok yiyecekle doyabilirsin</p></li></ul><p><strong>Duygusal açlık sinyalleri:</strong></p><ul><li><p>Ansızın tatlı krizi</p></li><li><p>Sıkıntı, stres, öfke tetiklenmesi</p></li><li><p>Belirli bir yiyeceğe saplanma</p></li><li><p>Yedikten sonra pişmanlık</p></li></ul><p>Vücudu değil, <em>ruh halini doyurursun.</em></p><p>Bu ayrımı anlamak, beslenme düzeninin yarısını çözmek demektir.</p><hr><h2><strong>2. Öğün Düzeni Neden Bu Kadar Önemli?</strong></h2><p>Büyükler “Kahvaltını kral gibi yapacaksın.” derdi. Modern bilim de buna yakın konuşuyor, sadece “kral gibi” kısmının kişiye göre değiştiğini ekliyor.</p><p><strong>Sağlıklı bir öğün düzeni şöyle çalışır:</strong></p><ul><li><p>Sabah protein + kompleks karbonhidrat</p></li><li><p>Öğlen dengeli tabak</p></li><li><p>Akşam hafif, mümkünse sebze ağırlıklı</p></li><li><p>Aralarda gerçek açlık varsa meyve, yoğurt, kuruyemiş</p></li></ul><p>Bu sistemi oturtunca:<br>• Kan şekerin stabil kalır<br>• Gereksiz yeme isteği azalır<br>• Daha az yorulursun<br>• O meşhur “kendime gelemiyorum” hissi azalır</p><hr><h2><strong>3. Altın Tabak Kuralı: Her Öğünde 4 Temel</strong></h2><p>Bu modern çağın “tabağım nasıl olmalı?” sorusuna en net formülü:</p><p><strong>➜ 1 Protein</strong> (yumurta, tavuk, balık, yoğurt, baklagil)<br><strong>➜ 1 Kaliteli Karbonhidrat</strong> (yulaf, bulgur, tam tahıl, sebze)<br><strong>➜ 1 Yağ Kaynağı</strong> (zeytinyağı, avokado, ceviz)<br><strong>➜ 1 Lif/Sebze</strong> (yeşillik, brokoli, salata)</p><p>Bunu kuran zaten %60 düzene giriyor.</p><hr><h2><strong>4. Metabolizma: Hızlandırılabilir mi, Yoksa Biz Yalan mı Söyledik?</strong></h2><p>Metabolizma hızlandırmak sihir değil. Üç şeyle ciddi fark ediyor:</p><ol><li><p><strong>Kas kütlesi artırmak</strong> → Kas, yağdan daha çok kalori harcar.</p></li><li><p><strong>Uyku</strong> → 6 saat uyuyan birinin açlık hormonları %30 daha aktif.</p></li><li><p><strong>Yeterli su</strong> → Susuz beden, metabolizmayı frene basar.</p></li></ol><p>En eski kural en doğrusu: <em>Vücut fabrika gibi çalışır. Yakıt, su ve bakım ister.</em></p><hr><h2><strong>5. Tatlı Krizleri Nerden Çıkıyor?</strong></h2><p>Sen tatlı istemiyorsun aslında.<br>Vücudun <em>ani enerji</em> istiyor.</p><p>Tatlı krizi genellikle şunlardan olur:</p><ul><li><p>Düşük proteinli öğün</p></li><li><p>Uykusuzluk</p></li><li><p>Stres hormonu yüksekliği</p></li><li><p>Gün içinde uzun süre aç kalmak</p></li><li><p>Yetersiz su tüketimi</p></li></ul><p>Tatlıyı kesmek yerine sistemi onarmak daha mantıklı.</p><hr><h2><strong>6. “Temiz Beslenme” Nedir, Nasıl Uygulanır?</strong></h2><p>Temiz beslenme şu değil:<br>✘ “Glüten yemeyeceğim.”<br>✘ “Her şey organik olacak.”<br>✘ “Ekmeği tamamen sileceğim.”</p><p>Temiz beslenme şu:<br>✔ Etiketi sade ürünler<br>✔ Şekeri minimumda tutmak<br>✔ Yağ–proteini dengelemek<br>✔ Yarım değil <em>tam</em> gıda tüketmek<br>✔ Fast food’u nadir yapmak</p><p>Bir anlamda: <strong>Ninenin tanımadığı şeyi çok sık yeme.</strong></p><hr><h2><strong>7. Günlük Hayatta Uygulanabilir Mini Plan</strong></h2><p>Sabah → 1 bardak su + proteinli kahvaltı<br>Öğlen → Tabağın yarısı sebze, çeyreği protein, çeyreği karbonhidrat<br>Akşam → Hafif/Yağsız yemek<br>Ara → Meyve, yoğurt, ceviz<br>Günde → 2–2.5 litre su, 30–40 dakika hareket</p><p>Bu kadar basit bir düzen bile birkaç haftada vücudun matematiğini değiştirir.</p><hr><h2><strong>8. Son Söz: Beslenme Bir Maraton, Sprint Değil</strong></h2><p>Kimse her günü mükemmel geçirmiyor.<br>Bazen kaçamak olur, bazen geç yatarsın, bazen öğün kayar.</p><p>Önemli olan <strong>ortalama</strong>.<br>Günün değil, sistemin doğru olsun.</p><p>Uzun ömürlülük çalışmalarında da görüldü:<br>Düzenli uyku + dengeli tabak + düzenli hareket = daha genç bağışıklık, daha sağlam zihin.</p><p>Kısacası:</p><p><strong>Vücuduna yatırım yaparsan, vücudun seni yarı yolda bırakmaz.</strong></p>','Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, kendi geleceğini besliyorsun.',NULL,NULL,'Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberis','Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, ke','PUBLISHED',0,NULL,0,3,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfod0012t7ne8ziymnvf','2025-11-18 05:44:12.489','2025-11-18 05:44:12.490','2025-11-18 05:45:11.644','2025-11-18 05:45:11.643'),('cmi45m97h000d7lxpzwklxe9f','Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberi','dengeli-beslenmenin-altin-cagi-modern-hizda-saglikli-yasam-rehberiid','<p>Beslenme meselesi, eskiden “yediğin önünde, yemediğin ardında” diye özetlenirdi. Şimdi işler değişti: hız çağına girdik, ekran süresi arttı, öğünler kaydı, uyku bozuldu. Ama bir gerçek hâlâ değişmedi… <strong>Vücudun dürüsttür. Ne verirsen onu alır.</strong></p><p>Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, kendi geleceğini besliyorsun.</p><hr><h2><strong>1. Modern Beslenme Düzeni: Ne Yiyoruz, Neden Yiyoruz?</strong></h2><p>Günümüzde çoğumuz “acıkınca” değil, <em>bildirim gelince</em>, <em>sıkılınca</em>, <em>stres basınca</em> yiyoruz. Fiziksel açlıkla duygusal açlık birbirine karışmış durumda.</p><p><strong>Fiziksel açlık sinyalleri:</strong></p><ul><li><p>Miden hafifçe boş hisseder</p></li><li><p>Enerjin düşer</p></li><li><p>Hafif baş dönmesi olabilir</p></li><li><p>Birçok yiyecekle doyabilirsin</p></li></ul><p><strong>Duygusal açlık sinyalleri:</strong></p><ul><li><p>Ansızın tatlı krizi</p></li><li><p>Sıkıntı, stres, öfke tetiklenmesi</p></li><li><p>Belirli bir yiyeceğe saplanma</p></li><li><p>Yedikten sonra pişmanlık</p></li></ul><p>Vücudu değil, <em>ruh halini doyurursun.</em></p><p>Bu ayrımı anlamak, beslenme düzeninin yarısını çözmek demektir.</p><hr><h2><strong>2. Öğün Düzeni Neden Bu Kadar Önemli?</strong></h2><p>Büyükler “Kahvaltını kral gibi yapacaksın.” derdi. Modern bilim de buna yakın konuşuyor, sadece “kral gibi” kısmının kişiye göre değiştiğini ekliyor.</p><p><strong>Sağlıklı bir öğün düzeni şöyle çalışır:</strong></p><ul><li><p>Sabah protein + kompleks karbonhidrat</p></li><li><p>Öğlen dengeli tabak</p></li><li><p>Akşam hafif, mümkünse sebze ağırlıklı</p></li><li><p>Aralarda gerçek açlık varsa meyve, yoğurt, kuruyemiş</p></li></ul><p>Bu sistemi oturtunca:<br>• Kan şekerin stabil kalır<br>• Gereksiz yeme isteği azalır<br>• Daha az yorulursun<br>• O meşhur “kendime gelemiyorum” hissi azalır</p><hr><h2><strong>3. Altın Tabak Kuralı: Her Öğünde 4 Temel</strong></h2><p>Bu modern çağın “tabağım nasıl olmalı?” sorusuna en net formülü:</p><p><strong>➜ 1 Protein</strong> (yumurta, tavuk, balık, yoğurt, baklagil)<br><strong>➜ 1 Kaliteli Karbonhidrat</strong> (yulaf, bulgur, tam tahıl, sebze)<br><strong>➜ 1 Yağ Kaynağı</strong> (zeytinyağı, avokado, ceviz)<br><strong>➜ 1 Lif/Sebze</strong> (yeşillik, brokoli, salata)</p><p>Bunu kuran zaten %60 düzene giriyor.</p><hr><h2><strong>4. Metabolizma: Hızlandırılabilir mi, Yoksa Biz Yalan mı Söyledik?</strong></h2><p>Metabolizma hızlandırmak sihir değil. Üç şeyle ciddi fark ediyor:</p><ol><li><p><strong>Kas kütlesi artırmak</strong> → Kas, yağdan daha çok kalori harcar.</p></li><li><p><strong>Uyku</strong> → 6 saat uyuyan birinin açlık hormonları %30 daha aktif.</p></li><li><p><strong>Yeterli su</strong> → Susuz beden, metabolizmayı frene basar.</p></li></ol><p>En eski kural en doğrusu: <em>Vücut fabrika gibi çalışır. Yakıt, su ve bakım ister.</em></p><hr><h2><strong>5. Tatlı Krizleri Nerden Çıkıyor?</strong></h2><p>Sen tatlı istemiyorsun aslında.<br>Vücudun <em>ani enerji</em> istiyor.</p><p>Tatlı krizi genellikle şunlardan olur:</p><ul><li><p>Düşük proteinli öğün</p></li><li><p>Uykusuzluk</p></li><li><p>Stres hormonu yüksekliği</p></li><li><p>Gün içinde uzun süre aç kalmak</p></li><li><p>Yetersiz su tüketimi</p></li></ul><p>Tatlıyı kesmek yerine sistemi onarmak daha mantıklı.</p><hr><h2><strong>6. “Temiz Beslenme” Nedir, Nasıl Uygulanır?</strong></h2><p>Temiz beslenme şu değil:<br>✘ “Glüten yemeyeceğim.”<br>✘ “Her şey organik olacak.”<br>✘ “Ekmeği tamamen sileceğim.”</p><p>Temiz beslenme şu:<br>✔ Etiketi sade ürünler<br>✔ Şekeri minimumda tutmak<br>✔ Yağ–proteini dengelemek<br>✔ Yarım değil <em>tam</em> gıda tüketmek<br>✔ Fast food’u nadir yapmak</p><p>Bir anlamda: <strong>Ninenin tanımadığı şeyi çok sık yeme.</strong></p><hr><h2><strong>7. Günlük Hayatta Uygulanabilir Mini Plan</strong></h2><p>Sabah → 1 bardak su + proteinli kahvaltı<br>Öğlen → Tabağın yarısı sebze, çeyreği protein, çeyreği karbonhidrat<br>Akşam → Hafif/Yağsız yemek<br>Ara → Meyve, yoğurt, ceviz<br>Günde → 2–2.5 litre su, 30–40 dakika hareket</p><p>Bu kadar basit bir düzen bile birkaç haftada vücudun matematiğini değiştirir.</p><hr><h2><strong>8. Son Söz: Beslenme Bir Maraton, Sprint Değil</strong></h2><p>Kimse her günü mükemmel geçirmiyor.<br>Bazen kaçamak olur, bazen geç yatarsın, bazen öğün kayar.</p><p>Önemli olan <strong>ortalama</strong>.<br>Günün değil, sistemin doğru olsun.</p><p>Uzun ömürlülük çalışmalarında da görüldü:<br>Düzenli uyku + dengeli tabak + düzenli hareket = daha genç bağışıklık, daha sağlam zihin.</p><p>Kısacası:</p><p><strong>Vücuduna yatırım yaparsan, vücudun seni yarı yolda bırakmaz.</strong></p>','Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, kendi geleceğini besliyorsun.','https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200',NULL,'Dengeli Beslenmenin Altın Çağı: Modern Hızda Sağlıklı Yaşam Rehberi','Beslenme, sadece “kilo almak/vermeye” indirgenecek kadar basit değil. Enerjini, motivasyonunu, sinir sistemini, hatta ruh halini bile yönetiyor. Bir anlamda, ke','PUBLISHED',0,NULL,0,3,'cmhxnqibq0000n3zb1nyhdaso','cmi37dfod0012t7ne8ziymnvf','2025-11-18 05:49:53.309','2025-11-18 05:49:53.310','2025-11-18 06:18:05.361',NULL);
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_tags`
--

DROP TABLE IF EXISTS `blog_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_tags` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_tags_name_key` (`name`),
  UNIQUE KEY `blog_tags_slug_key` (`slug`),
  KEY `blog_tags_slug_idx` (`slug`),
  KEY `blog_tags_name_idx` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_tags`
--

LOCK TABLES `blog_tags` WRITE;
/*!40000 ALTER TABLE `blog_tags` DISABLE KEYS */;
INSERT INTO `blog_tags` VALUES ('cmi37obam001mmy6ri6nouh14','Kilo Verme','kilo-verme','2025-11-17 13:59:42.382'),('cmi37obap001nmy6rw04j584l','Protein','protein','2025-11-17 13:59:42.385'),('cmi37obaq001omy6r2efzc21s','Kalori','kalori','2025-11-17 13:59:42.387'),('cmi37obav001pmy6r6zf58o2g','Egzersiz','egzersiz','2025-11-17 13:59:42.392'),('cmi37obax001qmy6r7slzidhr','HIIT','hiit','2025-11-17 13:59:42.394'),('cmi37obb0001rmy6rqi3q4a6u','Kardiyo','kardiyo','2025-11-17 13:59:42.396'),('cmi37obb2001smy6rq9qptitk','Kuvvet Antrenmanı','kuvvet-antrenman','2025-11-17 13:59:42.398'),('cmi37obb4001tmy6r9vn3ylg9','Motivasyon','motivasyon','2025-11-17 13:59:42.400'),('cmi37obb6001umy6rhoerzxwr','Başarı Hikayesi','basari-hikayesi','2025-11-17 13:59:42.402'),('cmi37obb8001vmy6ry615jheh','Sağlıklı Beslenme','saglikli-beslenme','2025-11-17 13:59:42.404'),('cmi37obba001wmy6r70saa9az','Tarif','tarif','2025-11-17 13:59:42.406'),('cmi37obbc001xmy6r1wp09x7b','Kahvaltı','kahvalti','2025-11-17 13:59:42.408'),('cmi37obbe001ymy6r7ut56yva','Yüksek Protein','yuksek-protein','2025-11-17 13:59:42.410'),('cmi37obbf001zmy6rxogpdkk9','Düşük Kalori','dusuk-kalori','2025-11-17 13:59:42.412'),('cmi37obbh0020my6rn9jstpgn','Su İçmek','su-icmek','2025-11-17 13:59:42.414'),('cmi37obbj0021my6rnzr4oogg','Metabolizma','metabolizma','2025-11-17 13:59:42.416'),('cmi37obbl0022my6rlnyc3mda','Sağlık','saglik','2025-11-17 13:59:42.417'),('cmi37obbn0023my6ri6534ile','Diyet','diyet','2025-11-17 13:59:42.419'),('cmi37obbp0024my6r05g1ldop','Fitness','fitness','2025-11-17 13:59:42.421'),('cmi37obbq0025my6rw8ukzluw','Yaşam Tarzı','yasam-tarzi','2025-11-17 13:59:42.423'),('cmi37obbs0026my6r8b38p44h','İpuçları','ipuclari','2025-11-17 13:59:42.425'),('cmi37obbu0027my6rlh2knxvo','Beslenme','beslenme','2025-11-17 13:59:42.427'),('cmi37obbw0028my6rdhfzvagx','Antrenman','antrenman','2025-11-17 13:59:42.429'),('cmi37obby0029my6rze2u4lhr','Evde Egzersiz','evde-egzersiz','2025-11-17 13:59:42.430'),('cmi37obc0002amy6rtbq5bb9p','Yağ Yakma','yag-yakma','2025-11-17 13:59:42.432');
/*!40000 ALTER TABLE `blog_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `check_in_history`
--

DROP TABLE IF EXISTS `check_in_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `check_in_history` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `checkInAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `check_in_history_userId_checkInAt_idx` (`userId`,`checkInAt`),
  CONSTRAINT `check_in_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `check_in_history`
--

LOCK TABLES `check_in_history` WRITE;
/*!40000 ALTER TABLE `check_in_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `check_in_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cohort_definitions`
--

DROP TABLE IF EXISTS `cohort_definitions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cohort_definitions` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `filters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`filters`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdBy` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cohort_definitions_isActive_createdAt_idx` (`isActive`,`createdAt`),
  KEY `cohort_definitions_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cohort_definitions`
--

LOCK TABLES `cohort_definitions` WRITE;
/*!40000 ALTER TABLE `cohort_definitions` DISABLE KEYS */;
INSERT INTO `cohort_definitions` VALUES ('cmi1rcr0200006hg568y3kh5o','Test Cohort','İlk test cohort','{\"xp\":{\"gte\":100},\"level\":{\"gte\":1}}',1,'cmhxnqibq0000n3zb1nyhdaso','2025-11-16 13:35:02.835','2025-11-16 13:35:02.835');
/*!40000 ALTER TABLE `cohort_definitions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coin_transactions`
--

DROP TABLE IF EXISTS `coin_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coin_transactions` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `amount` int(11) NOT NULL,
  `type` enum('quest_reward','badge_reward','purchase','referral_bonus','streak_recovery','admin_grant','level_up','guild_reward','league_promotion') NOT NULL,
  `description` varchar(191) NOT NULL,
  `metadata` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `coin_transactions_userId_createdAt_idx` (`userId`,`createdAt`),
  KEY `coin_transactions_type_idx` (`type`),
  CONSTRAINT `coin_transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coin_transactions`
--

LOCK TABLES `coin_transactions` WRITE;
/*!40000 ALTER TABLE `coin_transactions` DISABLE KEYS */;
INSERT INTO `coin_transactions` VALUES ('cmi2d4q9e0048knwpld9otydf','cmhxnqibq0000n3zb1nyhdaso',5,'quest_reward','Görev tamamlandı: Su İç',NULL,'2025-11-16 23:44:40.179'),('cmi2d62rw004qknwp0xih3p1l','cmhxnqibq0000n3zb1nyhdaso',5,'quest_reward','Görev tamamlandı: Su İç',NULL,'2025-11-16 23:45:43.052'),('cmi2gqg740001x23kzhfa1a80','cmhxnqieu0001n3zbnqndm9rn',100,'league_promotion','Platin Ligi\'e yükseldin! 🎉',NULL,'2025-11-17 01:25:32.416'),('cmi636upd0003qxi1t5an6vre','cmhxnqibq0000n3zb1nyhdaso',5,'quest_reward','Görev tamamlandı: Günlük Check-in',NULL,'2025-11-19 14:17:27.792');
/*!40000 ALTER TABLE `coin_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `targetType` enum('plan','photo') NOT NULL,
  `targetId` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `status` enum('pending','visible','hidden') NOT NULL DEFAULT 'visible',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_targetType_targetId_createdAt_idx` (`targetType`,`targetId`,`createdAt`),
  KEY `comments_authorId_idx` (`authorId`),
  KEY `comments_status_createdAt_idx` (`status`,`createdAt`),
  KEY `comments_targetId_fkey` (`targetId`),
  CONSTRAINT `comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES ('cmi2bs8cn000gknwp3hjvo8p5','cmhxnqibq0000n3zb1nyhdaso','plan','cmhy5ojq5000tnyxl6wixgpvn','Çok güzel diyet listesi yapmışsın.','visible','2025-11-16 23:06:57.480','2025-11-16 23:07:00.728'),('cmi2cgzrl002cknwpg1pknxo6','cmhy68hs50000g0xkj2slheo4','plan','cmhy5ojq5000tnyxl6wixgpvn','tebrik ederim seni.','visible','2025-11-16 23:26:12.753','2025-11-16 23:26:19.692');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `confession_empathies`
--

DROP TABLE IF EXISTS `confession_empathies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `confession_empathies` (
  `id` varchar(191) NOT NULL,
  `confessionId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `confession_empathies_confessionId_userId_key` (`confessionId`,`userId`),
  KEY `confession_empathies_userId_createdAt_idx` (`userId`,`createdAt`),
  KEY `confession_empathies_confessionId_idx` (`confessionId`),
  CONSTRAINT `confession_empathies_confessionId_fkey` FOREIGN KEY (`confessionId`) REFERENCES `confessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `confession_empathies_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `confession_empathies`
--

LOCK TABLES `confession_empathies` WRITE;
/*!40000 ALTER TABLE `confession_empathies` DISABLE KEYS */;
/*!40000 ALTER TABLE `confession_empathies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `confession_reports`
--

DROP TABLE IF EXISTS `confession_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `confession_reports` (
  `id` varchar(191) NOT NULL,
  `confessionId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `reason` text NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `confession_reports_confessionId_userId_key` (`confessionId`,`userId`),
  KEY `confession_reports_confessionId_createdAt_idx` (`confessionId`,`createdAt`),
  KEY `confession_reports_userId_fkey` (`userId`),
  CONSTRAINT `confession_reports_confessionId_fkey` FOREIGN KEY (`confessionId`) REFERENCES `confessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `confession_reports_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `confession_reports`
--

LOCK TABLES `confession_reports` WRITE;
/*!40000 ALTER TABLE `confession_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `confession_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `confessions`
--

DROP TABLE IF EXISTS `confessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `confessions` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `category` enum('night_attack','special_occasion','stress_eating','social_pressure','no_regrets','seasonal') NOT NULL,
  `aiResponse` text DEFAULT NULL,
  `aiTone` enum('empathetic','humorous','motivational','realistic') DEFAULT NULL,
  `telafiBudget` text DEFAULT NULL,
  `empathyCount` int(11) NOT NULL DEFAULT 0,
  `status` enum('pending','published','rejected','hidden') NOT NULL DEFAULT 'pending',
  `rejectionReason` text DEFAULT NULL,
  `isPopular` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `confessions_userId_createdAt_idx` (`userId`,`createdAt`),
  KEY `confessions_status_createdAt_idx` (`status`,`createdAt`),
  KEY `confessions_category_publishedAt_idx` (`category`,`publishedAt`),
  KEY `confessions_isPopular_empathyCount_idx` (`isPopular`,`empathyCount`),
  CONSTRAINT `confessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `confessions`
--

LOCK TABLES `confessions` WRITE;
/*!40000 ALTER TABLE `confessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `confessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contact_messages` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `subject` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','responded','archived','spam') NOT NULL DEFAULT 'new',
  `response` text DEFAULT NULL,
  `respondedBy` varchar(191) DEFAULT NULL,
  `respondedAt` datetime(3) DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `userAgent` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contact_messages_status_createdAt_idx` (`status`,`createdAt`),
  KEY `contact_messages_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES ('cmi1zsdt40000dfqhxpsdoj25','Mehmet ACAR','meofeat@gmail.com','selamlar','selamlarrr','responded','buyurun efendim...','cmhxnqibq0000n3zb1nyhdaso','2025-11-16 17:31:53.029','::1','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36','2025-11-16 17:31:09.160','2025-11-16 17:31:53.030');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_appeals`
--

DROP TABLE IF EXISTS `content_appeals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content_appeals` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `contentType` enum('plan','recipe','comment','recipe_comment','group_post') NOT NULL,
  `contentId` varchar(191) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','under_review','approved','rejected') NOT NULL DEFAULT 'pending',
  `priority` int(11) NOT NULL DEFAULT 0,
  `adminNote` text DEFAULT NULL,
  `resolvedBy` varchar(191) DEFAULT NULL,
  `resolvedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `content_appeals_userId_createdAt_idx` (`userId`,`createdAt`),
  KEY `content_appeals_status_priority_idx` (`status`,`priority`),
  KEY `content_appeals_contentType_contentId_idx` (`contentType`,`contentId`),
  KEY `content_appeals_createdAt_idx` (`createdAt`),
  KEY `content_appeals_resolvedBy_fkey` (`resolvedBy`),
  CONSTRAINT `content_appeals_resolvedBy_fkey` FOREIGN KEY (`resolvedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `content_appeals_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_appeals`
--

LOCK TABLES `content_appeals` WRITE;
/*!40000 ALTER TABLE `content_appeals` DISABLE KEYS */;
INSERT INTO `content_appeals` VALUES ('cmi0m2pku00039u3cradwmvx0','cmhxnqibq0000n3zb1nyhdaso','plan','cmi0lc3p100019u3cu1ji0lwk','deneme yapıyoruz hocam','approved',0,'İtirazınız onaylandı. İyi Günler.','cmhxnqibq0000n3zb1nyhdaso','2025-11-15 18:58:54.439','2025-11-15 18:19:30.175','2025-11-15 18:58:54.441');
/*!40000 ALTER TABLE `content_appeals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conversations` (
  `id` varchar(191) NOT NULL,
  `lastMessageAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conversations_lastMessageAt_idx` (`lastMessageAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES ('cmhyxbfcu0002u207r83pctzc','2025-11-15 21:04:55.011','2025-11-14 13:58:40.254','2025-11-15 21:04:55.011');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_quests`
--

DROP TABLE IF EXISTS `daily_quests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `daily_quests` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(191) NOT NULL,
  `xpReward` int(11) NOT NULL DEFAULT 10,
  `coinReward` int(11) NOT NULL DEFAULT 5,
  `type` enum('daily','weekly','special') NOT NULL DEFAULT 'daily',
  `target` int(11) NOT NULL DEFAULT 1,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `daily_quests_key_key` (`key`),
  KEY `daily_quests_type_idx` (`type`),
  KEY `daily_quests_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_quests`
--

LOCK TABLES `daily_quests` WRITE;
/*!40000 ALTER TABLE `daily_quests` DISABLE KEYS */;
INSERT INTO `daily_quests` VALUES ('cmhzm13k1000e9tn4qqc3tthc','daily_check_in','Günlük Check-in','Bugün check-in yap','✅',10,5,'daily',1,1,1,'2025-11-15 01:30:28.802','2025-11-17 03:15:47.651'),('cmhzm13k5000f9tn4lhex5yxd','daily_weigh_in','Bugün Tartıl','Kilonu kaydet','⚖️',15,5,'daily',1,1,2,'2025-11-15 01:30:28.805','2025-11-17 03:15:47.654'),('cmhzm13k7000g9tn4523u88kq','daily_water','Su İç','8 bardak su iç','💧',10,5,'daily',8,1,3,'2025-11-15 01:30:28.808','2025-11-17 03:15:47.656'),('cmhzm13k9000h9tn4vwa2iawa','daily_comment','Yorum Yap','Bir içeriğe yorum yap','💬',10,5,'daily',1,1,4,'2025-11-15 01:30:28.810','2025-11-17 03:15:47.659'),('cmhzm13kc000i9tn4ipnmnco4','daily_like','Beğen','3 içeriği beğen','❤️',10,5,'daily',3,1,5,'2025-11-15 01:30:28.812','2025-11-17 03:15:47.661');
/*!40000 ALTER TABLE `daily_quests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorites` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `targetType` enum('plan','photo') NOT NULL,
  `targetId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `favorites_userId_targetType_targetId_key` (`userId`,`targetType`,`targetId`),
  KEY `favorites_targetType_targetId_idx` (`targetType`,`targetId`),
  KEY `favorites_userId_idx` (`userId`),
  CONSTRAINT `favorites_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES ('cmi24t77n0004oojnubbhwr3t','cmhy68hs50000g0xkj2slheo4','plan','cmhy5ojq5000tnyxl6wixgpvn','2025-11-16 19:51:45.347');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follows`
--

DROP TABLE IF EXISTS `follows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `follows` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `targetId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `follows_userId_targetId_key` (`userId`,`targetId`),
  KEY `follows_userId_idx` (`userId`),
  KEY `follows_targetId_idx` (`targetId`),
  CONSTRAINT `follows_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `follows_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follows`
--

LOCK TABLES `follows` WRITE;
/*!40000 ALTER TABLE `follows` DISABLE KEYS */;
INSERT INTO `follows` VALUES ('cmhy6eyao0003g0xkeepxom3c','cmhy68hs50000g0xkj2slheo4','cmhxnqibq0000n3zb1nyhdaso','2025-11-14 01:25:35.137'),('cmhyx64v10001u207yiv1c4g0','cmhxnqibq0000n3zb1nyhdaso','cmhy68hs50000g0xkj2slheo4','2025-11-14 13:54:33.373');
/*!40000 ALTER TABLE `follows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_sins`
--

DROP TABLE IF EXISTS `food_sins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `food_sins` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `sinType` enum('tatli','fastfood','gazli','alkol','diger') NOT NULL,
  `note` text DEFAULT NULL,
  `emoji` varchar(10) NOT NULL,
  `sinDate` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `reactionText` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `food_sins_userId_sinDate_idx` (`userId`,`sinDate`),
  KEY `food_sins_sinType_sinDate_idx` (`sinType`,`sinDate`),
  KEY `food_sins_userId_createdAt_idx` (`userId`,`createdAt`),
  CONSTRAINT `food_sins_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_sins`
--

LOCK TABLES `food_sins` WRITE;
/*!40000 ALTER TABLE `food_sins` DISABLE KEYS */;
INSERT INTO `food_sins` VALUES ('cmi4xd3eb0001qqd5q0dsfv4n','cmhxnqibq0000n3zb1nyhdaso','tatli','Doğum günü pastası yedim.','🍰','2025-11-18 18:46:35.123','Tatlı tatlı günah işlemişsin 😋','2025-11-18 18:46:35.123','2025-11-18 18:46:35.123');
/*!40000 ALTER TABLE `food_sins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_links`
--

DROP TABLE IF EXISTS `footer_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `footer_links` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `column` enum('company','support','legal','community') NOT NULL DEFAULT 'company',
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `openInNew` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `footer_links_column_sortOrder_idx` (`column`,`sortOrder`),
  KEY `footer_links_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_links`
--

LOCK TABLES `footer_links` WRITE;
/*!40000 ALTER TABLE `footer_links` DISABLE KEYS */;
INSERT INTO `footer_links` VALUES ('cmi1ymmpl0004w7shc6j7cmt2','Hakkımızda','/hakkimizda','company',1,1,0,'2025-11-16 16:58:41.146','2025-11-16 16:58:41.146'),('cmi1ymmpq0005w7shbtam5byf','Blog','/blog','company',2,1,0,'2025-11-16 16:58:41.150','2025-11-16 16:58:41.150'),('cmi1ymmps0006w7shmcyd9wa1','Kariyer','/kariyer','company',3,1,0,'2025-11-16 16:58:41.153','2025-11-16 16:58:41.153'),('cmi1ymmpw0007w7sh41gz9i8y','Yardım Merkezi','/yardim','support',1,1,0,'2025-11-16 16:58:41.156','2025-11-16 16:58:41.156'),('cmi1ymmpy0008w7shiqodiky1','SSS','/sss','support',2,1,0,'2025-11-16 16:58:41.159','2025-11-16 16:58:41.159'),('cmi1ymmq10009w7shp6oouzg5','İletişim','/iletisim','support',3,1,0,'2025-11-16 16:58:41.162','2025-11-16 17:04:34.666'),('cmi1ymmq4000aw7shsy7y1jjq','Gizlilik Politikası','/gizlilik-politikasi','legal',1,1,0,'2025-11-16 16:58:41.165','2025-11-16 16:58:41.165'),('cmi1ymmq6000bw7sh0lo7ygoo','Kullanım Koşulları','/kullanim-kosullari','legal',2,1,0,'2025-11-16 16:58:41.167','2025-11-16 16:58:41.167'),('cmi1ymmq8000cw7shxckmmdxx','Çerez Politikası','/cerez-politikasi','legal',3,1,0,'2025-11-16 16:58:41.169','2025-11-16 16:58:41.169'),('cmi1ymmqa000dw7shlmuwfet6','Topluluk Kuralları','/topluluk-kurallari','community',1,1,0,'2025-11-16 16:58:41.171','2025-11-16 16:58:41.171'),('cmi1ymmqc000ew7shqsavy2lx','Başarı Hikayeleri','/basari-hikayeleri','community',2,1,0,'2025-11-16 16:58:41.173','2025-11-16 16:58:41.173'),('cmi1ymmqe000fw7shp8zqxb65','Forum','/forum','community',3,1,0,'2025-11-16 16:58:41.175','2025-11-16 16:58:41.175');
/*!40000 ALTER TABLE `footer_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_settings`
--

DROP TABLE IF EXISTS `footer_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `footer_settings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `footer_settings_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_settings`
--

LOCK TABLES `footer_settings` WRITE;
/*!40000 ALTER TABLE `footer_settings` DISABLE KEYS */;
INSERT INTO `footer_settings` VALUES ('cmi1ymmqq000kw7shj3x5k1or','footerDescription','Gerçek insanların gerçek zayıflama planlarını paylaştığı, topluluk destekli platform. Sağlıklı yaşam yolculuğunda yanınızdayız!','Footer logo altında görünecek açıklama','2025-11-16 16:58:41.186','2025-11-16 16:58:41.186'),('cmi1ymmqt000lw7showh6drsd','copyrightText','© 2025 ZayiflamaPlan. Tüm hakları saklıdır.','Footer alt kısmında görünecek telif hakkı metni','2025-11-16 16:58:41.189','2025-11-16 16:58:41.189');
/*!40000 ALTER TABLE `footer_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `footer_socials`
--

DROP TABLE IF EXISTS `footer_socials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `footer_socials` (
  `id` varchar(191) NOT NULL,
  `platform` varchar(191) NOT NULL,
  `url` varchar(191) NOT NULL,
  `icon` varchar(191) NOT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `footer_socials_sortOrder_idx` (`sortOrder`),
  KEY `footer_socials_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `footer_socials`
--

LOCK TABLES `footer_socials` WRITE;
/*!40000 ALTER TABLE `footer_socials` DISABLE KEYS */;
INSERT INTO `footer_socials` VALUES ('cmi1ymmqg000gw7shs6cnmufj','instagram','https://instagram.com/zayiflamaplan','📷',1,1,'2025-11-16 16:58:41.177','2025-11-19 16:06:22.746'),('cmi1ymmqj000hw7shj2dz9ubq','facebook','https://facebook.com/zayiflamaplan','📘',2,1,'2025-11-16 16:58:41.180','2025-11-19 16:06:22.750'),('cmi1ymmql000iw7sha4ayj98m','twitter','https://x.com/zayiflamaplanim','🐦',3,1,'2025-11-16 16:58:41.182','2025-11-19 16:06:22.752'),('cmi1ymmqn000jw7shstg0nkyk','youtube','https://youtube.com/@zayiflamaplan','📺',4,1,'2025-11-16 16:58:41.184','2025-11-19 16:06:22.754');
/*!40000 ALTER TABLE `footer_socials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_activities`
--

DROP TABLE IF EXISTS `friend_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend_activities` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `activityType` enum('sin_added','badge_earned','streak_milestone','challenge_completed','level_up') NOT NULL,
  `activityData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`activityData`)),
  `isPublic` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `friend_activities_userId_idx` (`userId`),
  KEY `friend_activities_activityType_idx` (`activityType`),
  KEY `friend_activities_createdAt_idx` (`createdAt`),
  KEY `friend_activities_isPublic_idx` (`isPublic`),
  CONSTRAINT `friend_activities_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_activities`
--

LOCK TABLES `friend_activities` WRITE;
/*!40000 ALTER TABLE `friend_activities` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_requests`
--

DROP TABLE IF EXISTS `friend_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend_requests` (
  `id` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `receiverId` varchar(191) NOT NULL,
  `status` enum('pending','accepted','rejected','cancelled') NOT NULL DEFAULT 'pending',
  `message` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `respondedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `friend_requests_senderId_receiverId_key` (`senderId`,`receiverId`),
  KEY `friend_requests_senderId_idx` (`senderId`),
  KEY `friend_requests_receiverId_idx` (`receiverId`),
  KEY `friend_requests_status_idx` (`status`),
  CONSTRAINT `friend_requests_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friend_requests_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_requests`
--

LOCK TABLES `friend_requests` WRITE;
/*!40000 ALTER TABLE `friend_requests` DISABLE KEYS */;
INSERT INTO `friend_requests` VALUES ('cmi5kcijw000r7hfq991vb3d7','cmhxnqibq0000n3zb1nyhdaso','cmhy68hs50000g0xkj2slheo4','pending',NULL,'2025-11-19 05:29:59.277','2025-11-19 05:29:59.277',NULL);
/*!40000 ALTER TABLE `friend_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend_settings`
--

DROP TABLE IF EXISTS `friend_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friend_settings` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `allowFriendRequests` tinyint(1) NOT NULL DEFAULT 1,
  `showStreak` tinyint(1) NOT NULL DEFAULT 1,
  `showBadges` tinyint(1) NOT NULL DEFAULT 1,
  `showStats` tinyint(1) NOT NULL DEFAULT 1,
  `showActivity` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `friend_settings_userId_key` (`userId`),
  CONSTRAINT `friend_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend_settings`
--

LOCK TABLES `friend_settings` WRITE;
/*!40000 ALTER TABLE `friend_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `friend_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendships`
--

DROP TABLE IF EXISTS `friendships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friendships` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `friendId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `friendships_userId_friendId_key` (`userId`,`friendId`),
  KEY `friendships_userId_idx` (`userId`),
  KEY `friendships_friendId_idx` (`friendId`),
  CONSTRAINT `friendships_friendId_fkey` FOREIGN KEY (`friendId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `friendships_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendships`
--

LOCK TABLES `friendships` WRITE;
/*!40000 ALTER TABLE `friendships` DISABLE KEYS */;
/*!40000 ALTER TABLE `friendships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_members`
--

DROP TABLE IF EXISTS `group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_members` (
  `id` varchar(191) NOT NULL,
  `groupId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `role` enum('creator','admin','moderator','member') NOT NULL DEFAULT 'member',
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_members_groupId_userId_key` (`groupId`,`userId`),
  KEY `group_members_userId_idx` (`userId`),
  KEY `group_members_groupId_joinedAt_idx` (`groupId`,`joinedAt`),
  CONSTRAINT `group_members_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_members`
--

LOCK TABLES `group_members` WRITE;
/*!40000 ALTER TABLE `group_members` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_posts`
--

DROP TABLE IF EXISTS `group_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_posts` (
  `id` varchar(191) NOT NULL,
  `groupId` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `title` varchar(191) DEFAULT NULL,
  `body` text NOT NULL,
  `images` text DEFAULT NULL,
  `likesCount` int(11) NOT NULL DEFAULT 0,
  `status` enum('pending','visible','hidden') NOT NULL DEFAULT 'visible',
  `isPinned` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `group_posts_groupId_createdAt_idx` (`groupId`,`createdAt`),
  KEY `group_posts_authorId_idx` (`authorId`),
  KEY `group_posts_status_idx` (`status`),
  KEY `group_posts_isPinned_createdAt_idx` (`isPinned`,`createdAt`),
  CONSTRAINT `group_posts_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `group_posts_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_posts`
--

LOCK TABLES `group_posts` WRITE;
/*!40000 ALTER TABLE `group_posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `group_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `category` enum('general','motivation','recipes','exercise','support','age_based','goal_based','lifestyle') NOT NULL DEFAULT 'general',
  `creatorId` varchar(191) NOT NULL,
  `memberCount` int(11) NOT NULL DEFAULT 1,
  `postCount` int(11) NOT NULL DEFAULT 0,
  `isPublic` tinyint(1) NOT NULL DEFAULT 1,
  `maxMembers` int(11) DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `rules` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `status` enum('pending','published','rejected') NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `groups_slug_key` (`slug`),
  KEY `groups_slug_idx` (`slug`),
  KEY `groups_creatorId_idx` (`creatorId`),
  KEY `groups_category_idx` (`category`),
  KEY `groups_isPublic_idx` (`isPublic`),
  KEY `groups_status_createdAt_idx` (`status`,`createdAt`),
  FULLTEXT KEY `groups_name_description_idx` (`name`,`description`),
  CONSTRAINT `groups_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guild_join_requests`
--

DROP TABLE IF EXISTS `guild_join_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_join_requests` (
  `id` varchar(191) NOT NULL,
  `guildId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `message` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_join_requests_guildId_userId_key` (`guildId`,`userId`),
  KEY `guild_join_requests_guildId_status_idx` (`guildId`,`status`),
  KEY `guild_join_requests_userId_idx` (`userId`),
  CONSTRAINT `guild_join_requests_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guild_join_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guild_join_requests`
--

LOCK TABLES `guild_join_requests` WRITE;
/*!40000 ALTER TABLE `guild_join_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `guild_join_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guild_members`
--

DROP TABLE IF EXISTS `guild_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guild_members` (
  `id` varchar(191) NOT NULL,
  `guildId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `role` enum('leader','officer','member') NOT NULL DEFAULT 'member',
  `xpEarned` int(11) NOT NULL DEFAULT 0,
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_members_guildId_userId_key` (`guildId`,`userId`),
  KEY `guild_members_userId_idx` (`userId`),
  KEY `guild_members_guildId_xpEarned_idx` (`guildId`,`xpEarned`),
  CONSTRAINT `guild_members_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `guilds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guild_members_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guild_members`
--

LOCK TABLES `guild_members` WRITE;
/*!40000 ALTER TABLE `guild_members` DISABLE KEYS */;
INSERT INTO `guild_members` VALUES ('cmi0xx3ef0003dtmphay2fcsx','cmi0xx3e90001dtmpeipxpgjc','cmhxnqibq0000n3zb1nyhdaso','leader',0,'2025-11-15 23:51:03.544');
/*!40000 ALTER TABLE `guild_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guilds`
--

DROP TABLE IF EXISTS `guilds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guilds` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `leaderId` varchar(191) NOT NULL,
  `memberCount` int(11) NOT NULL DEFAULT 1,
  `totalXP` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `isPublic` tinyint(1) NOT NULL DEFAULT 1,
  `maxMembers` int(11) NOT NULL DEFAULT 50,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `status` enum('pending','published','rejected') NOT NULL DEFAULT 'pending',
  `category` varchar(191) DEFAULT NULL,
  `color` varchar(191) DEFAULT NULL,
  `monthlyGoal` varchar(191) DEFAULT NULL,
  `rules` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `guilds_name_key` (`name`),
  UNIQUE KEY `guilds_slug_key` (`slug`),
  KEY `guilds_slug_idx` (`slug`),
  KEY `guilds_leaderId_idx` (`leaderId`),
  KEY `guilds_totalXP_idx` (`totalXP`),
  KEY `guilds_status_createdAt_idx` (`status`,`createdAt`),
  KEY `guilds_category_idx` (`category`),
  CONSTRAINT `guilds_leaderId_fkey` FOREIGN KEY (`leaderId`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guilds`
--

LOCK TABLES `guilds` WRITE;
/*!40000 ALTER TABLE `guilds` DISABLE KEYS */;
INSERT INTO `guilds` VALUES ('cmi0xx3e90001dtmpeipxpgjc','Sabah Sporcuları','sabah-sporculari','Sabah erken kalkan ve spor yapan topluluk','💪','cmhxnqibq0000n3zb1nyhdaso',1,0,1,0,50,'2025-11-15 23:51:03.538','2025-11-16 13:09:25.098','2025-11-16 00:00:19.162',NULL,'published','fitness','#ef4444','Toplam 5 kg vermek','Haftalık tartı paylaşımı zorunlu.\nHer sabah en az 30 dakika yürüyüş.\nHer sabah cihazındaki yürüyüş etkinliğini paylaşmak.');
/*!40000 ALTER TABLE `guilds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leagues`
--

DROP TABLE IF EXISTS `leagues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leagues` (
  `id` varchar(191) NOT NULL,
  `seasonId` varchar(191) NOT NULL,
  `tier` enum('bronze','silver','gold','platinum','diamond') NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `minPoints` int(11) NOT NULL DEFAULT 0,
  `maxPoints` int(11) DEFAULT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `rewards` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `leagues_seasonId_tier_key` (`seasonId`,`tier`),
  KEY `leagues_seasonId_idx` (`seasonId`),
  CONSTRAINT `leagues_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leagues`
--

LOCK TABLES `leagues` WRITE;
/*!40000 ALTER TABLE `leagues` DISABLE KEYS */;
INSERT INTO `leagues` VALUES ('cmhzm13lc000q9tn4riwqowtn','season-2024-01','bronze','Bronz Ligi',NULL,0,999,NULL,NULL,'2025-11-15 01:30:28.848','2025-11-17 03:15:47.692'),('cmhzm13lf000s9tn4a7f71dvv','season-2024-01','silver','Gümüş Ligi',NULL,1000,2499,NULL,NULL,'2025-11-15 01:30:28.851','2025-11-17 03:15:47.695'),('cmhzm13lh000u9tn489j9n4o5','season-2024-01','gold','Altın Ligi',NULL,2500,4999,NULL,NULL,'2025-11-15 01:30:28.854','2025-11-17 03:15:47.697'),('cmhzm13lj000w9tn426h2wv6o','season-2024-01','platinum','Platin Ligi',NULL,5000,9999,NULL,NULL,'2025-11-15 01:30:28.856','2025-11-17 03:15:47.699'),('cmhzm13lm000y9tn4ot9kxuug','season-2024-01','diamond','Elmas Ligi',NULL,10000,NULL,NULL,NULL,'2025-11-15 01:30:28.858','2025-11-17 03:15:47.701'),('cmi2giwbi000t2pqmmp40zl70','default-season','bronze','Bronz Ligi','Yolculuğun başlangıcı',0,999,'🥉',NULL,'2025-11-17 01:19:40.062','2025-11-17 01:19:40.062'),('cmi2giwbn000v2pqmk2m669lp','default-season','silver','Gümüş Ligi','İlerliyorsun!',1000,2499,'🥈',NULL,'2025-11-17 01:19:40.068','2025-11-17 01:19:40.068'),('cmi2giwbp000x2pqmxsp973yw','default-season','gold','Altın Ligi','Harika gidiyorsun',2500,4999,'🥇',NULL,'2025-11-17 01:19:40.069','2025-11-17 01:19:40.069'),('cmi2giwbr000z2pqmkrt88j6g','default-season','platinum','Platin Ligi','Elit seviyedesin',5000,9999,'💎',NULL,'2025-11-17 01:19:40.072','2025-11-17 01:19:40.072'),('cmi2giwbt00112pqm6gukuzlu','default-season','diamond','Elmas Ligi','En iyilerin arasındasın!',10000,NULL,'💠',NULL,'2025-11-17 01:19:40.074','2025-11-17 01:19:40.074');
/*!40000 ALTER TABLE `leagues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `likes` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `targetType` enum('plan','photo') NOT NULL,
  `targetId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `likes_userId_targetType_targetId_key` (`userId`,`targetType`,`targetId`),
  KEY `likes_targetType_targetId_idx` (`targetType`,`targetId`),
  KEY `likes_userId_idx` (`userId`),
  KEY `likes_targetId_fkey` (`targetId`),
  CONSTRAINT `likes_targetId_fkey` FOREIGN KEY (`targetId`) REFERENCES `plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES ('cmhy6k3ki0005g0xkw0ddypvd','cmhy68hs50000g0xkj2slheo4','plan','cmhy5ojq5000tnyxl6wixgpvn','2025-11-14 01:29:35.251'),('cmi2bnrct0006knwpnka7qhk6','cmhxnqibq0000n3zb1nyhdaso','plan','cmi0lc3p100019u3cu1ji0lwk','2025-11-16 23:03:28.830'),('cmi2bukwh000oknwp2pgymlpj','cmhxnqibq0000n3zb1nyhdaso','plan','cmhy5ojq5000tnyxl6wixgpvn','2025-11-16 23:08:47.058'),('cmi2h8lf50002vgl4gcweccky','cmhy68hs50000g0xkj2slheo4','plan','cmi0lc3p100019u3cu1ji0lwk','2025-11-17 01:39:38.993');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `receiverId` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `readAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `messages_conversationId_createdAt_idx` (`conversationId`,`createdAt`),
  KEY `messages_senderId_idx` (`senderId`),
  KEY `messages_receiverId_idx` (`receiverId`),
  KEY `messages_read_idx` (`read`),
  CONSTRAINT `messages_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_receiverId_fkey` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `messages_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES ('cmhyxbfdh0004u2079xfftl8w','cmhyxbfcu0002u207r83pctzc','cmhxnqibq0000n3zb1nyhdaso','cmhy68hs50000g0xkj2slheo4','Selamlar',1,'2025-11-15 21:04:44.089','2025-11-14 13:58:40.277'),('cmi0rzfmk0002n96irjow70s0','cmhyxbfcu0002u207r83pctzc','cmhy68hs50000g0xkj2slheo4','cmhxnqibq0000n3zb1nyhdaso','selamlar canım',1,'2025-11-15 21:05:09.083','2025-11-15 21:04:54.988');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_settings`
--

DROP TABLE IF EXISTS `notification_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_settings` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `dailyReminder` tinyint(1) NOT NULL DEFAULT 1,
  `dailyReminderTime` varchar(5) NOT NULL DEFAULT '20:00',
  `weeklySummary` tinyint(1) NOT NULL DEFAULT 1,
  `badgeEarned` tinyint(1) NOT NULL DEFAULT 1,
  `challengeReminder` tinyint(1) NOT NULL DEFAULT 1,
  `streakWarning` tinyint(1) NOT NULL DEFAULT 1,
  `friendActivity` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `notification_settings_userId_key` (`userId`),
  CONSTRAINT `notification_settings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_settings`
--

LOCK TABLES `notification_settings` WRITE;
/*!40000 ALTER TABLE `notification_settings` DISABLE KEYS */;
INSERT INTO `notification_settings` VALUES ('cmi5jsxll0001jhlazmcw4skz','cmhxnqibq0000n3zb1nyhdaso',1,'20:00',1,1,1,1,0,'2025-11-19 05:14:45.657','2025-11-19 05:14:45.657'),('cmi5kd9ix000v7hfqj31e6bri','cmhy68hs50000g0xkj2slheo4',1,'20:00',1,1,1,1,1,'2025-11-19 05:30:34.233','2025-11-19 05:30:37.981');
/*!40000 ALTER TABLE `notification_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('like','comment','follow','plan_approved','plan_rejected','message') NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `targetType` enum('plan','photo') DEFAULT NULL,
  `targetId` varchar(191) DEFAULT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `notifications_userId_read_createdAt_idx` (`userId`,`read`,`createdAt`),
  CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES ('cmhyxbfdq0006u207sd18dysf','cmhy68hs50000g0xkj2slheo4','message','Yeni Mesaj','Admin size mesaj gönderdi',NULL,NULL,1,'2025-11-14 13:58:40.286'),('cmi0nhdv600015cuq4pwe705b','cmhxnqibq0000n3zb1nyhdaso','plan_approved','İtirazınız Onaylandı','plan içeriğinize yaptığınız itiraz onaylandı ve içeriğiniz yayınlandı.','plan','cmi0lc3p100019u3cu1ji0lwk',1,'2025-11-15 18:58:54.449'),('cmi0rzfmu0004n96i6tbpt668','cmhxnqibq0000n3zb1nyhdaso','message','Yeni Mesaj','Meo size mesaj gönderdi',NULL,NULL,1,'2025-11-15 21:04:55.015'),('cmi0y904x0005dtmp8l28tw94','cmhxnqibq0000n3zb1nyhdaso','plan_approved','🎉 Loncanız Onaylandı!','\"Sabah Sporcuları\" loncanız yayınlandı. Artık herkes katılabilir!','plan','cmi0xx3e90001dtmpeipxpgjc',1,'2025-11-16 00:00:19.186'),('cmi1pu0o30001uio2zg4o56cg','cmhxnqibq0000n3zb1nyhdaso','message','👋 Üye Ayrıldı','Bir üye Sabah Sporcuları loncasından ayrıldı.',NULL,NULL,1,'2025-11-16 12:52:29.283');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `content` longtext NOT NULL,
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDesc` text DEFAULT NULL,
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
  `isPublished` tinyint(1) NOT NULL DEFAULT 0,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pages_slug_key` (`slug`),
  KEY `pages_slug_idx` (`slug`),
  KEY `pages_status_idx` (`status`),
  KEY `pages_isPublished_idx` (`isPublished`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES ('cmi1xks3j0000awl2gwrtuvx1','hakkimizda','Hakkımızda','\n        <h2>🌟 ZayiflamaPlan Nedir?</h2>\n        <p>ZayiflamaPlan, gerçek insanların gerçek zayıflama deneyimlerini paylaştığı, topluluk destekli bir platformdur. Binlerce kişi burada hedeflerine ulaşıyor, deneyimlerini paylaşıyor ve birbirlerine ilham veriyor.</p>\n        \n        <p>Diyet listeleri, kısıtlayıcı programlar ve tek tip çözümler yerine, <strong>gerçek insanların gerçek başarı hikayelerini</strong> sunuyoruz. Çünkü biliyoruz ki, herkesin yolculuğu farklıdır ve en iyi motivasyon, benzer hedeflere sahip insanlardan gelir.</p>\n        \n        <h3>💪 Misyonumuz</h3>\n        <p>Sağlıklı yaşam yolculuğunda insanları bir araya getirmek ve birbirlerinden ilham almalarını sağlamak. Kimsenin yalnız hissetmediği, herkesin desteklendiği bir topluluk oluşturmak.</p>\n        \n        <ul>\n          <li><strong>Gerçek deneyimler:</strong> Profesyonel değil, gerçek insanların hikayeleri</li>\n          <li><strong>Topluluk desteği:</strong> Gruplar, loncalar ve mesajlaşma ile sürekli motivasyon</li>\n          <li><strong>Gamification:</strong> Rozetler, XP sistemi ve ödüllerle eğlenceli bir deneyim</li>\n          <li><strong>Ücretsiz:</strong> Tüm özellikler herkese açık</li>\n        </ul>\n        \n        <h3>🎯 Vizyonumuz</h3>\n        <p>Türkiye\'nin en büyük ve en destekleyici sağlıklı yaşam topluluğu olmak. Milyonlarca insanın hedeflerine ulaşmasına yardımcı olmak ve sağlıklı yaşamı herkes için erişilebilir kılmak.</p>\n        \n        <h3>📊 Rakamlarla Biz</h3>\n        <ul>\n          <li>15,000+ aktif kullanıcı</li>\n          <li>2,500+ paylaşılan plan</li>\n          <li>45,678 kg toplam kilo kaybı</li>\n          <li>%98 kullanıcı memnuniyeti</li>\n        </ul>\n        \n        <h2>🚀 Nasıl Başladık?</h2>\n        <p>ZayiflamaPlan, kendi kilo verme yolculuğunda zorluk çeken ve internette gerçek, samimi deneyimler arayan bir grup arkadaş tarafından kuruldu. Profesyonel diyetisyenlerin pahalı programları yerine, gerçek insanların başarı hikayelerinin daha motive edici olduğunu fark ettik.</p>\n        \n        <p>2024 yılında küçük bir topluluk olarak başladık ve bugün binlerce insanın hayatına dokunuyoruz. Her gün yeni başarı hikayeleri ekleniyor, yeni dostluklar kuruluyor ve yeni hedeflere ulaşılıyor.</p>\n        \n        <h2>💝 Değerlerimiz</h2>\n        <ul>\n          <li><strong>Samimiyet:</strong> Gerçek deneyimler, gerçek sonuçlar</li>\n          <li><strong>Destek:</strong> Kimse yalnız değil, hep birlikte başarıyoruz</li>\n          <li><strong>Çeşitlilik:</strong> Her vücut tipi, her hedef değerlidir</li>\n          <li><strong>Pozitiflik:</strong> Kısıtlama değil, sağlıklı yaşam</li>\n          <li><strong>Gizlilik:</strong> Verileriniz güvende, paylaşımlarınız sizin kontrolünüzde</li>\n        </ul>\n      ','Hakkımızda - ZayiflamaPlan','ZayiflamaPlan hakkında bilgi edinin. Misyonumuz, vizyonumuz ve hikayemiz.','published',1,1,'2025-11-16 16:29:15.199','2025-11-16 16:58:41.126','2025-11-16 16:58:41.097'),('cmi1xks3p0001awl2qrjvv7yc','gizlilik-politikasi','Gizlilik Politikası','\n        <h2>Gizlilik Politikası</h2>\n        <p>Son güncelleme: 16.11.2025</p>\n        \n        <h3>1. Toplanan Bilgiler</h3>\n        <p>Platformumuzu kullanırken aşağıdaki bilgileri topluyoruz:</p>\n        <ul>\n          <li>Hesap bilgileri (e-posta, kullanıcı adı)</li>\n          <li>Profil bilgileri (boy, kilo, hedefler)</li>\n          <li>Kullanım verileri</li>\n        </ul>\n        \n        <h3>2. Bilgilerin Kullanımı</h3>\n        <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>\n        <ul>\n          <li>Hizmet kalitesini artırmak</li>\n          <li>Kişiselleştirilmiş deneyim sunmak</li>\n          <li>Güvenlik sağlamak</li>\n        </ul>\n        \n        <h3>3. Bilgi Güvenliği</h3>\n        <p>Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz.</p>\n      ','Gizlilik Politikası - ZayiflamaPlan','ZayiflamaPlan gizlilik politikası. Verilerinizi nasıl topladığımız ve koruduğumuz hakkında bilgi.','published',1,2,'2025-11-16 16:29:15.206','2025-11-16 16:58:41.137','2025-11-16 16:58:41.110'),('cmi1xks3s0002awl26pgey64m','kullanim-kosullari','Kullanım Koşulları','\n        <h2>Kullanım Koşulları</h2>\n        <p>Son güncelleme: 16.11.2025</p>\n        \n        <h3>1. Hizmet Kullanımı</h3>\n        <p>ZayiflamaPlan\'ı kullanarak aşağıdaki koşulları kabul etmiş olursunuz:</p>\n        <ul>\n          <li>18 yaşından büyük olmalısınız</li>\n          <li>Doğru bilgiler paylaşmalısınız</li>\n          <li>Topluluk kurallarına uymalısınız</li>\n        </ul>\n        \n        <h3>2. İçerik Politikası</h3>\n        <p>Paylaştığınız içerikler:</p>\n        <ul>\n          <li>Yasalara uygun olmalı</li>\n          <li>Başkalarının haklarını ihlal etmemeli</li>\n          <li>Yanıltıcı bilgi içermemeli</li>\n        </ul>\n        \n        <h3>3. Sorumluluk Reddi</h3>\n        <p>Platform sadece bilgi paylaşım amaçlıdır. Tıbbi tavsiye yerine geçmez.</p>\n      ','Kullanım Koşulları - ZayiflamaPlan','ZayiflamaPlan kullanım koşulları ve kuralları.','published',1,3,'2025-11-16 16:29:15.208','2025-11-16 16:58:41.140','2025-11-16 16:58:41.110'),('cmi1xks3x0003awl2nz2t3mof','iletisim','İletişim','\n        <h2>📬 Bize Ulaşın</h2>\n        <p>Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz. Size en kısa sürede dönüş yapacağız!</p>\n        \n        <h3>📧 E-posta</h3>\n        <p><strong>Genel Sorular:</strong> <a href=\"mailto:info@zayiflamaplan.com\">info@zayiflamaplan.com</a></p>\n        <p><strong>Teknik Destek:</strong> <a href=\"mailto:destek@zayiflamaplan.com\">destek@zayiflamaplan.com</a></p>\n        <p><strong>İş Birliği:</strong> <a href=\"mailto:isbirligi@zayiflamaplan.com\">isbirligi@zayiflamaplan.com</a></p>\n        \n        <h3>🌐 Sosyal Medya</h3>\n        <p>Bizi sosyal medyada takip edin, güncel kalın ve topluluğumuzun bir parçası olun!</p>\n        <ul>\n          <li><strong>Instagram:</strong> <a href=\"https://instagram.com/zayiflamaplan\" target=\"_blank\">@zayiflamaplan</a></li>\n          <li><strong>Facebook:</strong> <a href=\"https://facebook.com/zayiflamaplan\" target=\"_blank\">ZayiflamaPlan</a></li>\n          <li><strong>Twitter:</strong> <a href=\"https://twitter.com/zayiflamaplan\" target=\"_blank\">@zayiflamaplan</a></li>\n          <li><strong>YouTube:</strong> <a href=\"https://youtube.com/@zayiflamaplan\" target=\"_blank\">ZayiflamaPlan</a></li>\n        </ul>\n        \n        <h3>⏰ Çalışma Saatleri</h3>\n        <p>Destek ekibimiz size yardımcı olmak için burada:</p>\n        <ul>\n          <li><strong>Hafta İçi:</strong> 09:00 - 18:00</li>\n          <li><strong>Hafta Sonu:</strong> 10:00 - 16:00</li>\n        </ul>\n        <p><em>E-postalarınıza 24 saat içinde yanıt vermeye çalışıyoruz.</em></p>\n        \n        <h3>❓ Sık Sorulan Sorular</h3>\n        <p>Hızlı yanıtlar için <a href=\"/sss\">SSS sayfamızı</a> ziyaret edebilirsiniz. Çoğu sorunun yanıtını burada bulabilirsiniz.</p>\n        \n        <h3>🐛 Hata Bildirimi</h3>\n        <p>Platformda bir hata mı buldunuz? Lütfen bize bildirin! Detaylı açıklama ile birlikte <a href=\"mailto:destek@zayiflamaplan.com\">destek@zayiflamaplan.com</a> adresine yazabilirsiniz.</p>\n        \n        <h2>💡 Öneri ve Geri Bildirim</h2>\n        <p>Platformumuzu daha iyi hale getirmek için fikirlerinizi bekliyoruz! Önerilerinizi <a href=\"mailto:info@zayiflamaplan.com\">info@zayiflamaplan.com</a> adresine gönderebilirsiniz.</p>\n      ','İletişim - ZayiflamaPlan','ZayiflamaPlan ile iletişime geçin. Sorularınız için bize ulaşın.','published',1,4,'2025-11-16 16:29:15.213','2025-11-16 16:58:41.143','2025-11-16 16:58:41.110');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `password_resets_token_key` (`token`),
  KEY `password_resets_token_idx` (`token`),
  KEY `password_resets_userId_idx` (`userId`),
  KEY `password_resets_expiresAt_idx` (`expiresAt`),
  CONSTRAINT `password_resets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_days`
--

DROP TABLE IF EXISTS `plan_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan_days` (
  `id` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `dayNumber` int(11) NOT NULL,
  `breakfast` text DEFAULT NULL,
  `snack1` text DEFAULT NULL,
  `lunch` text DEFAULT NULL,
  `snack2` text DEFAULT NULL,
  `dinner` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plan_days_planId_dayNumber_key` (`planId`,`dayNumber`),
  KEY `plan_days_planId_idx` (`planId`),
  CONSTRAINT `plan_days_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_days`
--

LOCK TABLES `plan_days` WRITE;
/*!40000 ALTER TABLE `plan_days` DISABLE KEYS */;
INSERT INTO `plan_days` VALUES ('cmhy5ojq9000unyxlks4m2scu','cmhy5ojq5000tnyxl6wixgpvn',1,'omlet','1 avuç ceviz','ızgara tavuk','Yoğurt','ızgara somon','ilk gün biraz zorluk çekebilirsin.');
/*!40000 ALTER TABLE `plan_days` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_progress`
--

DROP TABLE IF EXISTS `plan_progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan_progress` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `currentDay` int(11) NOT NULL DEFAULT 0,
  `lastUpdated` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `plan_progress_userId_planId_key` (`userId`,`planId`),
  KEY `plan_progress_planId_idx` (`planId`),
  KEY `plan_progress_userId_idx` (`userId`),
  CONSTRAINT `plan_progress_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_progress`
--

LOCK TABLES `plan_progress` WRITE;
/*!40000 ALTER TABLE `plan_progress` DISABLE KEYS */;
INSERT INTO `plan_progress` VALUES ('cmi24re210001oojndmildh6g','cmhxnqibq0000n3zb1nyhdaso','cmhy5ojq5000tnyxl6wixgpvn',1,'2025-11-16 19:50:20.906','2025-11-16 19:50:20.906');
/*!40000 ALTER TABLE `plan_progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_ratings`
--

DROP TABLE IF EXISTS `plan_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan_ratings` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plan_ratings_userId_planId_key` (`userId`,`planId`),
  KEY `plan_ratings_planId_idx` (`planId`),
  KEY `plan_ratings_userId_idx` (`userId`),
  CONSTRAINT `plan_ratings_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_ratings`
--

LOCK TABLES `plan_ratings` WRITE;
/*!40000 ALTER TABLE `plan_ratings` DISABLE KEYS */;
INSERT INTO `plan_ratings` VALUES ('cmi24xqur0006oojnyv31w84l','cmhy68hs50000g0xkj2slheo4','cmhy5ojq5000tnyxl6wixgpvn',5,'2025-11-16 19:55:17.428','2025-11-16 19:55:17.428');
/*!40000 ALTER TABLE `plan_ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_views`
--

DROP TABLE IF EXISTS `plan_views`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan_views` (
  `id` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `ipAddress` varchar(191) DEFAULT NULL,
  `viewedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `plan_views_planId_userId_viewedAt_idx` (`planId`,`userId`,`viewedAt`),
  KEY `plan_views_planId_ipAddress_viewedAt_idx` (`planId`,`ipAddress`,`viewedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_views`
--

LOCK TABLES `plan_views` WRITE;
/*!40000 ALTER TABLE `plan_views` DISABLE KEYS */;
INSERT INTO `plan_views` VALUES ('cmhy5vkog000vnyxl68c1ap9p','cmhy5ojq5000tnyxl6wixgpvn','cmhxnqibq0000n3zb1nyhdaso',NULL,'2025-11-14 01:10:31.022'),('cmhy654so0000flm17viwd9q2','cmhy5ojq5000tnyxl6wixgpvn',NULL,'::1','2025-11-14 01:17:56.998'),('cmhy69lvs0001g0xkzdik8ulr','cmhy5ojq5000tnyxl6wixgpvn','cmhy68hs50000g0xkj2slheo4',NULL,'2025-11-14 01:21:25.767'),('cmhzouvsu0000103x92y1izfr','cmhy5ojq5000tnyxl6wixgpvn','cmhxnqibq0000n3zb1nyhdaso',NULL,'2025-11-15 02:49:37.658'),('cmi0riegx0000n96illi2roxz','cmi0lc3p100019u3cu1ji0lwk','cmhxnqibq0000n3zb1nyhdaso',NULL,'2025-11-15 20:51:40.351'),('cmi23sw720001dfqhqbt44fq9','cmhy5ojq5000tnyxl6wixgpvn','cmhxnqibq0000n3zb1nyhdaso',NULL,'2025-11-16 19:23:31.451'),('cmi24t3s80002oojn3s114f5v','cmhy5ojq5000tnyxl6wixgpvn','cmhy68hs50000g0xkj2slheo4',NULL,'2025-11-16 19:51:40.907'),('cmi258fp30007oojnzfblq8jh','cmhy5ojq5000tnyxl6wixgpvn',NULL,'::1','2025-11-16 20:03:36.186'),('cmi2biual0002knwphzljj1v1','cmi0lc3p100019u3cu1ji0lwk','cmhxnqibq0000n3zb1nyhdaso',NULL,'2025-11-16 22:59:39.356'),('cmi2h8jon0000vgl41ff9h60r','cmi0lc3p100019u3cu1ji0lwk','cmhy68hs50000g0xkj2slheo4',NULL,'2025-11-17 01:39:36.743');
/*!40000 ALTER TABLE `plan_views` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plans` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `duration` int(11) NOT NULL,
  `targetWeightLoss` double DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
  `tags` text DEFAULT NULL,
  `authorStory` text DEFAULT NULL,
  `authorWeightLoss` double DEFAULT NULL,
  `authorDuration` int(11) DEFAULT NULL,
  `beforePhotoUrl` varchar(191) DEFAULT NULL,
  `afterPhotoUrl` varchar(191) DEFAULT NULL,
  `status` enum('draft','pending','under_review','published','rejected') NOT NULL DEFAULT 'pending',
  `views` int(11) NOT NULL DEFAULT 0,
  `likesCount` int(11) NOT NULL DEFAULT 0,
  `commentsCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `averageRating` double NOT NULL DEFAULT 0,
  `ratingCount` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `plans_slug_key` (`slug`),
  KEY `plans_slug_idx` (`slug`),
  KEY `plans_authorId_createdAt_idx` (`authorId`,`createdAt`),
  KEY `plans_status_createdAt_idx` (`status`,`createdAt`),
  KEY `plans_publishedAt_idx` (`publishedAt`),
  KEY `plans_averageRating_idx` (`averageRating`),
  FULLTEXT KEY `plans_title_description_idx` (`title`,`description`),
  CONSTRAINT `plans_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES ('cmhy5ojq5000tnyxl6wixgpvn','30-gunde-evde-3-kg-verdim','30 günde evde 3 kg verdim','30 günde evde 3 kg verdim','cmhxnqibq0000n3zb1nyhdaso',30,3,'easy','3 kg, 30 gün, evde, zayiflama','pandeme döneminde çok kg aldım.',3,30,NULL,NULL,'published',7,2,2,'2025-11-14 01:05:03.196','2025-11-16 23:26:19.692','2025-11-14 01:28:53.806',NULL,5,1),('cmi0lc3p100019u3cu1ji0lwk','adasdfsdf','adasdfsdf','sdfsdfsdf','cmhxnqibq0000n3zb1nyhdaso',1,1,'easy','wwe','pandemi',1,1,NULL,NULL,'published',3,2,0,'2025-11-15 17:58:48.741','2025-11-17 01:39:38.993','2025-11-15 18:58:54.444',NULL,0,0);
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_photos`
--

DROP TABLE IF EXISTS `progress_photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `progress_photos` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `photoUrl` varchar(191) NOT NULL,
  `weight` double DEFAULT NULL,
  `type` enum('before','after','progress') NOT NULL DEFAULT 'progress',
  `caption` text DEFAULT NULL,
  `likesCount` int(11) NOT NULL DEFAULT 0,
  `commentsCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `progress_photos_userId_createdAt_idx` (`userId`,`createdAt`),
  CONSTRAINT `progress_photos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_photos`
--

LOCK TABLES `progress_photos` WRITE;
/*!40000 ALTER TABLE `progress_photos` DISABLE KEYS */;
INSERT INTO `progress_photos` VALUES ('cmhzjmsm70001bnf0948c5ucw','cmhxnqibq0000n3zb1nyhdaso','/uploads/progress-photos/1763166202205-cipbksunhns.jpg',75,'progress',NULL,0,0,'2025-11-15 00:23:22.207');
/*!40000 ALTER TABLE `progress_photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_notifications`
--

DROP TABLE IF EXISTS `push_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `push_notifications` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('daily_reminder','weekly_summary','badge_earned','challenge_reminder','streak_warning','friend_activity','custom') NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `badge` varchar(255) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `status` enum('pending','sent','failed','clicked') NOT NULL DEFAULT 'pending',
  `sentAt` datetime(3) DEFAULT NULL,
  `clickedAt` datetime(3) DEFAULT NULL,
  `errorMessage` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `push_notifications_userId_idx` (`userId`),
  KEY `push_notifications_type_idx` (`type`),
  KEY `push_notifications_status_idx` (`status`),
  KEY `push_notifications_createdAt_idx` (`createdAt`),
  CONSTRAINT `push_notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_notifications`
--

LOCK TABLES `push_notifications` WRITE;
/*!40000 ALTER TABLE `push_notifications` DISABLE KEYS */;
INSERT INTO `push_notifications` VALUES ('cmi5jz5dx00017hfqwuss1dfd','cmhxnqibq0000n3zb1nyhdaso','custom','🔔 Test Bildirimi','Push notification sistemi çalışıyor! 🎉','/icons/icon-192x192.png','/icons/badge-72x72.png','{\"url\":\"/gunah-sayaci\",\"test\":true}','sent','2025-11-19 05:19:36.251',NULL,NULL,'2025-11-19 05:19:35.686'),('cmi5jzfrx00037hfqpukd37yb','cmhxnqibq0000n3zb1nyhdaso','custom','🔔 Test Bildirimi','Push notification sistemi çalışıyor! 🎉','/icons/icon-192x192.png','/icons/badge-72x72.png','{\"url\":\"/gunah-sayaci\",\"test\":true}','sent','2025-11-19 05:19:49.351',NULL,NULL,'2025-11-19 05:19:49.150'),('cmi5jzop000057hfq2j1s4yq0','cmhxnqibq0000n3zb1nyhdaso','custom','🔔 Test Bildirimi','Push notification sistemi çalışıyor! 🎉','/icons/icon-192x192.png','/icons/badge-72x72.png','{\"url\":\"/gunah-sayaci\",\"test\":true}','sent','2025-11-19 05:20:00.892',NULL,NULL,'2025-11-19 05:20:00.708'),('cmi5k47jh000n7hfqucct16p9','cmhxnqibq0000n3zb1nyhdaso','custom','🔔 Test Bildirimi','Push notification sistemi çalışıyor! 🎉','/icons/icon-192x192.png','/icons/badge-72x72.png','{\"url\":\"/gunah-sayaci\",\"test\":true}','sent','2025-11-19 05:23:31.979',NULL,NULL,'2025-11-19 05:23:31.758'),('cmi5k5mhz000p7hfqb1rqy2pt','cmhxnqibq0000n3zb1nyhdaso','custom','🔔 Test Bildirimi','Push notification sistemi çalışıyor! 🎉','/icons/icon-192x192.png','/icons/badge-72x72.png','{\"url\":\"/gunah-sayaci\",\"test\":true}','sent','2025-11-19 05:24:38.005',NULL,NULL,'2025-11-19 05:24:37.799');
/*!40000 ALTER TABLE `push_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `push_subscriptions`
--

DROP TABLE IF EXISTS `push_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `push_subscriptions` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `endpoint` varchar(500) NOT NULL,
  `p256dh` text NOT NULL,
  `auth` text NOT NULL,
  `userAgent` text DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `push_subscriptions_userId_endpoint_key` (`userId`,`endpoint`),
  KEY `push_subscriptions_userId_idx` (`userId`),
  KEY `push_subscriptions_isActive_idx` (`isActive`),
  CONSTRAINT `push_subscriptions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `push_subscriptions`
--

LOCK TABLES `push_subscriptions` WRITE;
/*!40000 ALTER TABLE `push_subscriptions` DISABLE KEYS */;
INSERT INTO `push_subscriptions` VALUES ('cmi1vxeeb0001ry3lwl0dw1ct','cmhxnqibq0000n3zb1nyhdaso','https://fcm.googleapis.com/fcm/send/dCtN-maMVHY:APA91bFs776849PytvHy_Mo5WE8xG2SE0k9F5mnnbGk6llzKM3ckl3u_7Z-qJvPKr4OiceiB9KBMMOm-VRCXIIqs-qNlxsbDvwiqBx8xzlxsMrRGlA_Qcvy6lzmoPDe7gemlauODCiK8','BKi8AKNiRpPhowb_OmL811XpOt1iObYVr8KwiRsO9FEfEl000z4bsKAA_74LWJgJz4KDICd2_csC-nf--6_UMpg','kWaUxNy1VoagXkOJLwRKSw',NULL,0,'2025-11-16 15:43:04.736','2025-11-19 05:19:35.973'),('cmi1vxphk0003ry3lxm0k5rk0','cmhxnqibq0000n3zb1nyhdaso','https://fcm.googleapis.com/fcm/send/ePz4X5hixLs:APA91bHrVdE4zMfj_DfkZJGkJ1NkcnR7ZDRpv_kGLTn4L57YAGFWnTXybVYUt7-v-LewRA3lEa_cC6l3FG0sIyZr6X70MtZvuXRlINEOFgYCq5TqOc1yO9_Ekutn2d6DNPDlN2eQpcJc','BLjwINFTiwjxsTGUoo51zdDRWrrTOVYGCV9J83sVw7ZiSI8z-It7KBCW72DO-XA4x6bRbrQ2VFLzvHHaS_fAylI','pTLhcspGQirfPK6DAJPOcQ',NULL,0,'2025-11-16 15:43:19.112','2025-11-19 05:21:14.664'),('cmi5k1bon00077hfqgdbtorsm','cmhxnqibq0000n3zb1nyhdaso','https://fcm.googleapis.com/fcm/send/eGvGDLW1Z4A:APA91bHIOxIljvPy7f9In2iRGSleYHzWuA-cnhuQ8Fj0qjkWQkuuh0Btt1Wm2kp4TqhTWvjwR4C3BfxzFE_QtuMDy5772MsAibCUAbgJZ2QpN1rhKCVsO8ChBlgI-piFReaYRa801nm1','BI6nbMJkvayxdgEr55qcLa5WTVrSPvaXz0s6NWf4Dz7gJ4DV2/ZxKAUPMaMfTaMNvm4AmVlq62ChSPX7yIIMxqE=','ceMKoqWIr/a9hzZgesea0w==','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-19 05:21:17.159','2025-11-19 05:21:30.187'),('cmi5k1q3s000b7hfqqh00202j','cmhxnqibq0000n3zb1nyhdaso','https://fcm.googleapis.com/fcm/send/fjA1OhKxos8:APA91bHZwe78BYANTizDSx5FW7ZWsPA7nBBfhooY9ca__oGke_a_CTT2tlJGIEuVphJLF-splPcSF1Nh6EHb5zt34-DcfTe2MtB1-B2B__ZVQ66dYrJqhCT7gfLUHdKly67NcyekHrXE','BOg9YbD3xys4IbQRM8L4SyfN3XR2xynoArIPAb4eZ4RRec97rbL525nGeJK8mJeMcqq8gUUzxgQ3NFYb78sd2z0=','mwoJTba++BgAJp1DhWYZIg==','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',0,'2025-11-19 05:21:35.848','2025-11-19 05:22:26.085'),('cmi5k2voc000f7hfq2qorqxef','cmhxnqibq0000n3zb1nyhdaso','https://fcm.googleapis.com/fcm/send/c7ehpL73GVQ:APA91bEYfNoBQlSrM_KmKWX8kuVfJlN1IUeGzoyibb_keVi7IVCQzB61FzQiJxrFnT9TnorxupyHUsaS-s-EX96Ss74euRC2mGuy5oEKC6a_Bjt9i25HzuoXPzdwR78Sm29KBpSC4Zvw','BOBOQX5bnyKIlkB0sEhaaXqEgR+wp0NjJOgtZZhCg5AywSdB0OwYwyJovyvbSwQQ/590mOpV+oF9U7TA8k2Fu7I=','cMd9bIV7hubecNwEakxzGw==','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',0,'2025-11-19 05:22:29.725','2025-11-19 05:22:54.385'),('cmi5k3rlo000j7hfq3sgoy6xi','cmhxnqibq0000n3zb1nyhdaso','https://fcm.googleapis.com/fcm/send/c-40WoFjVFI:APA91bE-uQ0BvTTeW_GF-FTdRYokSEmzTP1FOAcrmNbs9vSd2Xd5xJZEqD8G0I4AiSDf67cSKY_oN4Mn1QiNsvRyOM7x3iSfUQNElgDAnVV-ce0TH7iV0dfpRMvnOshD3keLobTGyzEB','BJrhkF36WO5LccMCEraSue9Vy8aO2NKr2rr9kXBrVY/JgZG/jdrVGuR8+zDCc9yvE5mVibC+1pejHVPYxAvhDPA=','1sPDc4YdE6bBsx6tE2qf+g==','Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',1,'2025-11-19 05:23:11.100','2025-11-19 05:23:11.100'),('cmi5kd9ic000t7hfq720cqqna','cmhy68hs50000g0xkj2slheo4','https://fcm.googleapis.com/fcm/send/c19kCpuYadA:APA91bHSwr8tsigbqiRbV3df4_K3Jj_-2cCyl4-sbJpSPrXUlj8KEuG5REWAtCC1PC2ohR9lir9HDQEYuq2BmsNJtwbl-mhgKFsslMfI-oa4HFBl_xKNEbykRCV9XuwTlnD4gkqw9-jN','BM6+kPv67deFIuKdnE03p+JwZ2xDPjCt2D9JQPyC/d8iuUhaDLcFPbotLU3OH4ifxdlY8ntUnw23puC4IpbcXbQ=','9mbs+cVUtRjh0A8Tn4HQpA==','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',1,'2025-11-19 05:30:34.212','2025-11-19 05:30:34.212');
/*!40000 ALTER TABLE `push_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_comments`
--

DROP TABLE IF EXISTS `recipe_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe_comments` (
  `id` varchar(191) NOT NULL,
  `recipeId` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `body` text NOT NULL,
  `status` enum('pending','visible','hidden') NOT NULL DEFAULT 'visible',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `recipe_comments_recipeId_createdAt_idx` (`recipeId`,`createdAt`),
  KEY `recipe_comments_authorId_idx` (`authorId`),
  KEY `recipe_comments_status_createdAt_idx` (`status`,`createdAt`),
  CONSTRAINT `recipe_comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipe_comments_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_comments`
--

LOCK TABLES `recipe_comments` WRITE;
/*!40000 ALTER TABLE `recipe_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_likes`
--

DROP TABLE IF EXISTS `recipe_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe_likes` (
  `id` varchar(191) NOT NULL,
  `recipeId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `recipe_likes_userId_recipeId_key` (`userId`,`recipeId`),
  KEY `recipe_likes_recipeId_idx` (`recipeId`),
  KEY `recipe_likes_userId_idx` (`userId`),
  CONSTRAINT `recipe_likes_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recipe_likes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_likes`
--

LOCK TABLES `recipe_likes` WRITE;
/*!40000 ALTER TABLE `recipe_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipe_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipes` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `ingredients` text NOT NULL,
  `instructions` text NOT NULL,
  `prepTime` int(11) DEFAULT NULL,
  `cookTime` int(11) DEFAULT NULL,
  `servings` int(11) NOT NULL DEFAULT 1,
  `calories` double DEFAULT NULL,
  `protein` double DEFAULT NULL,
  `carbs` double DEFAULT NULL,
  `fat` double DEFAULT NULL,
  `fiber` double DEFAULT NULL,
  `category` enum('breakfast','lunch','dinner','snack','dessert','drink','main','side','salad','soup') NOT NULL DEFAULT 'main',
  `mealType` enum('breakfast','lunch','dinner','snack') DEFAULT NULL,
  `tags` text DEFAULT NULL,
  `videoUrl` varchar(191) DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
  `status` enum('draft','pending','under_review','published','rejected') NOT NULL DEFAULT 'pending',
  `views` int(11) NOT NULL DEFAULT 0,
  `likesCount` int(11) NOT NULL DEFAULT 0,
  `commentsCount` int(11) NOT NULL DEFAULT 0,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `publishedAt` datetime(3) DEFAULT NULL,
  `images` text DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `recipes_slug_key` (`slug`),
  KEY `recipes_slug_idx` (`slug`),
  KEY `recipes_authorId_createdAt_idx` (`authorId`,`createdAt`),
  KEY `recipes_status_createdAt_idx` (`status`,`createdAt`),
  KEY `recipes_publishedAt_idx` (`publishedAt`),
  KEY `recipes_category_status_idx` (`category`,`status`),
  FULLTEXT KEY `recipes_title_description_idx` (`title`,`description`),
  CONSTRAINT `recipes_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referral_codes`
--

DROP TABLE IF EXISTS `referral_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `referral_codes` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `referral_codes_userId_key` (`userId`),
  UNIQUE KEY `referral_codes_code_key` (`code`),
  KEY `referral_codes_code_idx` (`code`),
  CONSTRAINT `referral_codes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referral_codes`
--

LOCK TABLES `referral_codes` WRITE;
/*!40000 ALTER TABLE `referral_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `referral_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `referrals` (
  `id` varchar(191) NOT NULL,
  `referrerId` varchar(191) NOT NULL,
  `referredId` varchar(191) NOT NULL,
  `bonusCoins` int(11) NOT NULL DEFAULT 50,
  `status` enum('pending','completed','expired') NOT NULL DEFAULT 'pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `completedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `referrals_referrerId_referredId_key` (`referrerId`,`referredId`),
  KEY `referrals_referrerId_idx` (`referrerId`),
  KEY `referrals_referredId_idx` (`referredId`),
  KEY `referrals_status_idx` (`status`),
  CONSTRAINT `referrals_referredId_fkey` FOREIGN KEY (`referredId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `referrals_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrals`
--

LOCK TABLES `referrals` WRITE;
/*!40000 ALTER TABLE `referrals` DISABLE KEYS */;
/*!40000 ALTER TABLE `referrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `retention_metrics`
--

DROP TABLE IF EXISTS `retention_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `retention_metrics` (
  `id` varchar(191) NOT NULL,
  `cohortId` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `dayNumber` int(11) NOT NULL,
  `retained` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `rate` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `retention_metrics_cohortId_date_dayNumber_key` (`cohortId`,`date`,`dayNumber`),
  KEY `retention_metrics_cohortId_dayNumber_idx` (`cohortId`,`dayNumber`),
  KEY `retention_metrics_date_idx` (`date`),
  CONSTRAINT `retention_metrics_cohortId_fkey` FOREIGN KEY (`cohortId`) REFERENCES `cohort_definitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `retention_metrics`
--

LOCK TABLES `retention_metrics` WRITE;
/*!40000 ALTER TABLE `retention_metrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `retention_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_permissions` (
  `id` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL,
  `resource` varchar(191) NOT NULL,
  `action` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_resource_action_key` (`role`,`resource`,`action`),
  KEY `role_permissions_role_idx` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seasonal_themes`
--

DROP TABLE IF EXISTS `seasonal_themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seasonal_themes` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `category` varchar(191) NOT NULL,
  `icon` varchar(191) NOT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `seasonal_themes_isActive_startDate_endDate_idx` (`isActive`,`startDate`,`endDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seasonal_themes`
--

LOCK TABLES `seasonal_themes` WRITE;
/*!40000 ALTER TABLE `seasonal_themes` DISABLE KEYS */;
/*!40000 ALTER TABLE `seasonal_themes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seasons`
--

DROP TABLE IF EXISTS `seasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seasons` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `seasons_isActive_idx` (`isActive`),
  KEY `seasons_startDate_endDate_idx` (`startDate`,`endDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seasons`
--

LOCK TABLES `seasons` WRITE;
/*!40000 ALTER TABLE `seasons` DISABLE KEYS */;
INSERT INTO `seasons` VALUES ('default-season','Kasım 2025 Sezonu','Yarış, puan kazan ve ligde yüksel!','2025-10-31 21:00:00.000','2025-11-30 20:59:59.000',1,'2025-11-17 01:19:40.056','2025-11-17 01:19:40.056'),('season-2024-01','Kasım 2025','İlk sezon!','2025-10-31 21:00:00.000','2025-11-29 21:00:00.000',1,'2025-11-15 01:30:28.844','2025-11-17 03:15:47.688');
/*!40000 ALTER TABLE `seasons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sessions_sessionToken_key` (`sessionToken`),
  KEY `sessions_userId_idx` (`userId`),
  CONSTRAINT `sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` text NOT NULL,
  `category` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_key` (`key`),
  KEY `settings_category_idx` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES ('cmhy48z3s0000nyxl0v6f08de','contactEmail','info@zayiflamaplan.com','general','2025-11-14 00:24:57.000','2025-11-14 00:30:16.463'),('cmhy48z3s0001nyxlfo6enjcs','siteUrl','https://zayiflamaplanim.com','general','2025-11-14 00:24:57.000','2025-11-14 00:30:16.463'),('cmhy48z3s0002nyxli3kpbzdf','siteName','ZayiflamaPlanim','general','2025-11-14 00:24:57.000','2025-11-14 00:30:16.463'),('cmhy48z3s0003nyxl44tln7n3','siteDescription','Gerçek insanların gerçek zayıflama planları','general','2025-11-14 00:24:57.016','2025-11-14 00:30:16.463'),('cmhy4fzp6000knyxl17lf1ai1','seoTitle','ZayiflamaPlanim - Gerçek İnsanların Gerçek Planları','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378'),('cmhy4fzp6000lnyxlu4wtcm3c','seoDescription','Gerçek insanların gerçek zayıflama planlarını paylaştığı, topluluk destekli platform. Kilo verme yolculuğunda sana ilham verecek planları keşfet.','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378'),('cmhy4fzp6000mnyxl49ievg4b','twitterHandle','@zayiflamaplan','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378'),('cmhy4fzp6000nnyxlcqk1ms28','googleSiteVerification','','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378'),('cmhy4fzp6000onyxlml9jp8gz','robotsTxt','User-agent: *\nAllow: /','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378'),('cmhy4fzp6000pnyxlw00gsy7p','ogImage','/og-image.jpg','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378'),('cmhy4fzp6000qnyxl1yidluut','googleAnalytics','','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378'),('cmhy4fzp6000rnyxlhik5fhxc','seoKeywords','zayıflama, diyet, kilo verme, sağlıklı yaşam, fitness','seo','2025-11-14 00:30:24.378','2025-11-14 00:30:24.378');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_items`
--

DROP TABLE IF EXISTS `shop_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shop_items` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(191) NOT NULL,
  `category` enum('cosmetic','boost','recovery','special') NOT NULL DEFAULT 'cosmetic',
  `price` int(11) NOT NULL,
  `stock` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `metadata` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_items_key_key` (`key`),
  KEY `shop_items_category_idx` (`category`),
  KEY `shop_items_isActive_idx` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_items`
--

LOCK TABLES `shop_items` WRITE;
/*!40000 ALTER TABLE `shop_items` DISABLE KEYS */;
INSERT INTO `shop_items` VALUES ('cmhzm13ke000j9tn4ev9zxhsc','avatar_frame_gold','Altın Çerçeve','Profiline altın çerçeve ekle','🖼️','cosmetic',100,NULL,1,1,NULL,'2025-11-15 01:30:28.815','2025-11-17 03:15:47.663'),('cmhzm13kj000k9tn4ep1xq2gg','profile_theme_dark','Karanlık Tema','Özel karanlık profil teması','🌙','cosmetic',50,NULL,1,2,NULL,'2025-11-15 01:30:28.819','2025-11-17 03:15:47.665'),('cmhzm13km000l9tn4g1okj8tc','badge_showcase','Rozet Vitrini','Profilinde 10 rozet göster','🏆','cosmetic',150,NULL,1,3,NULL,'2025-11-15 01:30:28.823','2025-11-17 03:15:47.667'),('cmhzm13kp000m9tn4gih328ms','xp_boost_2x','2x XP Boost','24 saat boyunca 2x XP kazan','⚡','boost',200,NULL,1,1,NULL,'2025-11-15 01:30:28.825','2025-11-17 03:15:47.670'),('cmhzm13kr000n9tn4yq6wmqap','coin_boost_2x','2x Coin Boost','24 saat boyunca 2x coin kazan','💰','boost',200,NULL,1,2,NULL,'2025-11-15 01:30:28.827','2025-11-17 03:15:47.672'),('cmhzm13kt000o9tn4xwtvmmyc','streak_freeze','Seri Dondurma','1 gün seri kaybını engelle','❄️','recovery',50,NULL,1,1,NULL,'2025-11-15 01:30:28.829','2025-11-17 03:15:47.674'),('cmi0olrqx00026er30sdgkm8k','profile_frame_gold','Altın Çerçeve','Profiline özel altın çerçeve ekle','🏆','cosmetic',500,NULL,1,0,'{\"color\":\"gold\",\"rarity\":\"epic\"}','2025-11-15 19:30:18.681','2025-11-15 19:30:18.681'),('cmi0olrr300036er3uchmudx8','profile_frame_silver','Gümüş Çerçeve','Profiline özel gümüş çerçeve ekle','🥈','cosmetic',250,NULL,1,0,'{\"color\":\"silver\",\"rarity\":\"rare\"}','2025-11-15 19:30:18.687','2025-11-15 19:30:18.687'),('cmi0olrr800066er3lhc4aya4','custom_badge','Özel Rozet','Kendi özel rozetini oluştur','🎨','special',1000,50,1,0,'{\"customizable\":true}','2025-11-15 19:30:18.693','2025-11-15 19:30:18.693'),('cmi0olrrb00076er3f4yc2bz3','name_color_rainbow','Gökkuşağı İsim','İsmini gökkuşağı renginde göster','🌈','cosmetic',400,NULL,1,0,'{\"effect\":\"rainbow\"}','2025-11-15 19:30:18.695','2025-11-15 19:30:18.695'),('cmi2dpib30004emm9h67tkiyo','profile_frame_diamond','Elmas Çerçeve','En nadir çerçeve! Profilinde parla','💎','cosmetic',1000,NULL,1,3,'{\"color\":\"diamond\",\"rarity\":\"legendary\",\"type\":\"frame\"}','2025-11-17 00:00:49.648','2025-11-17 00:00:49.648'),('cmi2dpib70005emm96bf5yr8x','profile_frame_rainbow','Gökkuşağı Çerçeve','Renkli ve eğlenceli çerçeve','🌈','cosmetic',600,NULL,1,4,'{\"color\":\"rainbow\",\"rarity\":\"epic\",\"type\":\"frame\"}','2025-11-17 00:00:49.651','2025-11-17 00:00:49.651'),('cmi2dpib90006emm9mudz7qwe','profile_frame_fire','Ateş Çerçeve','Profilini ateşle çevrele!','🔥','cosmetic',450,NULL,1,5,'{\"color\":\"fire\",\"rarity\":\"epic\",\"type\":\"frame\"}','2025-11-17 00:00:49.654','2025-11-17 00:00:49.654'),('cmi2dpibc0007emm90axu5myp','profile_frame_ice','Buz Çerçeve','Soğuk ve havalı görün','❄️','cosmetic',450,NULL,1,6,'{\"color\":\"ice\",\"rarity\":\"epic\",\"type\":\"frame\"}','2025-11-17 00:00:49.656','2025-11-17 00:00:49.656'),('cmi2dpibf0009emm9uidpii4m','name_color_gold','Altın İsim','İsmini altın renginde göster','✨','cosmetic',350,NULL,1,11,'{\"effect\":\"gold\",\"type\":\"nameColor\"}','2025-11-17 00:00:49.659','2025-11-17 00:00:49.659'),('cmi2dpibh000aemm9trqngxgh','name_color_red','Kırmızı İsim','İsmini kırmızı renginde göster','❤️','cosmetic',200,NULL,1,12,'{\"effect\":\"red\",\"type\":\"nameColor\"}','2025-11-17 00:00:49.662','2025-11-17 00:00:49.662'),('cmi2dpibj000bemm9g7pc13mo','name_color_blue','Mavi İsim','İsmini mavi renginde göster','💙','cosmetic',200,NULL,1,13,'{\"effect\":\"blue\",\"type\":\"nameColor\"}','2025-11-17 00:00:49.664','2025-11-17 00:00:49.664'),('cmi2dpibl000cemm9rcjazdd6','name_color_purple','Mor İsim','İsmini mor renginde göster','💜','cosmetic',200,NULL,1,14,'{\"effect\":\"purple\",\"type\":\"nameColor\"}','2025-11-17 00:00:49.666','2025-11-17 00:00:49.666'),('cmi2dpibo000demm96p7b9u6q','theme_dark','Karanlık Tema','Profiline karanlık tema uygula','🌙','cosmetic',300,NULL,1,20,'{\"theme\":\"dark\",\"type\":\"theme\"}','2025-11-17 00:00:49.668','2025-11-17 00:00:49.668'),('cmi2dpibq000eemm9sx7w59w5','theme_ocean','Okyanus Teması','Profiline okyanus teması uygula','🌊','cosmetic',350,NULL,1,21,'{\"theme\":\"ocean\",\"type\":\"theme\"}','2025-11-17 00:00:49.671','2025-11-17 00:00:49.671'),('cmi2dpibt000femm9rlvxgfnw','theme_sunset','Gün Batımı Teması','Profiline gün batımı teması uygula','🌅','cosmetic',350,NULL,1,22,'{\"theme\":\"sunset\",\"type\":\"theme\"}','2025-11-17 00:00:49.673','2025-11-17 00:00:49.673'),('cmi2dpibv000gemm9ii7d4lb5','theme_forest','Orman Teması','Profiline orman teması uygula','🌲','cosmetic',350,NULL,1,23,'{\"theme\":\"forest\",\"type\":\"theme\"}','2025-11-17 00:00:49.675','2025-11-17 00:00:49.675'),('cmi2dpiby000iemm9tqg0t9t9','xp_boost_3x','3x XP Boost','12 saat boyunca 3 kat XP kazan','⚡⚡','boost',500,NULL,1,31,'{\"duration\":12,\"multiplier\":3,\"type\":\"xpBoost\"}','2025-11-17 00:00:49.678','2025-11-17 00:00:49.678'),('cmi2dpic2000lemm9otbggczr','streak_freeze_3','3x Seri Dondurma','3 gün seri kaybını engelle','❄️❄️❄️','recovery',250,NULL,1,41,'{\"days\":3,\"type\":\"streakFreeze\"}','2025-11-17 00:00:49.682','2025-11-17 00:00:49.682'),('cmi2dpic4000nemm9bnkkwpo0','title_champion','Şampiyon Unvanı','Profilinde \"Şampiyon\" unvanını göster','👑','special',800,NULL,1,51,'{\"title\":\"Şampiyon\",\"type\":\"title\"}','2025-11-17 00:00:49.685','2025-11-17 00:00:49.685'),('cmi2dpic6000oemm9ofj4r7p7','title_legend','Efsane Unvanı','Profilinde \"Efsane\" unvanını göster','⭐','special',1200,NULL,1,52,'{\"title\":\"Efsane\",\"type\":\"title\"}','2025-11-17 00:00:49.687','2025-11-17 00:00:49.687'),('cmi2dpic8000pemm9sjsjjpnu','title_master','Usta Unvanı','Profilinde \"Usta\" unvanını göster','🎯','special',600,NULL,1,53,'{\"title\":\"Usta\",\"type\":\"title\"}','2025-11-17 00:00:49.689','2025-11-17 00:00:49.689'),('cmi2dpica000qemm96z1ncmay','title_warrior','Savaşçı Unvanı','Profilinde \"Savaşçı\" unvanını göster','⚔️','special',500,NULL,1,54,'{\"title\":\"Savaşçı\",\"type\":\"title\"}','2025-11-17 00:00:49.691','2025-11-17 00:00:49.691'),('cmi2dpicc000remm95216upzo','custom_emoji','Özel Emoji','Profilinde özel emoji kullan','😎','special',300,NULL,1,55,'{\"customizable\":true,\"type\":\"emoji\"}','2025-11-17 00:00:49.693','2025-11-17 00:00:49.693');
/*!40000 ALTER TABLE `shop_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sin_badges`
--

DROP TABLE IF EXISTS `sin_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sin_badges` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(191) NOT NULL,
  `sinType` enum('tatli','fastfood','gazli','alkol','diger') DEFAULT NULL,
  `requirement` text NOT NULL,
  `xpReward` int(11) NOT NULL DEFAULT 0,
  `coinReward` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sin_badges_key_key` (`key`),
  KEY `sin_badges_isActive_idx` (`isActive`),
  KEY `sin_badges_sinType_idx` (`sinType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sin_badges`
--

LOCK TABLES `sin_badges` WRITE;
/*!40000 ALTER TABLE `sin_badges` DISABLE KEYS */;
INSERT INTO `sin_badges` VALUES ('cmi4snlpv000010bmx5hhqmgj','glukozsuz_kahraman','Glukozsuz Kahraman 🥇','7 gün boyunca tatlı yemeden direndi','🥇','tatli','7 gün tatlı yememek',100,50,1,0,'2025-11-18 16:34:47.348','2025-11-18 16:34:47.348'),('cmi4snlpz000110bmliaeze44','yagsavar','Yağsavar 🥈','1 ay boyunca fast food yemedi','🥈','fastfood','30 gün fast food yememek',200,100,1,0,'2025-11-18 16:34:47.351','2025-11-18 16:34:47.351'),('cmi4snlq2000210bm8scfd7l3','dengeli_dahi','Dengeli Dahi 🥉','Kaçamak sonrası 3 gün telafi yaptı','🥉',NULL,'Kaçamak sonrası 3 gün temiz',50,25,1,0,'2025-11-18 16:34:47.354','2025-11-18 16:34:47.354'),('cmi4snlq4000310bmb4vfe1xv','gizli_tatlici','Gizli Tatlıcı 🍩','Aynı gün iki tatlı girdi (mizah rozeti)','🍩','tatli','Aynı gün 2+ tatlı',10,5,1,0,'2025-11-18 16:34:47.356','2025-11-18 16:34:47.356'),('cmi4snlq6000410bm2jhcmfxn','motivasyon_melegi','Motivasyon Meleği 😇','10 gün üst üste günah işlemedi','😇',NULL,'10 gün temiz',150,75,1,0,'2025-11-18 16:34:47.359','2025-11-18 16:34:47.359'),('cmi4v4l1o000012imj6rz9hf3','streak_3','🔥 3 Gün Ateşi','3 gün üst üste temiz kaldın! Harika başlangıç!','🔥',NULL,'3 gün üst üste günah yapmadan geç',50,10,1,0,'2025-11-18 17:43:58.861','2025-11-18 17:43:58.861'),('cmi4v4l28000112im73miyj17','streak_7','🔥 1 Hafta Şampiyonu','1 hafta boyunca hiç günah yapmadın! İnanılmaz disiplin!','🔥',NULL,'7 gün üst üste günah yapmadan geç',100,25,1,0,'2025-11-18 17:43:58.881','2025-11-18 17:43:58.881'),('cmi4v4l2e000212imon94dd59','streak_14','🔥 2 Hafta Efsanesi','2 hafta temiz! Sen bir efsanesin!','🔥',NULL,'14 gün üst üste günah yapmadan geç',200,50,1,0,'2025-11-18 17:43:58.886','2025-11-18 17:43:58.886'),('cmi4v4l2g000312imd1ahtaxi','streak_30','🔥 1 Ay Ustası','Tam 1 ay! Artık bu bir yaşam tarzı!','🔥',NULL,'30 gün üst üste günah yapmadan geç',500,100,1,0,'2025-11-18 17:43:58.889','2025-11-18 17:43:58.889'),('cmi4v4l2k000412imp8pyw9ln','streak_60','🔥 2 Ay Titanı','2 ay boyunca mükemmel! Seni durduramaz!','🔥',NULL,'60 gün üst üste günah yapmadan geç',1000,200,1,0,'2025-11-18 17:43:58.892','2025-11-18 17:43:58.892'),('cmi4v4l2m000512impphghh18','streak_90','🔥 3 Ay Tanrısı','3 ay! Sen artık bir tanrısın!','🔥',NULL,'90 gün üst üste günah yapmadan geç',2000,500,1,0,'2025-11-18 17:43:58.894','2025-11-18 17:43:58.894'),('cmi4v4l2p000612im47711y6c','streak_180','🔥 6 Ay Efsanesi','Yarım yıl! İnanılmaz bir başarı!','🔥',NULL,'180 gün üst üste günah yapmadan geç',5000,1000,1,0,'2025-11-18 17:43:58.897','2025-11-18 17:43:58.897'),('cmi4v4l2r000712iml8x8l7i3','streak_365','👑 1 Yıl Kralı','TAM 1 YIL! Sen bir kralsın! 👑','👑',NULL,'365 gün üst üste günah yapmadan geç',10000,2500,1,0,'2025-11-18 17:43:58.900','2025-11-18 17:43:58.900');
/*!40000 ALTER TABLE `sin_badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sin_challenges`
--

DROP TABLE IF EXISTS `sin_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sin_challenges` (
  `id` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `sinType` enum('tatli','fastfood','gazli','alkol','diger') DEFAULT NULL,
  `targetDays` int(11) NOT NULL,
  `maxSins` int(11) NOT NULL,
  `xpReward` int(11) NOT NULL DEFAULT 0,
  `coinReward` int(11) NOT NULL DEFAULT 0,
  `startDate` datetime(3) NOT NULL,
  `endDate` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sin_challenges_isActive_startDate_endDate_idx` (`isActive`,`startDate`,`endDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sin_challenges`
--

LOCK TABLES `sin_challenges` WRITE;
/*!40000 ALTER TABLE `sin_challenges` DISABLE KEYS */;
/*!40000 ALTER TABLE `sin_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sin_reactions`
--

DROP TABLE IF EXISTS `sin_reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sin_reactions` (
  `id` varchar(191) NOT NULL,
  `sinType` enum('tatli','fastfood','gazli','alkol','diger') NOT NULL,
  `reactionText` text NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `usageCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sin_reactions_sinType_isActive_idx` (`sinType`,`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sin_reactions`
--

LOCK TABLES `sin_reactions` WRITE;
/*!40000 ALTER TABLE `sin_reactions` DISABLE KEYS */;
INSERT INTO `sin_reactions` VALUES ('alkol_15','alkol','Su içmeyi unutma dostum 💧',1,0,'2025-11-18 16:34:47.326','2025-11-18 16:34:47.326'),('alkol_16','alkol','Bir yudum keyif, ama sabah pişmanlık bonusu 😅',1,0,'2025-11-18 16:34:47.328','2025-11-18 16:34:47.328'),('alkol_17','alkol','Kadeh kaldırmışsın, motivasyon düşmüş 🍷',1,0,'2025-11-18 16:34:47.330','2025-11-18 16:34:47.330'),('alkol_18','alkol','Şerefe! Ama yarın spor şart 🏃',1,0,'2025-11-18 16:34:47.332','2025-11-18 16:34:47.332'),('alkol_19','alkol','Alkol alındı, kalori sayacı ağladı 😢',1,0,'2025-11-18 16:34:47.335','2025-11-18 16:34:47.335'),('diger_20','diger','Bu kategoriye özel günah icat ettin resmen 😈',1,0,'2025-11-18 16:34:47.337','2025-11-18 16:34:47.337'),('diger_21','diger','Karnın tok, vicdanın yumuşak olsun 🍽️',1,0,'2025-11-18 16:34:47.339','2025-11-18 16:34:47.339'),('diger_22','diger','Yaratıcı günah işliyorsun 🎨',1,0,'2025-11-18 16:34:47.341','2025-11-18 16:34:47.341'),('diger_23','diger','Bu ne biçim kaçamak böyle? 🤔',1,0,'2025-11-18 16:34:47.343','2025-11-18 16:34:47.343'),('diger_24','diger','Sınıflandırılamaz ama affedilebilir 😇',1,0,'2025-11-18 16:34:47.345','2025-11-18 16:34:47.345'),('fastfood_5','fastfood','Patates kızartması seni kandırıyor 👀',1,0,'2025-11-18 16:34:47.304','2025-11-18 16:34:47.304'),('fastfood_6','fastfood','Fast food: hızlı gelir, yavaş gider 🍟',1,0,'2025-11-18 16:34:47.307','2025-11-18 16:34:47.307'),('fastfood_7','fastfood','Köfte burger savaşı yine başladı ⚔️',1,0,'2025-11-18 16:34:47.309','2025-11-18 16:34:47.309'),('fastfood_8','fastfood','Drive-thru vicdanını da götürmüş 🚗',1,0,'2025-11-18 16:34:47.311','2025-11-18 16:34:47.311'),('fastfood_9','fastfood','Menü büyük, pişmanlık daha büyük 🍔',1,0,'2025-11-18 16:34:47.313','2025-11-18 16:34:47.313'),('gazli_10','gazli','Köpük değil, motivasyon patlasın 🥂',1,0,'2025-11-18 16:34:47.315','2025-11-18 16:34:47.315'),('gazli_11','gazli','Bardağın yarısı şeker dolu 😜',1,0,'2025-11-18 16:34:47.317','2025-11-18 16:34:47.317'),('gazli_12','gazli','Gaz gibi motive ol 💨',1,0,'2025-11-18 16:34:47.320','2025-11-18 16:34:47.320'),('gazli_13','gazli','Kabarcıklar vicdanını gıdıklıyor 🫧',1,0,'2025-11-18 16:34:47.322','2025-11-18 16:34:47.322'),('gazli_14','gazli','Zero değil, hero olacaktın 🦸',1,0,'2025-11-18 16:34:47.324','2025-11-18 16:34:47.324'),('tatli_0','tatli','Tatlı da haklı… ama sen daha haklısın 🍫',1,0,'2025-11-18 16:34:47.284','2025-11-18 16:34:47.284'),('tatli_1','tatli','Bir dilimle başladı, bir pasta bitti 🎂',1,0,'2025-11-18 16:34:47.294','2025-11-18 16:34:47.294'),('tatli_2','tatli','Şeker kanına değil, kalbine dokunmuş belli 💘',1,0,'2025-11-18 16:34:47.296','2025-11-18 16:34:47.296'),('tatli_3','tatli','Tatlı tatlı günah işlemişsin 😋',1,1,'2025-11-18 16:34:47.300','2025-11-18 18:46:35.129'),('tatli_4','tatli','Şeker orucu yarın başlar artık 🙈',1,0,'2025-11-18 16:34:47.302','2025-11-18 16:34:47.302');
/*!40000 ALTER TABLE `sin_reactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sin_weekly_summaries`
--

DROP TABLE IF EXISTS `sin_weekly_summaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sin_weekly_summaries` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `weekStart` datetime(3) NOT NULL,
  `weekEnd` datetime(3) NOT NULL,
  `totalSins` int(11) NOT NULL DEFAULT 0,
  `cleanDays` int(11) NOT NULL DEFAULT 0,
  `mostCommonSin` enum('tatli','fastfood','gazli','alkol','diger') DEFAULT NULL,
  `sinBreakdown` text DEFAULT NULL,
  `aiSummary` text DEFAULT NULL,
  `motivationBar` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sin_weekly_summaries_userId_weekStart_key` (`userId`,`weekStart`),
  KEY `sin_weekly_summaries_userId_weekStart_idx` (`userId`,`weekStart`),
  CONSTRAINT `sin_weekly_summaries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sin_weekly_summaries`
--

LOCK TABLES `sin_weekly_summaries` WRITE;
/*!40000 ALTER TABLE `sin_weekly_summaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `sin_weekly_summaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smart_reminders`
--

DROP TABLE IF EXISTS `smart_reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smart_reminders` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `reminderType` varchar(50) NOT NULL,
  `optimalTime` varchar(5) NOT NULL,
  `frequency` varchar(20) NOT NULL DEFAULT 'daily',
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `lastSentAt` datetime(3) DEFAULT NULL,
  `nextSendAt` datetime(3) DEFAULT NULL,
  `clickRate` double NOT NULL DEFAULT 0,
  `totalSent` int(11) NOT NULL DEFAULT 0,
  `totalClicked` int(11) NOT NULL DEFAULT 0,
  `metadata` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `smart_reminders_userId_reminderType_key` (`userId`,`reminderType`),
  KEY `smart_reminders_userId_enabled_idx` (`userId`,`enabled`),
  KEY `smart_reminders_nextSendAt_enabled_idx` (`nextSendAt`,`enabled`),
  KEY `smart_reminders_reminderType_idx` (`reminderType`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smart_reminders`
--

LOCK TABLES `smart_reminders` WRITE;
/*!40000 ALTER TABLE `smart_reminders` DISABLE KEYS */;
/*!40000 ALTER TABLE `smart_reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streak_recoveries`
--

DROP TABLE IF EXISTS `streak_recoveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `streak_recoveries` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `streakLost` int(11) NOT NULL,
  `coinsCost` int(11) NOT NULL,
  `recoveredAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `streak_recoveries_userId_recoveredAt_idx` (`userId`,`recoveredAt`),
  CONSTRAINT `streak_recoveries_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streak_recoveries`
--

LOCK TABLES `streak_recoveries` WRITE;
/*!40000 ALTER TABLE `streak_recoveries` DISABLE KEYS */;
/*!40000 ALTER TABLE `streak_recoveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_badges`
--

DROP TABLE IF EXISTS `user_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_badges` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `badgeId` varchar(191) NOT NULL,
  `earnedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_badges_userId_badgeId_key` (`userId`,`badgeId`),
  KEY `user_badges_userId_earnedAt_idx` (`userId`,`earnedAt`),
  KEY `user_badges_badgeId_idx` (`badgeId`),
  CONSTRAINT `user_badges_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `badges` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_badges_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_badges`
--

LOCK TABLES `user_badges` WRITE;
/*!40000 ALTER TABLE `user_badges` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_battle_passes`
--

DROP TABLE IF EXISTS `user_battle_passes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_battle_passes` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `passId` varchar(191) NOT NULL,
  `currentLevel` int(11) NOT NULL DEFAULT 1,
  `xpEarned` int(11) NOT NULL DEFAULT 0,
  `isPremium` tinyint(1) NOT NULL DEFAULT 0,
  `purchasedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_battle_passes_userId_passId_key` (`userId`,`passId`),
  KEY `user_battle_passes_passId_currentLevel_idx` (`passId`,`currentLevel`),
  CONSTRAINT `user_battle_passes_passId_fkey` FOREIGN KEY (`passId`) REFERENCES `battle_passes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_battle_passes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_battle_passes`
--

LOCK TABLES `user_battle_passes` WRITE;
/*!40000 ALTER TABLE `user_battle_passes` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_battle_passes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_cohorts`
--

DROP TABLE IF EXISTS `user_cohorts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_cohorts` (
  `id` varchar(191) NOT NULL,
  `cohortId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `addedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_cohorts_cohortId_userId_key` (`cohortId`,`userId`),
  KEY `user_cohorts_userId_idx` (`userId`),
  KEY `user_cohorts_cohortId_addedAt_idx` (`cohortId`,`addedAt`),
  CONSTRAINT `user_cohorts_cohortId_fkey` FOREIGN KEY (`cohortId`) REFERENCES `cohort_definitions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_cohorts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_cohorts`
--

LOCK TABLES `user_cohorts` WRITE;
/*!40000 ALTER TABLE `user_cohorts` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_cohorts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_daily_quests`
--

DROP TABLE IF EXISTS `user_daily_quests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_daily_quests` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `questId` varchar(191) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completedAt` datetime(3) DEFAULT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_daily_quests_userId_questId_date_key` (`userId`,`questId`,`date`),
  KEY `user_daily_quests_userId_date_idx` (`userId`,`date`),
  KEY `user_daily_quests_questId_idx` (`questId`),
  KEY `user_daily_quests_completed_idx` (`completed`),
  CONSTRAINT `user_daily_quests_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `daily_quests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_daily_quests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_daily_quests`
--

LOCK TABLES `user_daily_quests` WRITE;
/*!40000 ALTER TABLE `user_daily_quests` DISABLE KEYS */;
INSERT INTO `user_daily_quests` VALUES ('cmi2d5vd7004aknwptne9las9','cmhxnqibq0000n3zb1nyhdaso','cmhzm13k7000g9tn4523u88kq',8,1,'2025-11-16 23:45:43.025','2025-11-16 21:00:00.000','2025-11-16 23:45:33.451'),('cmi2h8lfe0004vgl4j7m4dr9c','cmhy68hs50000g0xkj2slheo4','cmhzm13kc000i9tn4ipnmnco4',1,0,NULL,'2025-11-16 21:00:00.000','2025-11-17 01:39:39.003'),('cmi632fhk0001qxi16bulkddw','cmhxnqibq0000n3zb1nyhdaso','cmhzm13k1000e9tn4qqc3tthc',1,1,'2025-11-19 14:17:27.745','2025-11-18 21:00:00.000','2025-11-19 14:14:01.448');
/*!40000 ALTER TABLE `user_daily_quests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_leagues`
--

DROP TABLE IF EXISTS `user_leagues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_leagues` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `leagueId` varchar(191) NOT NULL,
  `seasonId` varchar(191) NOT NULL,
  `points` int(11) NOT NULL DEFAULT 0,
  `rank` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_leagues_userId_seasonId_key` (`userId`,`seasonId`),
  KEY `user_leagues_seasonId_points_idx` (`seasonId`,`points`),
  KEY `user_leagues_leagueId_points_idx` (`leagueId`,`points`),
  CONSTRAINT `user_leagues_leagueId_fkey` FOREIGN KEY (`leagueId`) REFERENCES `leagues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_leagues_seasonId_fkey` FOREIGN KEY (`seasonId`) REFERENCES `seasons` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_leagues_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_leagues`
--

LOCK TABLES `user_leagues` WRITE;
/*!40000 ALTER TABLE `user_leagues` DISABLE KEYS */;
INSERT INTO `user_leagues` VALUES ('cmi2gnjw500011022rghys6y3','cmhxnqieu0001n3zbnqndm9rn','cmi2giwbr000z2pqmkrt88j6g','default-season',5200,NULL,'2025-11-17 01:23:17.237','2025-11-17 01:25:32.394'),('cmi636uqp0005qxi18h0oloev','cmhxnqibq0000n3zb1nyhdaso','cmi2giwbi000t2pqmmp40zl70','default-season',10,NULL,'2025-11-19 14:17:27.842','2025-11-19 14:17:27.846');
/*!40000 ALTER TABLE `user_leagues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_purchases`
--

DROP TABLE IF EXISTS `user_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_purchases` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `itemId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `totalPrice` int(11) NOT NULL,
  `purchasedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `user_purchases_userId_purchasedAt_idx` (`userId`,`purchasedAt`),
  KEY `user_purchases_itemId_idx` (`itemId`),
  CONSTRAINT `user_purchases_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `shop_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_purchases_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_purchases`
--

LOCK TABLES `user_purchases` WRITE;
/*!40000 ALTER TABLE `user_purchases` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sin_badges`
--

DROP TABLE IF EXISTS `user_sin_badges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_sin_badges` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `badgeId` varchar(191) NOT NULL,
  `earnedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_sin_badges_userId_badgeId_key` (`userId`,`badgeId`),
  KEY `user_sin_badges_userId_earnedAt_idx` (`userId`,`earnedAt`),
  KEY `user_sin_badges_badgeId_idx` (`badgeId`),
  CONSTRAINT `user_sin_badges_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `sin_badges` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sin_badges_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sin_badges`
--

LOCK TABLES `user_sin_badges` WRITE;
/*!40000 ALTER TABLE `user_sin_badges` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sin_badges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sin_challenges`
--

DROP TABLE IF EXISTS `user_sin_challenges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_sin_challenges` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `challengeId` varchar(191) NOT NULL,
  `progress` int(11) NOT NULL DEFAULT 0,
  `completed` tinyint(1) NOT NULL DEFAULT 0,
  `completedAt` datetime(3) DEFAULT NULL,
  `joinedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_sin_challenges_userId_challengeId_key` (`userId`,`challengeId`),
  KEY `user_sin_challenges_userId_completed_idx` (`userId`,`completed`),
  KEY `user_sin_challenges_challengeId_idx` (`challengeId`),
  CONSTRAINT `user_sin_challenges_challengeId_fkey` FOREIGN KEY (`challengeId`) REFERENCES `sin_challenges` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_sin_challenges_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sin_challenges`
--

LOCK TABLES `user_sin_challenges` WRITE;
/*!40000 ALTER TABLE `user_sin_challenges` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sin_challenges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `username` varchar(191) DEFAULT NULL,
  `passwordHash` varchar(191) DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER',
  `currentWeight` double DEFAULT NULL,
  `targetWeight` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `isBanned` tinyint(1) NOT NULL DEFAULT 0,
  `coins` int(11) NOT NULL DEFAULT 0,
  `lastCheckIn` datetime(3) DEFAULT NULL,
  `level` int(11) NOT NULL DEFAULT 1,
  `reputationScore` int(11) NOT NULL DEFAULT 0,
  `streak` int(11) NOT NULL DEFAULT 0,
  `xp` int(11) NOT NULL DEFAULT 0,
  `banReason` text DEFAULT NULL,
  `bannedUntil` datetime(3) DEFAULT NULL,
  `activeTitle` varchar(191) DEFAULT NULL,
  `coinBoostUntil` datetime(3) DEFAULT NULL,
  `customEmoji` varchar(191) DEFAULT NULL,
  `nameColor` varchar(191) DEFAULT NULL,
  `profileBadge` varchar(191) DEFAULT NULL,
  `profileFrame` varchar(191) DEFAULT NULL,
  `profileTheme` varchar(191) DEFAULT NULL,
  `streakFreezeCount` int(11) NOT NULL DEFAULT 0,
  `xpBoostUntil` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_username_key` (`username`),
  KEY `users_email_idx` (`email`),
  KEY `users_username_idx` (`username`),
  KEY `users_role_idx` (`role`),
  KEY `users_createdAt_idx` (`createdAt`),
  KEY `users_xp_idx` (`xp`),
  KEY `users_level_idx` (`level`),
  KEY `users_reputationScore_idx` (`reputationScore`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('cmhxnqibq0000n3zb1nyhdaso','admin@zayiflamaplan.com','adminuser','$2a$10$2m./ql6cr/XJhB6JfKbp8OyT3rfK31cyNErAUdGMDSzMzNmuZZff6','Admin','ZayiflamaPlanim.com','/maskot/1.png','ADMIN',63,60,173,'2025-11-13 16:42:41.570','2025-11-13 16:42:41.604','2025-11-19 14:17:27.792',0,15,'2025-11-19 14:14:01.429',1,5,1,75,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),('cmhxnqieu0001n3zbnqndm9rn','test@example.com','testuser','$2a$10$O1HXIWgQaVaMz2ClqD3EOO8/EU4h9Nj/gDJGC5.6cUamjTPGvOy3a','Test User',NULL,NULL,'USER',80,60,175,'2025-11-13 16:42:41.716','2025-11-13 16:42:41.718','2025-11-17 01:25:32.416',0,100,NULL,1,0,0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL),('cmhy68hs50000g0xkj2slheo4','meofeat@gmail.com','Meo','$2a$10$Sd.jikOgjO8rM22fUnCFhumJro37e1.YYhhPwS7pu5uI0oCVoDa5S','Meo','Herşey herşeydir.','/maskot/4.png','USER',78,60,173,NULL,'2025-11-14 01:20:33.798','2025-11-16 23:35:56.813',0,100,'2025-11-16 23:20:10.367',1,0,1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weight_logs`
--

DROP TABLE IF EXISTS `weight_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `weight_logs` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `weight` double NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `weight_logs_userId_date_idx` (`userId`,`date`),
  CONSTRAINT `weight_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weight_logs`
--

LOCK TABLES `weight_logs` WRITE;
/*!40000 ALTER TABLE `weight_logs` DISABLE KEYS */;
INSERT INTO `weight_logs` VALUES ('cmhy6uny60007g0xkrzcvfiz9','cmhxnqibq0000n3zb1nyhdaso',66,'2025-11-14 00:00:00.000',NULL,'2025-11-14 01:37:48.223'),('cmi2btcet000kknwp8rb5fpvg','cmhxnqibq0000n3zb1nyhdaso',63,'2025-11-16 00:00:00.000',NULL,'2025-11-16 23:07:49.397'),('cmi2cdn4t0028knwppifzah3w','cmhy68hs50000g0xkj2slheo4',78,'2025-11-16 00:00:00.000',NULL,'2025-11-16 23:23:36.414');
/*!40000 ALTER TABLE `weight_logs` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-19 20:20:36
