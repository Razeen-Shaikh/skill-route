/*
  Warnings:

  - You are about to drop the column `pointsReq` on the `badges` table. All the data in the column will be lost.
  - You are about to drop the column `pointsAwarded` on the `last_activity` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `quiz_questions` table. All the data in the column will be lost.
  - You are about to drop the column `pointsEarned` on the `user_question_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `users_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "badges" DROP COLUMN "pointsReq",
ADD COLUMN     "xpReq" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "last_activity" DROP COLUMN "pointsAwarded",
ADD COLUMN     "xpAwarded" INTEGER;

-- AlterTable
ALTER TABLE "quiz_questions" DROP COLUMN "points",
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_question_attempts" DROP COLUMN "pointsEarned",
ADD COLUMN     "xpEarned" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users_profile" DROP COLUMN "points";
