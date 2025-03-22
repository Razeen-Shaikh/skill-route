/*
  Warnings:

  - A unique constraint covering the columns `[tutorialId]` on the table `users_progress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_progress_tutorialId_key" ON "users_progress"("tutorialId");
