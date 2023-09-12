-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Sep 12, 2023 at 09:44 PM
-- Server version: 8.0.31
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `solarsystem`
--

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `country` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `road` varchar(255) NOT NULL,
  `building` varchar(255) NOT NULL,
  `floor` int NOT NULL,
  `active` tinyint(1) NOT NULL,
  `uid` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`id`, `country`, `city`, `road`, `building`, `floor`, `active`, `uid`) VALUES
(10, 'Iraq', 'Najaf', 'Imam Ali', 'Al Shames Hotel', 2, 1, 3),
(9, 'Lebanon', 'Batroun', 'Old Market', 'Anywhere', 0, 0, 3),
(7, 'Lebanon', 'Beirut', 'Al Ajniha AL Khamsa', 'Al Taweel', 3, 0, 3);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
CREATE TABLE IF NOT EXISTS `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `total` double(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `uid`, `total`) VALUES
(1, 1, 800.00);

-- --------------------------------------------------------

--
-- Table structure for table `cartitems`
--

DROP TABLE IF EXISTS `cartitems`;
CREATE TABLE IF NOT EXISTS `cartitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` double(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cartitems`
--

INSERT INTO `cartitems` (`id`, `cart_id`, `product_id`, `quantity`, `price`) VALUES
(1, 1, 1, 2, 160.00),
(3, 1, 1, 3, 160.00);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'inverter'),
(2, 'panel'),
(3, 'battery'),
(4, 'misc');

-- --------------------------------------------------------

--
-- Table structure for table `orderproducts`
--

DROP TABLE IF EXISTS `orderproducts`;
CREATE TABLE IF NOT EXISTS `orderproducts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `order_price` double(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `total` double(10,2) NOT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `name` varchar(255) NOT NULL,
  `price` double(10,2) NOT NULL,
  `info` int NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `stock` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`name`, `price`, `info`, `photo_url`, `category_id`, `id`, `stock`) VALUES
('JA Solar Panel Mono-Crystalline', 160.00, 450, 'https://5.imimg.com/data5/GK/ED/MY-31702147/1kw-solax-grid-tie-inverter.png', 2, 1, 50),
('Lithium-Ion Golf Battery', 2000.00, 4000, 'https://5.imimg.com/data5/SELLER/Default/2022/10/RU/KM/LL/59750563/72-cells-monocrystalline-solar-panel-500x500.jpg', 3, 2, 50),
('Must Pro Inverter', 350.00, 5200, 'https://www.edfenergy.com/sites/default/files/styles/spire_tile__media__full__media_natural_aspect/public/picture3.jpg?itok=lxZAA9uL', 1, 3, 50),
('Jinko Tiger Pro P-type', 180.00, 550, 'https://5.imimg.com/data5/GK/ED/MY-31702147/1kw-solax-grid-tie-inverter.png', 2, 4, 50),
('Lead-Acid Battery', 600.00, 3000, 'https://5.imimg.com/data5/SELLER/Default/2022/10/RU/KM/LL/59750563/72-cells-monocrystalline-solar-panel-500x500.jpg', 3, 5, 50),
('Must Inverter', 300.00, 3500, 'https://www.edfenergy.com/sites/default/files/styles/spire_tile__media__full__media_natural_aspect/public/picture3.jpg?itok=lxZAA9uL', 1, 6, 50),
('test', 30.00, 0, '', 2, 9, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `email` varchar(251) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `password` varchar(255) NOT NULL,
  `display_name` varchar(251) NOT NULL,
  `photo_url` varchar(251) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `phone_number` int NOT NULL,
  `phone_prefix` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `admin`, `password`, `display_name`, `photo_url`, `id`, `phone_number`, `phone_prefix`) VALUES
('admin', 1, 'admin', 'admin', 'https://images.unsplash.com/photo-1518977081765-9b1b0c2538e2?w=1280&h=720', 1, 3030303, 961),
('1@1.com', 0, '1', '1', 'https://images.unsplash.com/photo-1518977081765-9b1b0c2538e2?w=1280&h=720', 3, 3030303, 961),
('2@2.com', 0, '2', '2', 'https://images.unsplash.com/photo-1518977081765-9b1b0c2538e2?w=1280&h=720', 5, 3030303, 961),
('3@3.com', 0, '3', '3', 'https://images.unsplash.com/photo-1518977081765-9b1b0c2538e2?w=1280&h=720', 2, 3030303, 961),
('4@4.com', 0, '4', '4', 'https://images.unsplash.com/photo-1518977081765-9b1b0c2538e2?w=1280&h=720', 23, 3030303, 961);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
