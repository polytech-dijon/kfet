/*
  Warnings:

  - You are about to drop the column `description` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `estimated_end` on the `Command` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "products";

-- AlterTable
ALTER TABLE "Command" DROP COLUMN "description",
DROP COLUMN "estimated_end",
ALTER COLUMN "status" SET DEFAULT E'PENDING';
