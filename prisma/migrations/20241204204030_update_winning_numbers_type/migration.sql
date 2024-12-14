/*
  Warnings:

  - Added the required column `createdBy` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "createdBy" TEXT NOT NULL;
ALTER TABLE "Result" ADD COLUMN IF NOT EXISTS "loteria" TEXT;
ALTER TABLE "Bet" ADD COLUMN IF NOT EXISTS "loteria" TEXT;
