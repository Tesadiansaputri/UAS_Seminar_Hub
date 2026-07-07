-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id_category` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_category`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `level` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_level` VARCHAR(191) NOT NULL,
    `nilai_level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `speaker` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `bidang_keahlian` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `speaker_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seminar` (
    `id_seminar` INTEGER NOT NULL AUTO_INCREMENT,
    `seminar_name` VARCHAR(191) NOT NULL,
    `tanggal` DATETIME(3) NOT NULL,
    `harga` BIGINT NOT NULL,
    `kuota_tersedia` INTEGER NOT NULL,
    `id_category` INTEGER NOT NULL,
    `id_level` INTEGER NOT NULL,

    PRIMARY KEY (`id_seminar`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengisi_materi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seminarId` INTEGER NOT NULL,
    `speakerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fasilitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_fasilitas` VARCHAR(191) NOT NULL,
    `nilai_fasilitas` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelengkapan_fasilitas` (
    `seminarId` INTEGER NOT NULL,
    `fasilitasId` INTEGER NOT NULL,

    PRIMARY KEY (`seminarId`, `fasilitasId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating_pembicara` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,
    `speakerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bobot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `bobot_harga` DOUBLE NOT NULL,
    `bobot_kuota` DOUBLE NOT NULL,
    `bobot_rating` DOUBLE NOT NULL,
    `bobot_relevansi` DOUBLE NOT NULL,
    `bobot_fasilitas` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hasil` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `seminarId` INTEGER NOT NULL,
    `metode` VARCHAR(191) NOT NULL,
    `nilai` DOUBLE NOT NULL,
    `ranking` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `seminar` ADD CONSTRAINT `seminar_id_category_fkey` FOREIGN KEY (`id_category`) REFERENCES `category`(`id_category`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seminar` ADD CONSTRAINT `seminar_id_level_fkey` FOREIGN KEY (`id_level`) REFERENCES `level`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengisi_materi` ADD CONSTRAINT `pengisi_materi_seminarId_fkey` FOREIGN KEY (`seminarId`) REFERENCES `seminar`(`id_seminar`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengisi_materi` ADD CONSTRAINT `pengisi_materi_speakerId_fkey` FOREIGN KEY (`speakerId`) REFERENCES `speaker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelengkapan_fasilitas` ADD CONSTRAINT `kelengkapan_fasilitas_seminarId_fkey` FOREIGN KEY (`seminarId`) REFERENCES `seminar`(`id_seminar`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kelengkapan_fasilitas` ADD CONSTRAINT `kelengkapan_fasilitas_fasilitasId_fkey` FOREIGN KEY (`fasilitasId`) REFERENCES `fasilitas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating_pembicara` ADD CONSTRAINT `rating_pembicara_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rating_pembicara` ADD CONSTRAINT `rating_pembicara_speakerId_fkey` FOREIGN KEY (`speakerId`) REFERENCES `speaker`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bobot` ADD CONSTRAINT `bobot_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil` ADD CONSTRAINT `hasil_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hasil` ADD CONSTRAINT `hasil_seminarId_fkey` FOREIGN KEY (`seminarId`) REFERENCES `seminar`(`id_seminar`) ON DELETE RESTRICT ON UPDATE CASCADE;
