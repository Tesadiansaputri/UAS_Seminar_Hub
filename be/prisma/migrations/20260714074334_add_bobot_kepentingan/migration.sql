-- DropIndex
DROP INDEX `kriteria_kode_key` ON `kriteria`;

-- AlterTable
ALTER TABLE `kriteria` ADD COLUMN `bobot` DOUBLE NULL,
    ADD COLUMN `kepentingan` INTEGER NULL;
