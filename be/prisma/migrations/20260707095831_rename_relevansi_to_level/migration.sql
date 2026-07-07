/*
  Warnings:

  - You are about to drop the column `bobot_relevansi` on the `bobot` table. All the data in the column will be lost.
  - Added the required column `bobot_level` to the `bobot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `bobot` DROP COLUMN `bobot_relevansi`,
    ADD COLUMN `bobot_level` DOUBLE NOT NULL;
