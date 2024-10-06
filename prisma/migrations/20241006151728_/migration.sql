/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sale` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "favorite" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Sale";
