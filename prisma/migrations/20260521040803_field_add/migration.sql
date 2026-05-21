/*
  Warnings:

  - Added the required column `organization` to the `investment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "investment" ADD COLUMN     "organization" TEXT NOT NULL;
