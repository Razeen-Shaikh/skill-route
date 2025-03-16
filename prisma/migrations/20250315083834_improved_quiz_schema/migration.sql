/*
  Warnings:

  - You are about to drop the column `correctOptionId` on the `quiz_questions` table. All the data in the column will be lost.
  - You are about to drop the `quiz_options` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "quiz_options" DROP CONSTRAINT "quiz_options_questionId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_correctOptionId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_quizId_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_tutorialId_fkey";

-- DropIndex
DROP INDEX "quiz_questions_correctOptionId_key";

-- AlterTable
ALTER TABLE "quiz_questions" DROP COLUMN "correctOptionId",
ADD COLUMN     "correctAnswer" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "options" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "tutorialId" DROP NOT NULL;

-- DropTable
DROP TABLE "quiz_options";

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
