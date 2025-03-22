/*
  Warnings:

  - You are about to drop the column `unlockPoints` on the `tutorials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tutorials" DROP COLUMN "unlockPoints",
ADD COLUMN     "cost" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nextTutorialId" INTEGER;
