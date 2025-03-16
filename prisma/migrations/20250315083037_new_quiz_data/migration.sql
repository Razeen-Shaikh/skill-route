/*
  Warnings:

  - You are about to drop the column `option` on the `quiz_options` table. All the data in the column will be lost.
  - You are about to drop the column `quizId` on the `quiz_options` table. All the data in the column will be lost.
  - You are about to drop the column `correctOption` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `quizzes` table. All the data in the column will be lost.
  - Added the required column `optionText` to the `quiz_options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionId` to the `quiz_options` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "quiz_options" DROP CONSTRAINT "quiz_options_quizId_fkey";

-- AlterTable
ALTER TABLE "quiz_options" DROP COLUMN "option",
DROP COLUMN "quizId",
ADD COLUMN     "optionText" TEXT NOT NULL,
ADD COLUMN     "questionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "correctOption",
DROP COLUMN "question",
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "quiz_questions" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "correctOptionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quiz_questions_correctOptionId_key" ON "quiz_questions"("correctOptionId");

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_correctOptionId_fkey" FOREIGN KEY ("correctOptionId") REFERENCES "quiz_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "quiz_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
