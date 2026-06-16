/*
  Warnings:

  - The primary key for the `users_badges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[slug]` on the table `badges` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `badges` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BadgeCriteria" AS ENUM ('XP', 'LEVEL', 'QUIZZES_PASSED', 'TUTORIALS_COMPLETED', 'ROADMAP_STEPS', 'STREAK', 'COINS', 'PERFECT_QUIZ');

-- DropIndex
DROP INDEX "users_badges_user_id_badgeId_key";

-- AlterTable
ALTER TABLE "badges" ADD COLUMN     "criteriaType" "BadgeCriteria" NOT NULL DEFAULT 'XP',
ADD COLUMN     "criteriaValue" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "imageUrl" SET DEFAULT '';

-- AlterTable
ALTER TABLE "users_badges" DROP CONSTRAINT "users_badges_pkey",
ADD CONSTRAINT "users_badges_pkey" PRIMARY KEY ("user_id", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_slug_key" ON "badges"("slug");
