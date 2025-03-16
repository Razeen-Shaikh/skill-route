-- DropForeignKey
ALTER TABLE "user_question_attempts" DROP CONSTRAINT "user_question_attempts_questionId_fkey";

-- AlterTable
ALTER TABLE "user_question_attempts" ADD COLUMN     "quizId" INTEGER;

-- AddForeignKey
ALTER TABLE "user_question_attempts" ADD CONSTRAINT "user_question_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
