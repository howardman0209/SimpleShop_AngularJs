-- create database
CREATE DATABASE `AngularJsProject`;

-- create `Categories` tabel
CREATE TABLE `Categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `categoryId` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB

-- create `Products` tabel
CREATE TABLE `Products` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `productId` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `categoryName` varchar(255) DEFAULT NULL,
  `categoryId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB

-- create `Orders` tabel
CREATE TABLE `Orders` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `orderId` varchar(255) DEFAULT NULL,
  `createTime` varchar(255) DEFAULT NULL,
  `totalAmount` int DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `purchaseItems` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB

