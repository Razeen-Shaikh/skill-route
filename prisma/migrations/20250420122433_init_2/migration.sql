/*
  Warnings:

  - The primary key for the `coin_wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `coin_wallet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `coin_wallet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_quiz_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `coinWalletId` on the `users_profile` table. All the data in the column will be lost.
  - You are about to drop the column `lastActivityId` on the `users_profile` table. All the data in the column will be lost.
  - The primary key for the `users_progress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users_progress` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users_progress` table. All the data in the column will be lost.
  - You are about to drop the column `streakCurrent` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakEnd` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakLast` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakLongest` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakLongestCount` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakLongestCurrent` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakLongestEnd` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakLongestLast` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakLongestStart` on the `users_streaks` table. All the data in the column will be lost.
  - You are about to drop the column `streakStart` on the `users_streaks` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,quizId]` on the table `user_quiz_attempts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,tutorialId]` on the table `users_progress` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `coin_wallet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `user_quiz_attempts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users_progress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "coin_wallet" DROP CONSTRAINT "coin_wallet_userId_fkey";

-- DropForeignKey
ALTER TABLE "last_activity" DROP CONSTRAINT "last_activity_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_quiz_attempts" DROP CONSTRAINT "user_quiz_attempts_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_badges" DROP CONSTRAINT "users_badges_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_profile" DROP CONSTRAINT "users_profile_coinWalletId_fkey";

-- DropForeignKey
ALTER TABLE "users_profile" DROP CONSTRAINT "users_profile_lastActivityId_fkey";

-- DropForeignKey
ALTER TABLE "users_progress" DROP CONSTRAINT "users_progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "users_streaks" DROP CONSTRAINT "users_streaks_user_id_fkey";

-- DropIndex
DROP INDEX "coin_wallet_userId_key";

-- DropIndex
DROP INDEX "user_quiz_attempts_quizId_userId_idx";

-- DropIndex
DROP INDEX "user_quiz_attempts_userId_quizId_key";

-- DropIndex
DROP INDEX "users_progress_tutorialId_userId_idx";

-- DropIndex
DROP INDEX "users_progress_userId_tutorialId_key";

-- AlterTable
ALTER TABLE "coin_wallet" DROP CONSTRAINT "coin_wallet_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "coin_wallet_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "user_quiz_attempts" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users_profile" DROP COLUMN "coinWalletId",
DROP COLUMN "lastActivityId";

-- AlterTable
ALTER TABLE "users_progress" DROP CONSTRAINT "users_progress_pkey",
DROP COLUMN "id",
DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "users_progress_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "users_streaks" DROP COLUMN "streakCurrent",
DROP COLUMN "streakEnd",
DROP COLUMN "streakLast",
DROP COLUMN "streakLongest",
DROP COLUMN "streakLongestCount",
DROP COLUMN "streakLongestCurrent",
DROP COLUMN "streakLongestEnd",
DROP COLUMN "streakLongestLast",
DROP COLUMN "streakLongestStart",
DROP COLUMN "streakStart",
ADD COLUMN     "currentEnd" TIMESTAMP(3),
ADD COLUMN     "currentStart" TIMESTAMP(3),
ADD COLUMN     "longestEnd" TIMESTAMP(3),
ADD COLUMN     "longestStart" TIMESTAMP(3),
ADD COLUMN     "longestStreak" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_LastActivityToUserProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LastActivityToUserProfile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_LastActivityToUserProfile_B_index" ON "_LastActivityToUserProfile"("B");

-- CreateIndex
CREATE INDEX "user_quiz_attempts_quizId_profileId_idx" ON "user_quiz_attempts"("quizId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "user_quiz_attempts_profileId_quizId_key" ON "user_quiz_attempts"("profileId", "quizId");

-- CreateIndex
CREATE INDEX "users_progress_tutorialId_user_id_idx" ON "users_progress"("tutorialId", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_progress_user_id_tutorialId_key" ON "users_progress"("user_id", "tutorialId");

-- AddForeignKey
ALTER TABLE "users_streaks" ADD CONSTRAINT "users_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coin_wallet" ADD CONSTRAINT "coin_wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quiz_attempts" ADD CONSTRAINT "user_quiz_attempts_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "users_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_progress" ADD CONSTRAINT "users_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_badges" ADD CONSTRAINT "users_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LastActivityToUserProfile" ADD CONSTRAINT "_LastActivityToUserProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "last_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LastActivityToUserProfile" ADD CONSTRAINT "_LastActivityToUserProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "users_profile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
