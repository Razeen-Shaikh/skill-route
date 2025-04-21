/*
  Warnings:

  - The primary key for the `users_progress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `users_progress` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,tutorialId]` on the table `users_progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `users_progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users_progress" DROP CONSTRAINT "users_progress_user_id_fkey";

-- DropIndex
DROP INDEX "users_progress_tutorialId_user_id_idx";

-- DropIndex
DROP INDEX "users_progress_user_id_tutorialId_key";

-- AlterTable
ALTER TABLE "users_progress" DROP CONSTRAINT "users_progress_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "users_progress_tutorialId_profileId_idx" ON "users_progress"("tutorialId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "users_progress_profileId_tutorialId_key" ON "users_progress"("profileId", "tutorialId");

-- AddForeignKey
ALTER TABLE "users_progress" ADD CONSTRAINT "users_progress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "users_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
