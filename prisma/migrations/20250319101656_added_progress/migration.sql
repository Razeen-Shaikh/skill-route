/*
  Warnings:

  - You are about to drop the column `quizId` on the `user_question_attempts` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "user_question_attempts" DROP CONSTRAINT "user_question_attempts_quizId_fkey";

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "maxScore" INTEGER NOT NULL DEFAULT 100,
ADD COLUMN     "passPercentage" INTEGER NOT NULL DEFAULT 50;

-- AlterTable
ALTER TABLE "tutorials" ADD COLUMN     "authorId" INTEGER,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "difficulty" "DifficultyLevel" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_question_attempts" DROP COLUMN "quizId";

-- AlterTable
ALTER TABLE "users_progress" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "bestScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "percentageCompleted" INTEGER NOT NULL DEFAULT 0;
