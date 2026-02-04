-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: swp391_db
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `swp391_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `swp391_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `swp391_db`;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,1,'Món siu ngonnnnnnnnnnnn','Đắm chìm vào các món ngon được cung cấp bởi TCH',1,'2025-07-23 20:05:42','2025-07-23 20:34:34'),(2,1,'Bán chạy nhất Tiên Du','',1,'2025-07-23 20:05:51','2025-07-23 20:05:51'),(3,1,'Nhăm nhăm','',1,'2025-07-23 20:06:03','2025-07-23 20:06:03'),(4,1,'Chè mới','',1,'2025-07-23 20:06:08','2025-07-23 20:06:08'),(5,4,'Khởi đầu','1 món, 1 trải ngh',1,'2025-07-24 21:34:05','2025-07-24 21:34:05'),(6,3,'Hi','',1,'2025-07-24 22:21:09','2025-07-24 22:21:09');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_food`
--

DROP TABLE IF EXISTS `category_food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_food` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `food_id` int NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `is_recommend` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_food_food_id_category_id_unique` (`category_id`,`food_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `category_food_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `category_food_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_food`
--

LOCK TABLES `category_food` WRITE;
/*!40000 ALTER TABLE `category_food` DISABLE KEYS */;
INSERT INTO `category_food` VALUES (1,1,12,0,0,'2025-07-23 20:05:42','2025-07-23 20:05:42'),(2,1,13,0,0,'2025-07-23 20:05:42','2025-07-23 20:05:42'),(3,1,14,0,0,'2025-07-23 20:05:42','2025-07-23 20:05:42'),(4,1,16,0,0,'2025-07-23 20:05:42','2025-07-23 20:05:42'),(5,1,17,0,0,'2025-07-23 20:05:42','2025-07-23 20:05:42'),(6,2,21,0,0,'2025-07-23 20:05:51','2025-07-23 20:05:51'),(7,2,19,0,0,'2025-07-23 20:05:51','2025-07-23 20:05:51'),(8,2,17,0,0,'2025-07-23 20:05:51','2025-07-23 20:05:51'),(9,2,20,0,0,'2025-07-23 20:05:51','2025-07-23 20:05:51'),(10,2,16,0,0,'2025-07-23 20:05:51','2025-07-23 20:05:51'),(11,3,12,0,0,'2025-07-23 20:06:03','2025-07-23 20:06:03'),(12,3,15,0,0,'2025-07-23 20:06:03','2025-07-23 20:06:03'),(13,3,13,0,0,'2025-07-23 20:06:03','2025-07-23 20:06:03'),(14,3,17,0,0,'2025-07-23 20:06:03','2025-07-23 20:06:03'),(15,3,19,0,0,'2025-07-23 20:06:03','2025-07-23 20:06:03'),(16,3,20,0,0,'2025-07-23 20:06:03','2025-07-23 20:06:03'),(17,4,21,0,0,'2025-07-23 20:06:08','2025-07-23 20:06:08'),(18,5,12,0,0,'2025-07-24 21:34:05','2025-07-24 21:34:05'),(19,6,13,0,0,'2025-07-24 22:21:09','2025-07-24 22:21:09'),(20,6,14,0,0,'2025-07-24 22:21:09','2025-07-24 22:21:09');
/*!40000 ALTER TABLE `category_food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation_messages`
--

DROP TABLE IF EXISTS `conversation_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversation_messages` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `conversation_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sender_id` int NOT NULL,
  `sender_type` enum('customer','store') NOT NULL,
  `content` text,
  `image_url` varchar(255) DEFAULT NULL,
  `replied_to_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `reactions` json NOT NULL,
  `order_id` int DEFAULT NULL,
  `food_id` int DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_id` (`sender_id`),
  KEY `replied_to_id` (`replied_to_id`),
  CONSTRAINT `conversation_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `conversation_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `conversation_messages_ibfk_3` FOREIGN KEY (`replied_to_id`) REFERENCES `conversation_messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation_messages`
--

LOCK TABLES `conversation_messages` WRITE;
/*!40000 ALTER TABLE `conversation_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversation_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `customer_id` int NOT NULL,
  `store_id` int NOT NULL,
  `last_message_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_profiles`
--

DROP TABLE IF EXISTS `customer_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_profiles` (
  `user_id` int NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `customer_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_profiles`
--

LOCK TABLES `customer_profiles` WRITE;
/*!40000 ALTER TABLE `customer_profiles` DISABLE KEYS */;
INSERT INTO `customer_profiles` VALUES (1,NULL,NULL,'admin',1,'2025-07-23 07:19:37','2025-07-23 07:19:37'),(2,NULL,'male','Customer',1,'2025-07-23 07:20:09','2025-07-24 21:10:11'),(13,NULL,NULL,'customer2',1,'2025-07-24 12:16:20','2025-07-24 12:16:20'),(20,'2025-07-08',NULL,'Duong Nguyen',1,'2025-07-26 15:37:25','2025-07-26 15:37:39'),(21,'1999-07-03','male','Customer Number Three',1,'2025-07-26 16:12:19','2025-07-26 16:12:19');
/*!40000 ALTER TABLE `customer_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customization_groups`
--

DROP TABLE IF EXISTS `customization_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customization_groups` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `food_id` int NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `description` text,
  `is_required` tinyint(1) DEFAULT '0',
  `min_selections` int NOT NULL DEFAULT '0',
  `max_selections` int DEFAULT NULL COMMENT 'null means unlimited',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`group_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `customization_groups_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customization_groups`
--

LOCK TABLES `customization_groups` WRITE;
/*!40000 ALTER TABLE `customization_groups` DISABLE KEYS */;
INSERT INTO `customization_groups` VALUES (31,15,'Kích cỡ bánh','Chọn size.',1,1,1,1,'2025-07-23 08:02:54'),(32,15,'Thêm loại nhân','Chọn thêm nhân.',0,0,2,2,'2025-07-23 08:02:54'),(33,16,'Loại protein','Chọn loại thịt/ăn kèm.',1,1,1,1,'2025-07-23 08:02:59'),(34,16,'Topping thêm','Phụ thêm bánh tráng, đậu phộng.',0,0,2,2,'2025-07-23 08:02:59'),(35,17,'Sốt chấm','Chọn nước chấm.',1,1,1,1,'2025-07-23 08:03:05'),(38,19,'Loại gà','Gà thường hoặc gà rút xương.',1,1,1,1,'2025-07-23 08:03:12'),(39,19,'Thêm topping','Chọn thêm ruốc hoặc chà bông.',0,0,1,2,'2025-07-23 08:03:12'),(40,20,'Số lượng cuốn','Bao nhiêu cuốn nem cần?',1,1,10,1,'2025-07-23 08:03:17'),(41,20,'Dipping sauce','Chọn nước chấm.',1,1,1,2,'2025-07-23 08:03:17'),(42,21,'Thêm topping','Chọn thêm topping.',0,0,2,1,'2025-07-23 08:03:22'),(80,14,'Sốt chấm','',1,1,1,1,'2025-07-24 22:22:42'),(81,14,'Thêm cuốn','',0,0,10,2,'2025-07-24 22:22:42'),(88,13,'Độ cay','',1,1,1,1,'2025-07-24 22:24:02'),(89,13,'Topping (2-5)','',1,2,5,2,'2025-07-24 22:24:02'),(90,13,'Select Single Not required - 1','',0,1,1,3,'2025-07-24 22:24:02'),(91,13,'Select Multiple Not Required 0-5','',0,0,5,4,'2025-07-24 22:24:02'),(92,13,'Select 2-2','',0,2,2,5,'2025-07-24 22:24:02'),(93,13,'Select 2-2 Req','',1,2,2,6,'2025-07-24 22:24:02'),(94,22,'Phụ thêm topping','Chọn thêm topping ăn kèm.',0,0,2,1,'2025-07-26 09:00:14'),(95,23,'Độ cay','Chọn mức độ cay.',1,1,1,1,'2025-07-26 09:00:22'),(96,23,'Thêm topping','Có thể chọn thêm.',0,0,1,2,'2025-07-26 09:00:22'),(120,12,'Multiple Optional n-m','',0,2,4,1,'2025-07-26 11:58:52'),(121,12,'Single - Required - 1-1','',1,1,1,2,'2025-07-26 11:58:52'),(122,12,'Multiple - Required - 1-n','',0,1,3,3,'2025-07-26 11:58:52');
/*!40000 ALTER TABLE `customization_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customization_options`
--

DROP TABLE IF EXISTS `customization_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customization_options` (
  `option_id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `option_name` varchar(255) NOT NULL,
  `description` text,
  `additional_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_default` tinyint(1) DEFAULT '0',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`option_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `customization_options_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `customization_groups` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=411 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customization_options`
--

LOCK TABLES `customization_options` WRITE;
/*!40000 ALTER TABLE `customization_options` DISABLE KEYS */;
INSERT INTO `customization_options` VALUES (70,31,'Nhỏ','',0.00,1,1,'2025-07-23 08:02:54'),(71,31,'Lớn','',10000.00,0,2,'2025-07-23 08:02:54'),(72,32,'Thêm thịt bò','',15000.00,0,1,'2025-07-23 08:02:54'),(73,32,'Thêm trứng','',5000.00,0,2,'2025-07-23 08:02:54'),(74,33,'Tôm','',0.00,1,1,'2025-07-23 08:02:59'),(75,33,'Thịt heo','',5000.00,0,2,'2025-07-23 08:02:59'),(76,34,'Thêm bánh tráng giòn','',5000.00,0,1,'2025-07-23 08:02:59'),(77,34,'Thêm đậu phộng rang','',3000.00,0,2,'2025-07-23 08:02:59'),(78,35,'Nước mắm','',0.00,1,1,'2025-07-23 08:03:05'),(79,35,'Sốt tỏi ớt','',3000.00,0,2,'2025-07-23 08:03:05'),(84,38,'Gà thường','',0.00,1,1,'2025-07-23 08:03:12'),(85,38,'Gà rút xương','',10000.00,0,2,'2025-07-23 08:03:12'),(86,39,'Chà bông','',5000.00,0,1,'2025-07-23 08:03:12'),(87,40,'5 cuốn','',0.00,1,1,'2025-07-23 08:03:17'),(88,40,'10 cuốn','',35000.00,0,2,'2025-07-23 08:03:17'),(89,41,'Nước mắm chua ngọt','',0.00,1,1,'2025-07-23 08:03:17'),(90,42,'Thêm nước cốt dừa','',5000.00,0,1,'2025-07-23 08:03:22'),(91,42,'Thêm flan','',8000.00,0,2,'2025-07-23 08:03:22'),(269,80,'Sốt tương đậu phộng','',0.00,1,1,'2025-07-24 22:22:42'),(270,80,'Nước mắm chấm','',0.00,0,2,'2025-07-24 22:22:42'),(271,81,'Thêm 1 cuốn','',25000.00,0,1,'2025-07-24 22:22:42'),(302,88,'Ít cay','',0.00,1,1,'2025-07-24 22:24:02'),(303,88,'Trung bình','',2000.00,0,2,'2025-07-24 22:24:02'),(304,88,'Rất cay','',4000.00,0,3,'2025-07-24 22:24:02'),(305,89,'Giò heo','',15000.00,1,1,'2025-07-24 22:24:02'),(306,89,'Cha gio','',5000.00,1,2,'2025-07-24 22:24:02'),(307,89,'Ba chi','',10000.00,1,3,'2025-07-24 22:24:02'),(308,89,'Option 1','',6000.00,0,4,'2025-07-24 22:24:02'),(309,89,'Option 2','',7000.00,0,5,'2025-07-24 22:24:02'),(310,89,'Option 3','',8000.00,0,6,'2025-07-24 22:24:02'),(311,90,'Opt1','',0.00,1,1,'2025-07-24 22:24:02'),(312,90,'Opt2','',5000.00,0,2,'2025-07-24 22:24:02'),(313,90,'Opt3','',15000.00,0,3,'2025-07-24 22:24:02'),(314,90,'Opt4','',25000.00,0,4,'2025-07-24 22:24:02'),(315,91,'Option 1','',0.00,0,1,'2025-07-24 22:24:02'),(316,91,'Option 2','',1000.00,0,2,'2025-07-24 22:24:02'),(317,91,'Option 3','',2000.00,0,3,'2025-07-24 22:24:02'),(318,91,'Option 4','',3000.00,0,4,'2025-07-24 22:24:02'),(319,91,'Option 5','',4000.00,0,5,'2025-07-24 22:24:02'),(320,91,'Option 6','',5000.00,0,6,'2025-07-24 22:24:02'),(321,91,'Option 7','',6000.00,0,7,'2025-07-24 22:24:02'),(322,91,'Option 8','',7000.00,0,8,'2025-07-24 22:24:02'),(323,92,'1','',1.00,1,1,'2025-07-24 22:24:02'),(324,92,'2','',2.00,1,2,'2025-07-24 22:24:02'),(325,92,'3','',3.00,1,3,'2025-07-24 22:24:02'),(326,92,'4','',4.00,1,4,'2025-07-24 22:24:02'),(327,93,'req 1','',4000.00,0,1,'2025-07-24 22:24:02'),(328,93,'req 2','',3000.00,0,2,'2025-07-24 22:24:02'),(329,93,'req 3','',2000.00,0,3,'2025-07-24 22:24:02'),(330,93,'req 4','',1000.00,0,4,'2025-07-24 22:24:02'),(331,93,'req 5','',0.00,0,5,'2025-07-24 22:24:02'),(332,94,'Trứng ốp la','Trứng ốp la ăn kèm',8000.00,0,1,'2025-07-26 09:00:14'),(333,94,'Chả lụa thêm','Miếng chả lụa phụ',10000.00,0,2,'2025-07-26 09:00:14'),(334,95,'Ít cay','',0.00,1,1,'2025-07-26 09:00:22'),(335,95,'Trung bình','',2000.00,0,2,'2025-07-26 09:00:22'),(336,95,'Rất cay','',4000.00,0,3,'2025-07-26 09:00:22'),(337,96,'Giò heo','Thêm giò heo hầm mềm',15000.00,0,1,'2025-07-26 09:00:22'),(398,120,'12','',0.00,0,1,'2025-07-26 11:58:52'),(399,120,'22','',0.00,1,2,'2025-07-26 11:58:52'),(400,120,'32','',0.00,1,3,'2025-07-26 11:58:52'),(401,120,'42','',0.00,0,4,'2025-07-26 11:58:52'),(402,120,'52','',0.00,0,5,'2025-07-26 11:58:52'),(403,120,'26','',0.00,0,6,'2025-07-26 11:58:52'),(404,121,'op1','',0.00,1,1,'2025-07-26 11:58:52'),(405,121,'op2','',0.00,0,2,'2025-07-26 11:58:52'),(406,122,'Op1','',0.00,0,1,'2025-07-26 11:58:52'),(407,122,'op2','',0.00,0,2,'2025-07-26 11:58:52'),(408,122,'Op3','',0.00,0,3,'2025-07-26 11:58:52'),(409,122,'op4','',0.00,0,4,'2025-07-26 11:58:52'),(410,122,'op5','',0.00,1,5,'2025-07-26 11:58:52');
/*!40000 ALTER TABLE `customization_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_addresses`
--

DROP TABLE IF EXISTS `delivery_addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_line` varchar(255) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `recipient_name` varchar(255) NOT NULL,
  `recipient_phone` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`address_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `delivery_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_addresses`
--

LOCK TABLES `delivery_addresses` WRITE;
/*!40000 ALTER TABLE `delivery_addresses` DISABLE KEYS */;
INSERT INTO `delivery_addresses` VALUES (1,2,'Hai Huong, Xã Hua Nà, Huyện Than Uyên, Tỉnh Lai Châu',NULL,NULL,0,'Duong','0222333444','2025-07-23 15:58:37','2025-07-23 15:58:37'),(2,2,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai',20.90000000,105.58300000,1,'35646534','0444333222','2025-07-23 16:00:25','2025-07-23 16:00:25'),(3,13,'qwefrqewfqw, Xã Thượng Ấm, Huyện Sơn Dương, Tỉnh Tuyên Quang',20.90000000,105.58300000,1,'Duong','0123456789','2025-07-24 12:23:39','2025-07-24 12:23:39'),(4,21,'Ha Noi, Xã Quí Quân, Huyện Yên Sơn, Tỉnh Tuyên Quang',21.02725830,105.55214200,1,'Duong Nguyen','0111222333','2025-07-26 17:23:29','2025-07-26 17:23:29');
/*!40000 ALTER TABLE `delivery_addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `discount_id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('percentage','fixed_amount') NOT NULL,
  `discount_sale_type` enum('items','delivery') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `max_discount_amount` decimal(10,2) DEFAULT NULL,
  `is_limit_usage_per_user` tinyint(1) NOT NULL DEFAULT '0',
  `allow_usage_per_user` int NOT NULL DEFAULT '1',
  `valid_from` datetime DEFAULT NULL,
  `valid_to` datetime DEFAULT NULL,
  `usage_limit` int DEFAULT NULL,
  `is_price_condition` tinyint(1) DEFAULT '0',
  `min_price_condition` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_hidden` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`discount_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `discounts_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
INSERT INTO `discounts` VALUES (1,3,'SWP391','Name','Desc','percentage','items',50.00,100000.00,1,1000,'2025-07-01 07:00:00','2025-10-30 07:00:00',100,0,0.00,1,0,'2025-07-24 22:54:11','2025-07-24 22:54:11'),(2,4,'KFCNE2','kfc neww','desc','fixed_amount','items',10000.00,0.00,1,2,'2025-07-14 21:00:00','2025-11-01 21:00:00',3,0,0.00,1,0,'2025-07-24 23:30:16','2025-07-24 23:30:16'),(3,4,'FREESHIP25','KFC Freeship for FPT',NULL,'percentage','delivery',50.00,50000.00,1,50,'2025-07-25 02:00:00','2025-08-25 14:00:00',100,1,50000.00,1,0,'2025-07-26 12:02:50','2025-07-26 12:02:50');
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food_metrics`
--

DROP TABLE IF EXISTS `food_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food_metrics` (
  `food_id` int NOT NULL,
  `number_of_ratings` int DEFAULT '0',
  `number_of_orders` int DEFAULT '0',
  `number_of_people_ordered` int DEFAULT '0',
  `number_of_favorites` int DEFAULT '0',
  `average_rating` decimal(3,2) DEFAULT '0.00',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`food_id`),
  CONSTRAINT `food_metrics_ibfk_1` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food_metrics`
--

LOCK TABLES `food_metrics` WRITE;
/*!40000 ALTER TABLE `food_metrics` DISABLE KEYS */;
INSERT INTO `food_metrics` VALUES (12,0,0,0,0,0.00,'2025-07-24 14:24:38','2025-07-24 14:25:25'),(13,0,7,2,0,0.00,'2025-07-24 12:24:04','2025-07-24 21:02:19'),(14,0,0,0,0,0.00,'2025-07-24 14:29:15','2025-07-24 14:29:15'),(15,0,0,0,0,0.00,'2025-07-24 11:52:37','2025-07-24 12:35:00'),(17,0,0,0,1,0.00,'2025-07-24 11:52:48','2025-07-24 14:27:11'),(20,0,0,0,0,0.00,'2025-07-24 12:23:59','2025-07-24 12:46:33'),(21,0,0,0,0,0.00,'2025-07-24 14:30:23','2025-07-24 14:30:41');
/*!40000 ALTER TABLE `food_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foods`
--

DROP TABLE IF EXISTS `foods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foods` (
  `food_id` int NOT NULL AUTO_INCREMENT,
  `store_id` int NOT NULL,
  `category_id` int NOT NULL,
  `food_name` varchar(255) NOT NULL,
  `description` text,
  `base_price` decimal(10,2) NOT NULL,
  `is_on_sale` tinyint(1) DEFAULT '0',
  `sale_price` decimal(10,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `preparation_time` int NOT NULL COMMENT 'minutes',
  `max_allowed_quantity` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`food_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `foods_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foods`
--

LOCK TABLES `foods` WRITE;
/*!40000 ALTER TABLE `foods` DISABLE KEYS */;
INSERT INTO `foods` VALUES (12,4,1,'35','Cơm tấm kèm sườn nướng, bì, chả trứng, ăn kèm đồ chua.',60000.00,1,50000.00,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg',1,12,10,'2025-07-23 08:02:35','2025-07-26 11:58:52'),(13,3,2,'Bún Bò Huế','Bún bò miền Trung cay ngon đúng vị Huế.',70000.00,0,NULL,'https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg',1,15,8,'2025-07-23 08:02:45','2025-07-24 22:24:02'),(14,3,3,'Gỏi Cuốn Tôm Thịt','Cuốn tôm thịt với bún, rau sống và bánh tráng.',50000.00,0,NULL,'https://heyyofoods.com/wp-content/uploads/2024/03/3-4.jpg',1,8,15,'2025-07-23 08:02:49','2025-07-24 22:22:42'),(15,2,4,'Bánh Xèo','Bánh xèo giòn nhân tôm, thịt, giá.',55000.00,1,45000.00,'https://daylambanh.edu.vn/wp-content/uploads/2019/03/banh-xeo-bang-bot-pha-san-600x400.jpg',1,10,6,'2025-07-23 08:02:54','2025-07-23 08:02:54'),(16,2,5,'Mì Quảng Đà Nẵng','Mì Quảng đặc sản với tôm, thịt và bánh tráng giòn.',65000.00,0,NULL,'https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/48/2024/08/16031433/Mi-Quang-Da-Nang.png',1,12,7,'2025-07-23 08:02:59','2025-07-23 08:02:59'),(17,1,6,'Bánh Bèo Huế','Bánh bèo nhỏ Huế topping ruốc tôm, mỡ hành.',40000.00,0,NULL,'https://storage.googleapis.com/onelife-public/blog.onelife.vn/2021/11/cach-lam-banh-beo-chen-bang-bot-gao-banh-banh-ngot-189955766924.png',1,6,20,'2025-07-23 08:03:05','2025-07-23 08:03:05'),(19,8,8,'Xôi Gà','Xôi dẻo thơm với gà xé và hành phi.',45000.00,0,NULL,'https://assets.grab.com/wp-content/uploads/sites/11/2019/10/22011737/kaiwaii.food_70788760_174578393666456_7938739093952678732_n.jpg',1,5,12,'2025-07-23 08:03:12','2025-07-23 08:03:12'),(20,8,9,'Chả Giò (Nem Rán)','Chả giò chiên giòn nhân thịt lẫn nấm và bún.',40000.00,1,35000.00,'https://foody.nz/cdn/shop/articles/cooky-recipe-cover-r40216-1_1170x.jpg?v=1617094299',1,10,20,'2025-07-23 08:03:17','2025-07-23 08:03:17'),(21,9,10,'Chè Ba Màu','Chè ngọt với lớp đậu xanh, đậu đỏ, thạch, dừa tươi.',35000.00,0,NULL,'https://www.simplyrecipes.com/thmb/hGF_Oyd0R22nOGcKYpwp3nS_Pcg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-Che-Ba-Mau-LEAD-2-c6162830ea634fa5ae0fab2d21276378.jpg',1,4,20,'2025-07-23 08:03:22','2025-07-23 08:03:22'),(22,1,1,'Cơm Tấm Sườn Bì Chả','Cơm tấm kèm sườn nướng, bì, chả trứng, ăn kèm đồ chua.',60000.00,1,50000.00,NULL,1,12,10,'2025-07-26 09:00:14','2025-07-26 09:00:14'),(23,1,2,'Bún Bò Huế','Bún bò miền Trung cay ngon đúng vị Huế.',70000.00,0,NULL,NULL,1,15,8,'2025-07-26 09:00:22','2025-07-26 09:00:22');
/*!40000 ALTER TABLE `foods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_events`
--

DROP TABLE IF EXISTS `order_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `event_type` enum('new','courier_assigned','preparing','delivering','ready_to_pickup','completed','cancelled','payment_completed','courier_unassigned','refunded') NOT NULL,
  `triggered_by_user_id` int DEFAULT NULL,
  `snapshot_triggered_by_name` varchar(255) DEFAULT NULL,
  `event_reason` varchar(255) DEFAULT NULL,
  `event_notes` varchar(255) DEFAULT NULL,
  `event_metadata` json DEFAULT NULL,
  `event_timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `order_id` (`order_id`),
  KEY `triggered_by_user_id` (`triggered_by_user_id`),
  CONSTRAINT `order_events_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_events_ibfk_2` FOREIGN KEY (`triggered_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_events`
--

LOCK TABLES `order_events` WRITE;
/*!40000 ALTER TABLE `order_events` DISABLE KEYS */;
INSERT INTO `order_events` VALUES (1,1,'new',13,'customer2@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"K6ZGJE\", \"payment_option\": \"qr\"}','2025-07-24 12:33:59'),(2,2,'new',13,'customer2@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"4RV4DI\", \"payment_option\": \"cash\"}','2025-07-24 12:34:01'),(3,3,'new',13,'customer2@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"SBZYAS\", \"payment_option\": \"qr\"}','2025-07-24 12:34:04'),(4,4,'new',13,'customer2@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"TG2BS1\", \"payment_option\": \"cash\"}','2025-07-24 12:34:15'),(5,5,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"2IKY7P\", \"payment_option\": \"qr\"}','2025-07-24 12:35:27'),(6,6,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"LYCNR2\", \"payment_option\": \"cash\"}','2025-07-24 12:35:31'),(7,7,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"QWYJLF\", \"payment_option\": \"qr\"}','2025-07-24 12:35:36'),(8,7,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:32'),(9,6,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:33'),(10,5,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:34'),(11,4,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:36'),(12,1,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:46'),(13,3,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:48'),(14,2,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:49'),(15,5,'ready_to_pickup',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:43:59'),(16,4,'ready_to_pickup',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:02'),(17,3,'ready_to_pickup',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:04'),(18,1,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:08'),(19,7,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:10'),(20,7,'courier_assigned',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:51'),(21,6,'courier_assigned',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:52'),(22,2,'courier_assigned',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:55'),(23,1,'courier_assigned',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:44:58'),(24,7,'delivering',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:14'),(25,6,'delivering',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:16'),(26,2,'delivering',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:17'),(27,1,'delivering',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:18'),(28,7,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:21'),(29,6,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:22'),(30,6,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:24'),(31,2,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:25'),(32,2,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:27'),(33,1,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:30'),(34,4,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:54'),(35,4,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:56'),(36,5,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:58'),(37,5,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:45:59'),(38,3,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:46:46'),(39,3,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-24 12:46:47'),(40,8,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"F8G3CT\", \"payment_option\": \"qr\"}','2025-07-24 21:31:47'),(41,8,'cancelled',NULL,NULL,'Đóng cửa òiii',NULL,NULL,'2025-07-24 21:45:28'),(42,9,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"FFGBR5\", \"payment_option\": \"cash\"}','2025-07-24 23:11:27'),(43,10,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"G6KOHD\", \"payment_option\": \"cash\"}','2025-07-24 23:15:28'),(44,11,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"VFRFIY\", \"payment_option\": \"cash\"}','2025-07-24 23:18:06'),(45,12,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"VTKT7F\", \"payment_option\": \"cash\"}','2025-07-24 23:38:41'),(46,13,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"GZVDW1\", \"payment_option\": \"cash\"}','2025-07-24 23:39:12'),(47,14,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"MYRZ23\", \"payment_option\": \"cash\"}','2025-07-24 23:40:56'),(48,15,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"QUZ0VX\", \"payment_option\": \"cash\"}','2025-07-24 23:57:25'),(49,16,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"129KA1\", \"payment_option\": \"cash\"}','2025-07-24 23:59:36'),(50,17,'new',13,'customer2@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"W2ZRWM\", \"payment_option\": \"cash\"}','2025-07-25 00:40:25'),(51,17,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-25 00:41:15'),(52,17,'cancelled',NULL,NULL,'I have to cancel :(',NULL,NULL,'2025-07-25 00:41:22'),(53,16,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 00:41:42'),(54,15,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 00:41:42'),(55,14,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 00:41:44'),(56,13,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 00:41:45'),(57,12,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 00:41:45'),(58,10,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 00:41:46'),(59,9,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 00:41:47'),(60,18,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"8TXLET\", \"payment_option\": \"cash\"}','2025-07-25 06:47:24'),(61,19,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"JGV8MK\", \"payment_option\": \"cash\"}','2025-07-25 06:48:12'),(62,19,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-25 06:48:43'),(63,20,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"NTW5A9\", \"payment_option\": \"cash\"}','2025-07-25 06:50:00'),(64,20,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-25 06:52:02'),(65,20,'ready_to_pickup',NULL,NULL,NULL,NULL,NULL,'2025-07-25 06:52:09'),(66,20,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-25 06:52:14'),(67,20,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-25 07:01:38'),(68,19,'courier_assigned',NULL,NULL,NULL,NULL,NULL,'2025-07-25 07:01:44'),(69,19,'cancelled',NULL,NULL,'No reason provided',NULL,NULL,'2025-07-25 07:02:02'),(70,21,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"AD6GQO\", \"payment_option\": \"cash\"}','2025-07-26 12:12:20'),(71,21,'courier_assigned',NULL,NULL,NULL,NULL,NULL,'2025-07-26 12:16:55'),(72,21,'preparing',NULL,NULL,NULL,NULL,NULL,'2025-07-26 12:17:10'),(73,21,'delivering',NULL,NULL,NULL,NULL,NULL,'2025-07-26 12:17:30'),(74,21,'payment_completed',NULL,NULL,NULL,NULL,NULL,'2025-07-26 12:17:44'),(75,21,'completed',NULL,NULL,NULL,NULL,NULL,'2025-07-26 12:17:46'),(76,22,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": false, \"order_code\": \"F3YD7A\", \"payment_option\": \"qr\"}','2025-07-26 12:18:18'),(77,23,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"PL9M2J\", \"payment_option\": \"qr\"}','2025-07-26 12:18:21'),(78,24,'new',2,'customer@mail.com',NULL,NULL,'{\"is_pickup\": true, \"order_code\": \"85TJDH\", \"payment_option\": \"cash\"}','2025-07-26 12:18:23');
/*!40000 ALTER TABLE `order_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `food_id` int NOT NULL,
  `quantity` int NOT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `sale_price` decimal(12,2) NOT NULL,
  `customization` varchar(255) DEFAULT NULL,
  `snapshot_food_image` varchar(255) DEFAULT NULL,
  `snapshot_food_name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `order_id` (`order_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,13,1,89000.00,89000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:33:59'),(2,1,13,2,212000.00,424000.00,'Trung bình, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:33:59'),(3,1,13,1,125000.00,125000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:33:59'),(4,2,13,1,89000.00,89000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:01'),(5,2,13,2,212000.00,424000.00,'Trung bình, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:01'),(6,2,13,1,125000.00,125000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:01'),(7,3,13,1,89000.00,89000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:04'),(8,3,13,2,212000.00,424000.00,'Trung bình, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:04'),(9,3,13,1,125000.00,125000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:04'),(10,4,13,1,89000.00,89000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:15'),(11,4,13,2,212000.00,424000.00,'Trung bình, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:15'),(12,4,13,1,125000.00,125000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:34:15'),(13,5,13,1,89000.00,89000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:35:27'),(14,5,13,8,864000.00,6912000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:35:27'),(15,6,13,1,89000.00,89000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:35:31'),(16,6,13,4,432000.00,1728000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:35:31'),(17,7,13,8,712000.00,5696000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:35:36'),(18,7,13,4,432000.00,1728000.00,'Rất cay, Giò heo','https://file.hstatic.net/200000700229/article/bun-bo-hue-1_da318989e7c2493f9e2c3e010e722466.jpg','Bún Bò Huế','2025-07-24 12:35:36'),(19,8,12,10,680000.00,580000.00,'Trứng ốp la','https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 21:31:47'),(20,8,12,10,700000.00,600000.00,'Chả lụa thêm','https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 21:31:47'),(21,8,12,10,780000.00,680000.00,'Trứng ốp la, Chả lụa thêm','https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 21:31:47'),(22,9,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:11:27'),(23,9,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:11:27'),(24,9,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:11:27'),(25,10,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:15:28'),(26,10,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:15:28'),(27,10,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:15:28'),(28,11,14,1,50000.00,50000.00,NULL,'https://heyyofoods.com/wp-content/uploads/2024/03/3-4.jpg','Gỏi Cuốn Tôm Thịt','2025-07-24 23:18:06'),(29,11,14,1,50000.00,50000.00,NULL,'https://heyyofoods.com/wp-content/uploads/2024/03/3-4.jpg','Gỏi Cuốn Tôm Thịt','2025-07-24 23:18:06'),(30,12,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:38:41'),(31,12,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:38:41'),(32,12,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:38:41'),(33,13,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:39:12'),(34,13,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:39:12'),(35,13,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:39:12'),(36,14,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:40:56'),(37,14,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:40:56'),(38,14,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:40:56'),(39,15,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:57:25'),(40,15,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:57:25'),(41,15,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:57:25'),(42,16,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:59:36'),(43,16,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:59:36'),(44,16,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-24 23:59:36'),(45,17,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 00:40:25'),(46,17,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 00:40:25'),(47,17,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 00:40:25'),(48,18,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 06:47:24'),(49,18,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 06:47:24'),(50,18,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 06:47:24'),(51,19,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 06:48:12'),(52,19,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 06:48:12'),(53,19,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 06:48:12'),(54,20,12,10,600000.00,500000.00,NULL,'https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','Cơm Tấm Sườn Bì Chả','2025-07-25 06:50:00'),(55,21,12,1,60000.00,50000.00,'32, 42, 52, 26, op1, Op1, Op3, op5','https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','35','2025-07-26 12:12:20'),(56,22,12,1,60000.00,50000.00,'32, 42, 52, 26, op1, Op1, Op3, op5','https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','35','2025-07-26 12:18:18'),(57,23,12,1,60000.00,50000.00,'32, 42, 52, 26, op1, Op1, Op3, op5','https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','35','2025-07-26 12:18:21'),(58,24,12,1,60000.00,50000.00,'32, 42, 52, 26, op1, Op1, Op3, op5','https://static.hawonkoo.vn/hwk02/images/2023/10/com-tam-suon-bi-cha-2.jpg','35','2025-07-26 12:18:23');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `order_code` varchar(255) NOT NULL,
  `customer_id` int NOT NULL,
  `store_id` int NOT NULL,
  `order_type` enum('pickup','delivery') NOT NULL,
  `payment_option` enum('cash','qr') NOT NULL,
  `base_price_subtotal` decimal(12,2) NOT NULL,
  `sale_price_subtotal` decimal(12,2) NOT NULL,
  `promote_discount_price` decimal(12,2) DEFAULT NULL,
  `delivery_fee` decimal(12,2) DEFAULT NULL,
  `final_price` decimal(12,2) NOT NULL,
  `is_completed` tinyint(1) DEFAULT '0',
  `snapshot_delivery_address_line` varchar(255) DEFAULT NULL,
  `snapshot_recipient_name` varchar(255) DEFAULT NULL,
  `snapshot_recipient_phone` varchar(255) DEFAULT NULL,
  `snapshot_recipient_latitude` varchar(255) DEFAULT NULL,
  `snapshot_recipient_longitude` varchar(255) DEFAULT NULL,
  `customer_special_instruction` varchar(255) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT '0',
  `payment_completed_at` datetime DEFAULT NULL,
  `assigned_courier_id` int DEFAULT NULL,
  `snapshot_assigned_courier_name` varchar(255) DEFAULT NULL,
  `snapshot_assigned_courier_phone` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `customer_id` (`customer_id`),
  KEY `store_id` (`store_id`),
  KEY `assigned_courier_id` (`assigned_courier_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`assigned_courier_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'K6ZGJE',13,3,'delivery','qr',426000.00,638000.00,0.00,40000.00,678000.00,1,'qwefrqewfqw, Xã Thượng Ấm, Huyện Sơn Dương, Tỉnh Tuyên Quang','Duong','0123456789','20.90000000','105.58300000','',1,'2025-07-24 12:44:08',15,'Courier PH','0999999999','2025-07-24 12:33:59','2025-07-24 12:33:59'),(2,'4RV4DI',13,3,'delivery','cash',426000.00,638000.00,0.00,40000.00,678000.00,1,'qwefrqewfqw, Xã Thượng Ấm, Huyện Sơn Dương, Tỉnh Tuyên Quang','Duong','0123456789','20.90000000','105.58300000','',1,'2025-07-24 12:45:25',15,'Courier PH','0999999999','2025-07-24 12:34:01','2025-07-24 12:34:01'),(3,'SBZYAS',13,3,'pickup','qr',426000.00,638000.00,0.00,0.00,638000.00,1,'qwefrqewfqw, Xã Thượng Ấm, Huyện Sơn Dương, Tỉnh Tuyên Quang','Duong','0123456789','20.90000000','105.58300000','',1,'2025-07-24 12:46:46',NULL,NULL,NULL,'2025-07-24 12:34:04','2025-07-24 12:34:04'),(4,'TG2BS1',13,3,'pickup','cash',426000.00,638000.00,0.00,0.00,638000.00,1,'qwefrqewfqw, Xã Thượng Ấm, Huyện Sơn Dương, Tỉnh Tuyên Quang','Duong','0123456789','20.90000000','105.58300000','',1,'2025-07-24 12:45:54',NULL,NULL,NULL,'2025-07-24 12:34:15','2025-07-24 12:34:15'),(5,'2IKY7P',2,3,'pickup','qr',953000.00,7001000.00,0.00,0.00,7001000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',1,'2025-07-24 12:45:58',NULL,NULL,NULL,'2025-07-24 12:35:27','2025-07-24 12:35:27'),(6,'LYCNR2',2,3,'delivery','cash',521000.00,1817000.00,0.00,40000.00,1857000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',1,'2025-07-24 12:45:22',15,'Courier PH','0999999999','2025-07-24 12:35:31','2025-07-24 12:35:31'),(7,'QWYJLF',2,3,'delivery','qr',1144000.00,7424000.00,0.00,40000.00,7464000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',1,'2025-07-24 12:44:10',15,'Courier PH','0999999999','2025-07-24 12:35:36','2025-07-24 12:35:36'),(8,'F8G3CT',2,4,'pickup','qr',2160000.00,1860000.00,0.00,0.00,1860000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','Hello',0,NULL,NULL,NULL,NULL,'2025-07-24 21:31:47','2025-07-24 21:31:47'),(9,'FFGBR5',2,4,'pickup','cash',1800000.00,1500000.00,100000.00,0.00,1500000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-24 23:11:27','2025-07-24 23:11:27'),(10,'G6KOHD',2,4,'delivery','cash',1800000.00,1500000.00,0.00,50000.00,1550000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-24 23:15:28','2025-07-24 23:15:28'),(11,'VFRFIY',2,3,'delivery','cash',100000.00,100000.00,50000.00,20000.00,70000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','Qua bu',0,NULL,NULL,NULL,NULL,'2025-07-24 23:18:06','2025-07-24 23:18:06'),(12,'VTKT7F',2,4,'delivery','cash',1800000.00,1500000.00,0.00,50000.00,1550000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-24 23:38:41','2025-07-24 23:38:41'),(13,'GZVDW1',2,4,'delivery','cash',1800000.00,1500000.00,0.00,50000.00,1550000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-24 23:39:12','2025-07-24 23:39:12'),(14,'MYRZ23',2,4,'delivery','cash',1800000.00,1500000.00,0.00,50000.00,1550000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-24 23:40:56','2025-07-24 23:40:56'),(15,'QUZ0VX',2,4,'delivery','cash',1800000.00,1500000.00,100000.00,50000.00,1450000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-24 23:57:25','2025-07-24 23:57:25'),(16,'129KA1',2,4,'delivery','cash',1800000.00,1500000.00,0.00,50000.00,1550000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-24 23:59:36','2025-07-24 23:59:36'),(17,'W2ZRWM',13,4,'delivery','cash',1800000.00,1500000.00,100000.00,50000.00,1450000.00,1,'qwefrqewfqw, Xã Thượng Ấm, Huyện Sơn Dương, Tỉnh Tuyên Quang','Duong','0123456789','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-25 00:40:25','2025-07-25 00:40:25'),(18,'8TXLET',2,4,'delivery','cash',1800000.00,1500000.00,0.00,50000.00,1550000.00,0,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-25 06:47:24','2025-07-25 06:47:24'),(19,'JGV8MK',2,4,'delivery','cash',1800000.00,1500000.00,0.00,50000.00,1550000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,17,'Courier KCCC','022333445','2025-07-25 06:48:12','2025-07-25 06:48:12'),(20,'NTW5A9',2,4,'pickup','cash',600000.00,500000.00,0.00,0.00,500000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',1,'2025-07-25 06:52:14',NULL,NULL,NULL,'2025-07-25 06:50:00','2025-07-25 06:50:00'),(21,'AD6GQO',2,4,'delivery','cash',60000.00,50000.00,25000.00,50000.00,75000.00,1,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',1,'2025-07-26 12:17:44',17,'Courier KCCC','022333445','2025-07-26 12:12:20','2025-07-26 12:12:20'),(22,'F3YD7A',2,4,'delivery','qr',60000.00,50000.00,0.00,50000.00,100000.00,0,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-26 12:18:18','2025-07-26 12:18:18'),(23,'PL9M2J',2,4,'pickup','qr',60000.00,50000.00,0.00,0.00,50000.00,0,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-26 12:18:21','2025-07-26 12:18:21'),(24,'85TJDH',2,4,'pickup','cash',60000.00,50000.00,0.00,0.00,50000.00,0,'43564653, Xã Ngũ Chỉ Sơn, Thị xã Sa Pa, Tỉnh Lào Cai','35646534','0444333222','20.90000000','105.58300000','',0,NULL,NULL,NULL,NULL,'2025-07-26 12:18:23','2025-07-26 12:18:23');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `http_method` enum('GET','POST','PUT','DELETE','PATCH') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_url_method_unique` (`url`,`http_method`)
) ENGINE=InnoDB AUTO_INCREMENT=222351 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (206936,'/api/admin/auth/login','POST','Admin login','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206937,'/api/admin/users','POST','Create new user','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206938,'/api/admin/users','GET','View all users','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206939,'/api/admin/users/:id','GET','View user details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206940,'/api/admin/users/:id','PUT','Update user','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206941,'/api/admin/users/:id','DELETE','Delete user','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206942,'/api/admin/groups','GET','View all user groups','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206943,'/api/admin/groups/add','POST','Create user group','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206944,'/api/admin/groups/:id','PUT','Update user group','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206945,'/api/admin/groups/:id','GET','Get user group','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206946,'/api/admin/groups/permission','GET','Get all permissions','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206947,'/api/admin/groups/permission/:id','GET','Get permissions of a group','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206948,'/api/admin/groups/permission/add','PUT','Add permission to group','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206949,'/api/admin/groups/permission/delete','DELETE','Remove permission from group','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206950,'/api/admin/stores','GET','View all stores','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206951,'/api/admin/stores','POST','Create store','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206952,'/api/admin/stores/:id','GET','View store details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206953,'/api/admin/stores/:id','PUT','Update store','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206954,'/api/admin/stores/:id/toggle-status','PATCH','Toggle store active status','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206955,'/api/admin/stores/:id/toggle-temp-closed','PATCH','Toggle store temporarily closed status','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206956,'/api/admin/profile','PUT','Update admin profile','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206957,'/api/admin/profile/change-password','PUT','Change admin password','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206958,'/api/admin/tickets/all','GET','View all tickets','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206959,'/api/admin/tickets/:id','GET','View ticket details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206960,'/api/admin/tickets/:id/reply','POST','Reply to ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206961,'/api/admin/tickets/:id','PUT','Update ticket status or details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206962,'/api/admin/tickets/:id/close','PUT','Close ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206968,'/api/auth/login','POST','Sale agent login','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206969,'/api/auth/me','GET','Get sale agent profile','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206970,'/api/auth/refresh','POST','Refresh token','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206971,'/api/store/me','GET','Get current store information','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206972,'/api/store/profile','GET','View store profile','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206973,'/api/store/profile/update','PUT','Update store profile','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206974,'/api/store/profile/config','GET','Get store profile config','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206975,'/api/store/profile/config','POST','Update store profile config','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206976,'/api/store/foods','GET','View store foods','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206977,'/api/store/foods','POST','Create food item','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206978,'/api/store/foods/:foodId','GET','View food item details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206979,'/api/store/foods/:foodId','PUT','Update food item','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206980,'/api/store/foods/:foodId','DELETE','Delete food item','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206981,'/api/store/categories','GET','View store categories','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206982,'/api/store/categories','POST','Create category','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206983,'/api/store/categories/:id','GET','View category details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206984,'/api/store/categories/:id','PUT','Update category','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206985,'/api/store/categories/:id','DELETE','Delete category','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206986,'/api/store/categories/:id/add-food','POST','Add food to category','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206987,'/api/store/orders','GET','View all store orders','2025-07-26 14:51:31','2025-07-26 14:51:31'),(206988,'/api/store/orders/:id','GET','View order details','2025-07-26 14:51:31','2025-07-26 14:51:31'),(206989,'/api/store/orders/:id','PUT','Update order status','2025-07-26 14:51:31','2025-07-26 14:51:31'),(206990,'/api/store/staff','GET','View store staff','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206991,'/api/store/staff','POST','Add store staff','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206992,'/api/store/staff/:staffId','PUT','Update staff','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206993,'/api/store/staff/:staffId','GET','Get staff details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206994,'/api/store/staff/:staffId','DELETE','Remove staff','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206995,'/api/store/staff/change-role/:staffId','PUT','Change staff role','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206996,'/api/store/discount','GET','View store discounts','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206997,'/api/store/discount','POST','Create discount','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206998,'/api/store/discount/:id','PUT','Update discount','2025-07-26 17:25:02','2025-07-26 17:25:02'),(206999,'/api/store/discount/:id','DELETE','Delete discount','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207000,'/api/store/tickets','POST','Create support ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207001,'/api/store/tickets','GET','View own tickets','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207002,'/api/store/tickets/:id','GET','View ticket details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207003,'/api/store/tickets/:id/reply','POST','Reply ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207004,'/api/store/tickets/:id/close','PUT','Close ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207005,'/api/store/custom/:storeId','GET','Get store customization data','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207006,'/api/store/custom/','PUT','Update store customization data','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207007,'/api/store/custom/','POST','Create store customization data','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207008,'/api/store/custom/','DELETE','Delete store customization data','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207021,'/api/auth/register','POST','User registration','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207024,'/api/auth/authenticate/verify','POST','Verify OTP for 2FA','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207025,'/api/account-recovery/request','POST','Request for reset password OTP','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207026,'/api/account-recovery/verifyOTP','POST','Verify OTP for reset password','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207027,'/api/auth/account-recovery/reset-password','POST','Reset Password','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207028,'/api/customer/profile','GET','Get profile','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207029,'/api/customer/profile','PUT','Update profile','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207030,'/api/customer/profile/change-password','PUT','Change password','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207031,'/api/customer/profile/avatar','POST','Upload avatar','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207032,'/api/profile/toggle2fa','POST','Toggle 2FA','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207033,'/api/customer/locations','GET','Get all locations','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207034,'/api/customer/locations/:id','GET','Get location by ID','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207035,'/api/customer/locations','POST','Create location','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207036,'/api/customer/locations/:id','PUT','Update location','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207037,'/api/customer/locations/:id','DELETE','Delete location','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207038,'/api/customer/locations/:id/default','PUT','Set default location','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207039,'/api/customer/tickets','POST','Create ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207040,'/api/customer/tickets','GET','Get all tickets','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207041,'/api/customer/tickets/:id','GET','Get ticket by ID','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207042,'/api/customer/tickets/:id/replies','POST','Reply to ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207043,'/api/customer/tickets/:id/close','PUT','Close ticket','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207044,'/api/customer/products/:id/save','POST','Save product','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207045,'/api/customer/products/check','GET','Check saved product','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207046,'/api/customer/products/saved','GET','Get all saved products','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207047,'/api/customer/stores/:id/follow','POST','Follow store','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207048,'/api/customer/stores/check','GET','Check following store','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207049,'/api/customer/stores/following','GET','Get all following stores','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207050,'/api/customer/order','GET','Get all orders','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207051,'/api/customer/order/:id','GET','Get order by ID','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207052,'/api/customer/order','POST','Create order','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207058,'/api/products','GET','Browse products','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207059,'/api/products/:id','GET','View product details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207060,'/api/stores','GET','Browse stores','2025-07-26 17:25:02','2025-07-26 17:25:02'),(207061,'/api/stores/:id','GET','View store details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(210311,'/api/store/discount/:id','GET','View discount details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(210609,'/api/store/staff/checkIn/:staffId','PUT','Check in staff','2025-07-26 17:25:02','2025-07-26 17:25:02'),(211591,'/api/store/order','GET','View all store orders','2025-07-26 17:25:02','2025-07-26 17:25:02'),(211592,'/api/store/order/:id','GET','View order details','2025-07-26 17:25:02','2025-07-26 17:25:02'),(211593,'/api/store/order/:id','PUT','Update order status','2025-07-26 17:25:02','2025-07-26 17:25:02');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `properties`
--

DROP TABLE IF EXISTS `properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `properties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('selection','boolean','number') NOT NULL,
  `options` json DEFAULT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `properties`
--

LOCK TABLES `properties` WRITE;
/*!40000 ALTER TABLE `properties` DISABLE KEYS */;
INSERT INTO `properties` VALUES (1,'meal','selection','[\"breakfast\", \"lunch\", \"dinner\", \"snack\", \"dessert\"]',NULL,1,'2025-07-22 19:53:30','2025-07-22 19:53:30'),(2,'cuisine','selection','[\"Vietnamese\", \"Chinese\", \"Japanese\", \"Korean\", \"Thai\", \"Indian\", \"Italian\", \"French\", \"American\", \"Mexican\"]',NULL,1,'2025-07-22 19:53:30','2025-07-22 19:53:30'),(3,'vegan','boolean',NULL,NULL,1,'2025-07-22 19:53:30','2025-07-22 19:53:30'),(4,'calories','number',NULL,'kcal',1,'2025-07-22 19:53:30','2025-07-22 19:53:30'),(5,'fat','number',NULL,'g',1,'2025-07-22 19:53:30','2025-07-22 19:53:30'),(6,'protein','number',NULL,'g',1,'2025-07-22 19:53:30','2025-07-22 19:53:30'),(7,'carbs','number',NULL,'g',1,'2025-07-22 19:53:30','2025-07-22 19:53:30'),(8,'spicy_level','selection','[\"Not Spicy\", \"Mild\", \"Medium\", \"Hot\", \"Extra Hot\"]',NULL,1,'2025-07-22 19:53:30','2025-07-22 19:53:30');
/*!40000 ALTER TABLE `properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `food_id` int NOT NULL,
  `rating` int NOT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `customer_id` (`customer_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_feature_items`
--

DROP TABLE IF EXISTS `store_feature_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_feature_items` (
  `store_id` int NOT NULL,
  `category_id` int NOT NULL,
  `position` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`store_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `store_feature_items_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON UPDATE CASCADE,
  CONSTRAINT `store_feature_items_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_feature_items`
--

LOCK TABLES `store_feature_items` WRITE;
/*!40000 ALTER TABLE `store_feature_items` DISABLE KEYS */;
INSERT INTO `store_feature_items` VALUES (1,1,1,'2025-07-23 20:32:46','2025-07-23 20:32:46'),(1,2,2,'2025-07-23 20:33:50','2025-07-23 20:33:50'),(1,3,4,'2025-07-23 20:33:54','2025-07-23 20:33:54'),(1,4,3,'2025-07-23 20:33:52','2025-07-23 20:33:52'),(4,5,1,'2025-07-24 21:34:11','2025-07-24 21:34:11');
/*!40000 ALTER TABLE `store_feature_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_profiles`
--

DROP TABLE IF EXISTS `store_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_profiles` (
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `vehicle_plate` varchar(255) DEFAULT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `is_courier_active` tinyint(1) DEFAULT '1',
  `full_name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `store_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `store_profiles_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_profiles`
--

LOCK TABLES `store_profiles` WRITE;
/*!40000 ALTER TABLE `store_profiles` DISABLE KEYS */;
INSERT INTO `store_profiles` VALUES (3,1,'tch','tch@mail.com',NULL,NULL,0,'tch','0111222333','2025-07-23 07:39:15','2025-07-23 07:39:15'),(4,2,'manager','manager@grr.com',NULL,NULL,0,'GRR Manager','0909000001','2025-07-23 11:30:58','2025-07-23 11:30:58'),(5,3,'manager','manager@pizzahut.com',NULL,NULL,0,'Pizza Hut Manager','0909000002','2025-07-23 11:31:16','2025-07-23 11:31:16'),(6,4,'manager','manager@kfc.com',NULL,NULL,0,'KFC Manager','0909000003','2025-07-23 11:31:24','2025-07-23 11:31:24'),(7,5,'manager','manager@jollibee.com',NULL,NULL,0,'Jollibee Manager','0909000004','2025-07-23 11:31:31','2025-07-23 11:31:31'),(8,6,'manager','manager@lotteria.com',NULL,NULL,0,'Lotteria Manager','0909000005','2025-07-23 11:31:38','2025-07-23 11:31:38'),(9,7,'manager','manager@dominos.com',NULL,NULL,0,'Domino\'s Manager','0909000007','2025-07-23 11:31:54','2025-07-23 11:31:54'),(10,8,'manager','manager@burgerking.com',NULL,NULL,0,'Burger King Manager','0909000008','2025-07-23 11:32:00','2025-07-23 11:32:00'),(11,9,'manager','manager@highlands.com',NULL,NULL,0,'Highlands Manager','0909000009','2025-07-23 11:32:06','2025-07-23 11:32:06'),(12,10,'manager','manager@thecoffeehouse.com',NULL,NULL,0,'TCH Manager','0909000010','2025-07-23 11:32:13','2025-07-23 11:32:13'),(14,3,'saleagent','saleagent@pizzahut.com',NULL,NULL,1,'SaleAgent PH 1','0111222333','2025-07-24 12:42:26','2025-07-24 12:42:26'),(15,3,'courier','courier@pizzahut.com','30A-23521','bicycle',1,'Courier PH','0999999999','2025-07-24 12:42:57','2025-07-24 12:42:57'),(16,4,'kfc','kfc@sale.com',NULL,NULL,1,'KFC Sale','0123456789','2025-07-24 21:32:55','2025-07-24 21:32:55'),(17,4,'courier','courier@kfc.com','23A-23452','car',1,'Courier KCCC','022333445','2025-07-24 21:33:18','2025-07-24 21:33:18');
/*!40000 ALTER TABLE `store_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_settings` (
  `store_id` int NOT NULL,
  `allow_pick_up` tinyint(1) NOT NULL DEFAULT '0',
  `shipping_per_km_fee` int NOT NULL DEFAULT '10000',
  `minimum_shipping_fee` int NOT NULL DEFAULT '20000',
  `shipping_distance_limit` int NOT NULL DEFAULT '10',
  `shipping_distance_to_calculate_fee` int NOT NULL DEFAULT '3',
  `minimum_order_price` int NOT NULL DEFAULT '0',
  `bank` varchar(255) DEFAULT 'VIETCOMBANK',
  `bank_number` varchar(255) DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`store_id`),
  CONSTRAINT `store_settings_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
INSERT INTO `store_settings` VALUES (1,0,10000,20000,10,3,0,'VIETCOMBANK','','2025-07-23 07:46:24','2025-07-23 07:46:24'),(3,1,10000,20000,10,3,0,'Techcombank','','2025-07-24 12:41:31','2025-07-24 12:41:31'),(4,1,10000,200000,99,10,4,'TPBank','19037648903016','2025-07-24 21:32:28','2025-07-24 21:32:28');
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stores`
--

DROP TABLE IF EXISTS `stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stores` (
  `store_id` int NOT NULL AUTO_INCREMENT,
  `store_name` varchar(255) NOT NULL,
  `description` text,
  `avatar_url` varchar(255) DEFAULT NULL,
  `cover_image_url` varchar(255) DEFAULT NULL,
  `address` varchar(255) NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `status` enum('active','inactive','banned') DEFAULT 'active',
  `is_active` tinyint(1) DEFAULT '1',
  `is_temp_closed` tinyint(1) DEFAULT '0',
  `rating` decimal(3,2) DEFAULT '0.00',
  `total_reviews` int DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`store_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stores`
--

LOCK TABLES `stores` WRITE;
/*!40000 ALTER TABLE `stores` DISABLE KEYS */;
INSERT INTO `stores` VALUES (1,'TCH','Desc','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJv1Ez38RZVPgEt6nYHp0NYkoUDXI8Y1Nyig&s','https://winci.com.vn/wp-content/uploads/2024/02/thuong-hieu-The-Coffee-House.jpg','',NULL,NULL,'','','09:00:00','22:00:00','active',1,0,0.00,0,'2025-07-23 07:39:15','2025-07-26 13:44:53'),(2,'GRR','Famous hotpot and grilled buffet restaurant.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS6LRE1S926N-wENYRGsNoGeiTOwJaglgEHQ&s','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS6LRE1S926N-wENYRGsNoGeiTOwJaglgEHQ&s','123 Lê Văn Lương, Hà Nội',20.77599300,105.83451800,'0909000001','manager@grr.com','14:00:00','15:00:00','active',1,0,0.00,0,'2025-07-23 11:30:58','2025-07-26 13:44:50'),(3,'Pizza Hut','Delicious American-style pizza and pasta.','https://iph.vn/storage/dine/fastfood/kisspng-pizza-hut-logo-symbol-food-fair-lakes-pizza-hut-5b693b93c0d2c33095130015336231877898.jpg','https://pizzahut.vn/_next/image?url=https%3A%2F%2Fcdn.pizzahut.vn%2Fimages%2FWeb_V3%2FHomepage%2FMobile_Hometop%20Red%20Mb_BNPPK_170320250616.webp&w=1170&q=70','456 Nguyễn Trãi, TP.HCM',20.90000000,105.58300000,'0909000002','manager@pizzahut.com','15:00:00','16:00:00','active',1,0,0.00,0,'2025-07-23 11:31:16','2025-07-24 22:52:03'),(4,'KFC','Famous fried chicken chain from the US.','https://static.tnex.com.vn/uploads/2023/06/word-image-15111-1.jpeg','https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/avatars/stores/c2300c9a14415a272088f7eb5628f983.jpg','789 Cách Mạng Tháng 8, Đà Nẵng',20.93495300,105.62477000,'0909000003','manager@kfc.com','00:00:00','17:00:00','active',1,0,0.00,0,'2025-07-23 11:31:24','2025-07-26 13:44:48'),(5,'Jollibee','Popular Filipino fast food restaurant.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwhfatLFbKbxYoN5lUKlVhl71_fj3LzjS19w&s','https://upload.urbox.vn/strapi/Jollibee_003_b6c3642178.jpg','321 Lý Thường Kiệt, Hà Nội',21.03469300,105.62423200,'0909000004','manager@jollibee.com','15:00:00','19:30:00','active',1,0,0.00,0,'2025-07-23 11:31:31','2025-07-26 13:44:46'),(6,'Lotteria','Korean fast-food chain famous for burgers and fried chicken.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToeF6iNZ7qPmi2Js5RUKXl91SmRj2otZ9RNA&s',NULL,'15 Trần Phú, Nha Trang',20.74332900,105.77021800,'0909000005','manager@lotteria.com','12:00:00','22:00:00','active',1,0,0.00,0,'2025-07-23 11:31:38','2025-07-23 11:31:38'),(7,'Domino\'s Pizza','Worldwide pizza delivery brand.',NULL,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR2JBeQxS6uXOguZp1zzlTls-z2rIlNQcelg&s','43 Hùng Vương, Huế',20.83708800,105.73191500,'0909000007','manager@dominos.com','11:00:00','18:00:00','active',1,0,0.00,0,'2025-07-23 11:31:54','2025-07-23 11:31:54'),(8,'Burger King','Flame-grilled burgers and global fast food.','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ--1MJsy7_DWpEDHBVdc8L7Vn-neqF-M_MyA&s','https://i-kinhdoanh.vnecdn.net/2023/07/21/3-4693-1689907755.png','88 Nguyễn Huệ, TP.HCM',20.92702200,105.63822400,'0909000008','manager@burgerking.com','10:00:00','20:00:00','active',1,0,0.00,0,'2025-07-23 11:32:00','2025-07-23 11:32:00'),(9,'Highlands Coffee','Popular Vietnamese coffee chain.','https://gigamall.com.vn/data/2022/06/13/09160234_logo-highland-900x900.png',NULL,'12 Nguyễn Thị Minh Khai, Đà Lạt',20.90045800,105.56448800,'0909000009','manager@highlands.com','09:00:00','19:00:00','active',1,0,0.00,1,'2025-07-23 11:32:06','2025-07-23 11:32:06'),(10,'The Coffee House','Modern coffee shop with great ambiance.',NULL,'https://file.hstatic.net/1000075078/article/2_c7d67b2212114f29a2db4e0b6643825e.jpg','75 Phan Đình Phùng, Hà Nội',20.86238500,105.63127400,'0909000010','manager@thecoffeehouse.com','19:30:00','22:00:00','active',1,0,0.00,0,'2025-07-23 11:32:13','2025-07-23 11:32:13');
/*!40000 ALTER TABLE `stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_profiles`
--

DROP TABLE IF EXISTS `system_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_profiles` (
  `user_id` int NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `system_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_profiles`
--

LOCK TABLES `system_profiles` WRITE;
/*!40000 ALTER TABLE `system_profiles` DISABLE KEYS */;
INSERT INTO `system_profiles` VALUES (1,'','','2025-07-23 07:36:19','2025-07-23 07:36:19'),(18,'Support Yami 1','0111222333','2025-07-26 07:32:57','2025-07-26 07:32:57'),(19,'Yuumi','0222333444','2025-07-26 07:34:12','2025-07-26 07:34:12');
/*!40000 ALTER TABLE `system_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_messages`
--

DROP TABLE IF EXISTS `ticket_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `sender_type` varchar(20) NOT NULL DEFAULT 'customer',
  `message_content` text NOT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`message_id`),
  KEY `ticket_id` (`ticket_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `ticket_messages_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`ticket_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_messages`
--

LOCK TABLES `ticket_messages` WRITE;
/*!40000 ALTER TABLE `ticket_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `ticket_code` varchar(255) NOT NULL,
  `requester_id` int NOT NULL,
  `assigned_to` int DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  UNIQUE KEY `ticket_code` (`ticket_code`),
  KEY `requester_id` (`requester_id`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_discount_usages`
--

DROP TABLE IF EXISTS `user_discount_usages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_discount_usages` (
  `usage_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `discount_id` int NOT NULL,
  `order_id` int NOT NULL,
  `snapshot_discount_code` varchar(255) NOT NULL,
  `snapshot_discount_name` varchar(255) NOT NULL,
  `snapshot_discount_type` varchar(255) NOT NULL,
  `snapshot_discount_sale_type` varchar(255) NOT NULL,
  `snapshot_discount_value` varchar(255) NOT NULL,
  `snapshot_discount_amount` varchar(255) NOT NULL,
  `real_discount_amount` decimal(12,2) NOT NULL,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`usage_id`),
  UNIQUE KEY `user_discount_usages_discount_id_order_id_unique` (`discount_id`,`order_id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `user_discount_usages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `user_discount_usages_ibfk_2` FOREIGN KEY (`discount_id`) REFERENCES `discounts` (`discount_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_discount_usages_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_discount_usages`
--

LOCK TABLES `user_discount_usages` WRITE;
/*!40000 ALTER TABLE `user_discount_usages` DISABLE KEYS */;
INSERT INTO `user_discount_usages` VALUES (1,2,1,11,'SWP391','Name','percentage','items','50.00','100000.00',50000.00,'2025-07-24 23:18:06'),(2,2,2,15,'KFCNEW','kfc neww','fixed_amount','items','100000.00','0.00',100000.00,'2025-07-24 23:57:25'),(3,13,2,17,'KFCNEW','kfc neww','fixed_amount','items','100000.00','0.00',100000.00,'2025-07-25 00:40:25'),(4,2,3,21,'FREESHIP25','KFC Freeship for FPT','percentage','delivery','50.00','50000.00',25000.00,'2025-07-26 12:12:20');
/*!40000 ALTER TABLE `user_discount_usages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_follow_stores`
--

DROP TABLE IF EXISTS `user_follow_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_follow_stores` (
  `user_id` int NOT NULL,
  `store_id` int NOT NULL,
  `followed_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`store_id`),
  UNIQUE KEY `user_follow_stores_store_id_user_id_unique` (`user_id`,`store_id`),
  KEY `store_id` (`store_id`),
  CONSTRAINT `user_follow_stores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_follow_stores_ibfk_2` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_follow_stores`
--

LOCK TABLES `user_follow_stores` WRITE;
/*!40000 ALTER TABLE `user_follow_stores` DISABLE KEYS */;
INSERT INTO `user_follow_stores` VALUES (2,1,'2025-07-23 22:31:41'),(21,2,'2025-07-26 17:28:11');
/*!40000 ALTER TABLE `user_follow_stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group_permissions`
--

DROP TABLE IF EXISTS `user_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_group_permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_group_permissions_permission_id_group_id_unique` (`group_id`,`permission_id`),
  UNIQUE KEY `user_group_permissions_group_id_permission_id` (`group_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `user_group_permissions_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_group_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1011 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group_permissions`
--

LOCK TABLES `user_group_permissions` WRITE;
/*!40000 ALTER TABLE `user_group_permissions` DISABLE KEYS */;
INSERT INTO `user_group_permissions` VALUES (759,6,206969,'2025-07-26 06:41:18'),(760,6,206970,'2025-07-26 06:41:18'),(761,6,207024,'2025-07-26 06:41:18'),(762,6,207025,'2025-07-26 06:41:18'),(763,6,207026,'2025-07-26 06:41:18'),(764,6,207027,'2025-07-26 06:41:18'),(765,6,207028,'2025-07-26 06:41:18'),(766,6,207029,'2025-07-26 06:41:18'),(767,6,207030,'2025-07-26 06:41:18'),(768,6,207031,'2025-07-26 06:41:18'),(769,6,207032,'2025-07-26 06:41:18'),(770,6,207033,'2025-07-26 06:41:18'),(771,6,207034,'2025-07-26 06:41:18'),(772,6,207035,'2025-07-26 06:41:18'),(773,6,207036,'2025-07-26 06:41:18'),(774,6,207037,'2025-07-26 06:41:18'),(775,6,207038,'2025-07-26 06:41:18'),(776,6,207039,'2025-07-26 06:41:18'),(777,6,207040,'2025-07-26 06:41:18'),(778,6,207041,'2025-07-26 06:41:18'),(779,6,207042,'2025-07-26 06:41:18'),(780,6,207043,'2025-07-26 06:41:18'),(781,6,207044,'2025-07-26 06:41:18'),(782,6,207045,'2025-07-26 06:41:18'),(783,6,207046,'2025-07-26 06:41:18'),(784,6,207047,'2025-07-26 06:41:18'),(785,6,207048,'2025-07-26 06:41:18'),(786,6,207049,'2025-07-26 06:41:18'),(787,6,207050,'2025-07-26 06:41:18'),(788,6,207051,'2025-07-26 06:41:18'),(789,6,207052,'2025-07-26 06:41:18'),(790,5,206976,'2025-07-26 06:52:15'),(791,5,206978,'2025-07-26 06:52:15'),(792,2,206950,'2025-07-26 07:56:42'),(793,1,206936,'2025-07-26 08:48:54'),(794,1,206937,'2025-07-26 08:48:54'),(795,1,206938,'2025-07-26 08:48:54'),(796,1,206939,'2025-07-26 08:48:54'),(797,1,206940,'2025-07-26 08:48:55'),(798,1,206941,'2025-07-26 08:48:55'),(799,1,206942,'2025-07-26 08:48:55'),(800,1,206943,'2025-07-26 08:48:55'),(801,1,206944,'2025-07-26 08:48:55'),(802,1,206945,'2025-07-26 08:48:55'),(803,1,206946,'2025-07-26 08:48:55'),(804,1,206947,'2025-07-26 08:48:55'),(805,1,206948,'2025-07-26 08:48:55'),(806,1,206949,'2025-07-26 08:48:55'),(807,1,206950,'2025-07-26 08:48:55'),(808,1,206951,'2025-07-26 08:48:55'),(809,1,206952,'2025-07-26 08:48:55'),(810,1,206953,'2025-07-26 08:48:55'),(811,1,206954,'2025-07-26 08:48:55'),(812,1,206955,'2025-07-26 08:48:55'),(813,1,206956,'2025-07-26 08:48:55'),(814,1,206957,'2025-07-26 08:48:55'),(815,1,206958,'2025-07-26 08:48:55'),(816,1,206959,'2025-07-26 08:48:55'),(817,1,206960,'2025-07-26 08:48:55'),(818,1,206961,'2025-07-26 08:48:55'),(819,1,206962,'2025-07-26 08:48:55'),(820,1,206968,'2025-07-26 08:48:55'),(821,1,206969,'2025-07-26 08:48:55'),(822,1,206970,'2025-07-26 08:48:55'),(823,1,206971,'2025-07-26 08:48:55'),(824,1,206972,'2025-07-26 08:48:55'),(825,1,206973,'2025-07-26 08:48:55'),(826,1,206974,'2025-07-26 08:48:55'),(827,1,206975,'2025-07-26 08:48:55'),(828,1,206976,'2025-07-26 08:48:55'),(829,1,206977,'2025-07-26 08:48:55'),(830,1,206978,'2025-07-26 08:48:55'),(831,1,206979,'2025-07-26 08:48:55'),(832,1,206980,'2025-07-26 08:48:55'),(833,1,206981,'2025-07-26 08:48:55'),(834,1,206982,'2025-07-26 08:48:55'),(835,1,206983,'2025-07-26 08:48:55'),(836,1,206984,'2025-07-26 08:48:55'),(837,1,206985,'2025-07-26 08:48:55'),(838,1,206986,'2025-07-26 08:48:55'),(839,1,206987,'2025-07-26 08:48:55'),(840,1,206988,'2025-07-26 08:48:55'),(841,1,206989,'2025-07-26 08:48:55'),(842,1,206990,'2025-07-26 08:48:55'),(843,1,206991,'2025-07-26 08:48:56'),(844,1,206992,'2025-07-26 08:48:56'),(845,1,206993,'2025-07-26 08:48:56'),(846,1,206994,'2025-07-26 08:48:56'),(847,1,206995,'2025-07-26 08:48:56'),(848,1,206996,'2025-07-26 08:48:58'),(849,1,206997,'2025-07-26 08:48:58'),(850,1,206998,'2025-07-26 08:48:58'),(851,1,206999,'2025-07-26 08:48:58'),(852,1,207000,'2025-07-26 08:48:58'),(853,1,207001,'2025-07-26 08:48:58'),(854,1,207002,'2025-07-26 08:48:58'),(855,1,207003,'2025-07-26 08:48:58'),(856,1,207004,'2025-07-26 08:48:58'),(857,1,207005,'2025-07-26 08:48:58'),(858,1,207006,'2025-07-26 08:48:58'),(859,1,207007,'2025-07-26 08:48:58'),(860,1,207008,'2025-07-26 08:48:58'),(861,1,207021,'2025-07-26 08:48:58'),(862,1,207024,'2025-07-26 08:48:58'),(863,1,207025,'2025-07-26 08:48:58'),(864,1,207026,'2025-07-26 08:48:58'),(865,1,207027,'2025-07-26 08:48:58'),(866,1,207028,'2025-07-26 08:48:58'),(867,1,207029,'2025-07-26 08:48:58'),(868,1,207030,'2025-07-26 08:48:58'),(869,1,207031,'2025-07-26 08:48:58'),(870,1,207032,'2025-07-26 08:48:58'),(871,1,207033,'2025-07-26 08:48:58'),(872,1,207034,'2025-07-26 08:48:58'),(873,1,207035,'2025-07-26 08:48:58'),(874,1,207036,'2025-07-26 08:48:58'),(875,1,207037,'2025-07-26 08:48:58'),(876,1,207038,'2025-07-26 08:48:58'),(877,1,207039,'2025-07-26 08:48:58'),(878,1,207040,'2025-07-26 08:48:58'),(879,1,207041,'2025-07-26 08:48:58'),(880,1,207042,'2025-07-26 08:48:58'),(881,1,207043,'2025-07-26 08:48:58'),(882,1,207044,'2025-07-26 08:48:58'),(883,1,207045,'2025-07-26 08:48:58'),(884,1,207046,'2025-07-26 08:48:58'),(885,1,207047,'2025-07-26 08:48:58'),(886,1,207048,'2025-07-26 08:48:58'),(887,1,207049,'2025-07-26 08:48:58'),(888,1,207050,'2025-07-26 08:48:58'),(889,1,207051,'2025-07-26 08:48:58'),(890,1,207052,'2025-07-26 08:48:58'),(891,1,207058,'2025-07-26 08:48:59'),(892,1,207059,'2025-07-26 08:48:59'),(893,1,207060,'2025-07-26 08:48:59'),(894,1,207061,'2025-07-26 08:48:59'),(895,2,206958,'2025-07-26 08:48:59'),(896,2,206959,'2025-07-26 08:48:59'),(897,2,206960,'2025-07-26 08:48:59'),(898,2,206961,'2025-07-26 08:48:59'),(899,2,206962,'2025-07-26 08:48:59'),(900,3,206968,'2025-07-26 08:48:59'),(901,3,206969,'2025-07-26 08:48:59'),(902,3,206970,'2025-07-26 08:48:59'),(903,3,206971,'2025-07-26 08:48:59'),(904,3,206972,'2025-07-26 08:48:59'),(905,3,206973,'2025-07-26 08:48:59'),(906,3,206974,'2025-07-26 08:48:59'),(907,3,206975,'2025-07-26 08:48:59'),(908,3,206976,'2025-07-26 08:48:59'),(909,3,206977,'2025-07-26 08:48:59'),(910,3,206978,'2025-07-26 08:48:59'),(911,3,206979,'2025-07-26 08:48:59'),(912,3,206980,'2025-07-26 08:48:59'),(913,3,206981,'2025-07-26 08:48:59'),(914,3,206982,'2025-07-26 08:48:59'),(915,3,206983,'2025-07-26 08:48:59'),(916,3,206984,'2025-07-26 08:48:59'),(917,3,206985,'2025-07-26 08:48:59'),(918,3,206986,'2025-07-26 08:48:59'),(919,3,206987,'2025-07-26 08:48:59'),(920,3,206988,'2025-07-26 08:48:59'),(921,3,206989,'2025-07-26 08:48:59'),(922,3,206990,'2025-07-26 08:48:59'),(923,3,206991,'2025-07-26 08:48:59'),(924,3,206992,'2025-07-26 08:48:59'),(925,3,206993,'2025-07-26 08:48:59'),(926,3,206994,'2025-07-26 08:48:59'),(927,3,206995,'2025-07-26 08:48:59'),(928,3,206996,'2025-07-26 08:48:59'),(929,3,206997,'2025-07-26 08:48:59'),(930,3,206998,'2025-07-26 08:48:59'),(931,3,206999,'2025-07-26 08:48:59'),(932,3,207000,'2025-07-26 08:48:59'),(933,3,207001,'2025-07-26 08:48:59'),(934,3,207002,'2025-07-26 08:48:59'),(935,3,207003,'2025-07-26 08:48:59'),(936,3,207004,'2025-07-26 08:48:59'),(937,3,207005,'2025-07-26 08:48:59'),(938,3,207006,'2025-07-26 08:48:59'),(939,3,207007,'2025-07-26 08:48:59'),(940,3,207008,'2025-07-26 08:48:59'),(941,4,206968,'2025-07-26 08:48:59'),(942,4,206969,'2025-07-26 08:48:59'),(943,4,206970,'2025-07-26 08:49:00'),(944,4,206971,'2025-07-26 08:49:00'),(945,4,206987,'2025-07-26 08:49:00'),(946,4,206988,'2025-07-26 08:49:00'),(947,4,206989,'2025-07-26 08:49:00'),(948,4,206976,'2025-07-26 08:49:00'),(949,4,206978,'2025-07-26 08:49:00'),(950,4,206981,'2025-07-26 08:49:00'),(951,4,206983,'2025-07-26 08:49:00'),(952,5,206968,'2025-07-26 08:49:00'),(953,5,206969,'2025-07-26 08:49:00'),(954,5,206970,'2025-07-26 08:49:00'),(955,5,206971,'2025-07-26 08:49:00'),(956,5,206987,'2025-07-26 08:49:00'),(957,5,206988,'2025-07-26 08:49:00'),(958,5,206989,'2025-07-26 08:49:00'),(959,5,206981,'2025-07-26 08:49:00'),(960,5,206983,'2025-07-26 08:49:00'),(961,6,206968,'2025-07-26 08:49:00'),(962,6,207021,'2025-07-26 08:49:00'),(963,1,210311,'2025-07-26 11:13:26'),(964,3,210311,'2025-07-26 11:13:26'),(965,4,206972,'2025-07-26 11:58:22'),(966,4,206973,'2025-07-26 11:58:22'),(967,4,206974,'2025-07-26 11:58:22'),(968,4,206975,'2025-07-26 11:58:22'),(969,4,206977,'2025-07-26 11:58:22'),(970,4,206979,'2025-07-26 11:58:22'),(971,4,206980,'2025-07-26 11:58:22'),(972,4,206982,'2025-07-26 11:58:22'),(973,4,206984,'2025-07-26 11:58:22'),(974,4,206985,'2025-07-26 11:58:22'),(975,4,206986,'2025-07-26 11:58:22'),(976,4,206990,'2025-07-26 11:58:22'),(977,4,206991,'2025-07-26 11:58:22'),(978,4,206992,'2025-07-26 11:58:22'),(979,4,206993,'2025-07-26 11:58:22'),(980,4,206994,'2025-07-26 11:58:22'),(981,4,206995,'2025-07-26 11:58:22'),(982,4,206996,'2025-07-26 11:58:22'),(983,4,206997,'2025-07-26 11:58:22'),(984,4,206998,'2025-07-26 11:58:22'),(985,4,206999,'2025-07-26 11:58:22'),(986,4,207000,'2025-07-26 11:58:22'),(987,4,207001,'2025-07-26 11:58:22'),(988,4,207002,'2025-07-26 11:58:22'),(989,4,207003,'2025-07-26 11:58:22'),(990,4,207004,'2025-07-26 11:58:22'),(991,4,207005,'2025-07-26 11:58:22'),(992,4,207006,'2025-07-26 11:58:22'),(993,4,207007,'2025-07-26 11:58:22'),(994,4,207008,'2025-07-26 11:58:22'),(995,1,210609,'2025-07-26 11:58:28'),(996,5,210609,'2025-07-26 11:58:28'),(997,1,211591,'2025-07-26 12:16:11'),(998,1,211592,'2025-07-26 12:16:11'),(999,1,211593,'2025-07-26 12:16:11'),(1000,4,211591,'2025-07-26 12:16:11'),(1001,4,211592,'2025-07-26 12:16:11'),(1002,4,211593,'2025-07-26 12:16:11'),(1003,3,211591,'2025-07-26 12:16:20'),(1004,3,211592,'2025-07-26 12:16:20'),(1005,3,211593,'2025-07-26 12:16:20'),(1006,5,211591,'2025-07-26 12:16:20'),(1007,5,211592,'2025-07-26 12:16:20'),(1008,5,211593,'2025-07-26 12:16:20'),(1009,2,206938,'2025-07-26 15:43:44'),(1010,2,206939,'2025-07-26 15:43:57');
/*!40000 ALTER TABLE `user_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_groups`
--

DROP TABLE IF EXISTS `user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `type` enum('system','store','customer') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_groups`
--

LOCK TABLES `user_groups` WRITE;
/*!40000 ALTER TABLE `user_groups` DISABLE KEYS */;
INSERT INTO `user_groups` VALUES (1,'system_admin','system','System administrators with full access',0,'2025-07-22 19:53:20','2025-07-22 19:53:20'),(2,'support_agent','system','Customer support staff',0,'2025-07-22 19:53:20','2025-07-22 19:53:20'),(3,'manager','store','Store managers',0,'2025-07-22 19:53:20','2025-07-22 19:53:20'),(4,'sale_agent','store','Sales representatives',0,'2025-07-22 19:53:20','2025-07-22 19:53:20'),(5,'courier','store','Delivery personnel',0,'2025-07-22 19:53:20','2025-07-22 19:53:20'),(6,'customer','customer','Regular customers',1,'2025-07-22 19:53:20','2025-07-22 19:53:20');
/*!40000 ALTER TABLE `user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_saved_products`
--

DROP TABLE IF EXISTS `user_saved_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_saved_products` (
  `user_id` int NOT NULL,
  `food_id` int NOT NULL,
  `saved_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`food_id`),
  UNIQUE KEY `user_saved_products_food_id_user_id_unique` (`user_id`,`food_id`),
  KEY `food_id` (`food_id`),
  CONSTRAINT `user_saved_products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_saved_products_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_saved_products`
--

LOCK TABLES `user_saved_products` WRITE;
/*!40000 ALTER TABLE `user_saved_products` DISABLE KEYS */;
INSERT INTO `user_saved_products` VALUES (2,17,'2025-07-24 11:54:06');
/*!40000 ALTER TABLE `user_saved_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `group_id` int NOT NULL,
  `is_enabled_2fa` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_groups` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@mail.com','$2b$10$rh1j5dT6SXGHpYIr3LiWYeR5uG2HJOc4CykFx1/C37t5Cfqm5X29i',NULL,1,0,1,'2025-07-23 07:19:37','2025-07-26 16:55:22'),(2,'customer@mail.com','$2b$10$cE.5wIdXJnwXub9Z1H1ZXuq9KldMRbNQ4BRbiynyANUXBOPbGedfK','https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/avatars/users/680e50d3d95550a463c1fd709fe52f10.jpg',6,0,1,'2025-07-23 07:20:09','2025-07-26 15:27:13'),(3,'tch@mail.com','$2b$10$1KhJj46nmpgwUt6xMTw9ouQOa78lFPCEyf2MbywVORItl62/gDrKy',NULL,3,0,1,'2025-07-23 07:39:15','2025-07-26 08:59:22'),(4,'manager@grr.com','$2b$10$6QeQt0OyKO29aZDBbYo9OutcJRhIasgJgqRxc1//QEuTlyBx8FTsa',NULL,3,0,1,'2025-07-23 11:30:58','2025-07-23 11:30:58'),(5,'manager@pizzahut.com','$2b$10$ftTCzEk85cpxdji4jijDjOsdYA8h7.zHnXauuqFZQUZIenpr0wmxW',NULL,3,0,1,'2025-07-23 11:31:16','2025-07-26 07:33:29'),(6,'manager@kfc.com','$2b$10$Pnm0gPVToLu2YgvN.3VgYOsbyqVSKEezg9ycWjqgKT8QCrfH5Ou3m',NULL,3,0,1,'2025-07-23 11:31:24','2025-07-26 13:35:05'),(7,'manager@jollibee.com','$2b$10$IHc89odXwEF3QkoYNB6T6uaJ9Zl/NzRvTScBkRBOQOwP0L7PN3/bi',NULL,3,0,1,'2025-07-23 11:31:31','2025-07-23 11:31:31'),(8,'manager@lotteria.com','$2b$10$/B7biPfFYBgmPObao3/v5.Mf6WeL5rxCsJqM5Cwo28Xs.viTIcSQu',NULL,3,0,1,'2025-07-23 11:31:38','2025-07-23 11:31:38'),(9,'manager@dominos.com','$2b$10$BqBftaAwfoXGCz.pZUJpUeVTr4n3uluAS3GXw8k1DFTgKQNPnaO1O',NULL,3,0,1,'2025-07-23 11:31:54','2025-07-23 11:31:54'),(10,'manager@burgerking.com','$2b$10$AauF5IZmk4TmutAF62jL.Oy7T3ei9IqGgrINZwUjQBuNVOs0fvUyq',NULL,3,0,1,'2025-07-23 11:32:00','2025-07-23 11:32:00'),(11,'manager@highlands.com','$2b$10$kh3uzoJNoasci5nCOZhyDeJgDofF7vCQ/TEm95Y5lOuEWSRcsyv8G',NULL,3,0,1,'2025-07-23 11:32:06','2025-07-23 11:32:06'),(12,'manager@thecoffeehouse.com','$2b$10$mMiiPxfU6R8UOgi2VfZy.O5DpmHmT6fUif1rSS15QGEFnG.vp8JnK',NULL,3,0,1,'2025-07-23 11:32:13','2025-07-23 11:32:13'),(13,'customer2@mail.com','$2b$10$fnt3Qqo9fBDFVLW/za6iT.YUegy8EAQIvwmWV5sFgKaeLHG46RwHC',NULL,6,0,1,'2025-07-24 12:16:20','2025-07-25 00:14:56'),(14,'saleagent@pizzahut.com','$2b$10$TWEnvWHW30QYEfKFvThEM.1nvqjyhIRixq7odWtQFq7VYuL/8k4GC',NULL,4,0,1,'2025-07-24 12:42:26','2025-07-24 22:18:59'),(15,'courier@pizzahut.com','$2b$10$9fZu//PpTJXI86236KplveoxCAGe3BPT9XgDHvgnreB1FWD/EVSCG',NULL,5,0,1,'2025-07-24 12:42:57','2025-07-24 22:35:21'),(16,'kfc@sale.com','$2b$10$npcbcM3RIGJjvfXBYsBwNu3JOvW33/uQI9K/xHTTc9tYr/8qXdowG',NULL,4,0,1,'2025-07-24 21:32:55','2025-07-26 08:45:23'),(17,'courier@kfc.com','$2b$10$c3eI7HbarQjb2e41ZNvAK.gBlifn9XCEka.MEJ4LxdWggsXWohPs2',NULL,5,0,1,'2025-07-24 21:33:18','2025-07-26 08:40:10'),(18,'support@yami.com','$2b$10$BjYoue3ONv1DHEEKyU88SeGT4oESAa4QtakGvkfWwzeygSYH4S432',NULL,1,0,1,'2025-07-26 07:32:56','2025-07-26 12:16:29'),(19,'support2@yami.com','$2b$10$9hh9irRzb4UM3bP.pTVSK.Umy5NOMIRzsZj.gRBQmizGpUJZE5hm6',NULL,2,0,1,'2025-07-26 07:34:12','2025-07-26 15:43:29'),(20,'duongvlog16@gmail.com','$2b$10$oofoAHKYdObzBplRH4SnwebbHPdQ3FQ6dmCiaxqfiUdDb/e0EnL9.','https://emdjgjjfcvrgeqtwaybx.supabase.co/storage/v1/object/public/avatars/users/944e6e6299ea9790a05aa6fe1632261a.png',6,0,1,'2025-07-26 15:37:24','2025-07-26 15:44:50'),(21,'customer3@mail.com','$2b$10$yWILDVFSyv8lbMxwJGEXWOLX2wK5B7sE76d5mMvnKPuR0hr2UHmGO',NULL,6,0,1,'2025-07-26 16:12:19','2025-07-26 16:13:09');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification_codes`
--

DROP TABLE IF EXISTS `verification_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `code_type` enum('password_recovery','two_factor_auth','email_verification') NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT '0',
  `attempt_count` int DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `verification_codes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification_codes`
--

LOCK TABLES `verification_codes` WRITE;
/*!40000 ALTER TABLE `verification_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification_codes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-26 10:34:13
