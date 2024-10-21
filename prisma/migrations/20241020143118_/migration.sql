/*
  Warnings:

  - Made the column `description` on table `Command` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "expires_at" TIMESTAMP(3),
ALTER COLUMN "description" SET NOT NULL;
