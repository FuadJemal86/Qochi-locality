-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Family` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `familyName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `headId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Family_headId_key`(`headId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FamilyHead` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `contactInfo` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FamilyHead_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `type` ENUM('NEWBORN', 'PERMANENT') NOT NULL,
    `relationship` VARCHAR(191) NOT NULL,
    `education` VARCHAR(191) NULL,
    `occupation` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'MARRIED', 'DECEASED', 'LEFT_LOCALITY') NOT NULL DEFAULT 'ACTIVE',
    `birthCertificate` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,
    `deathCertificate` VARCHAR(191) NULL,
    `marriageCertificate` VARCHAR(191) NULL,
    `familyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Family` ADD CONSTRAINT `Family_headId_fkey` FOREIGN KEY (`headId`) REFERENCES `FamilyHead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Member` ADD CONSTRAINT `Member_familyId_fkey` FOREIGN KEY (`familyId`) REFERENCES `Family`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
