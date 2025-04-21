/*
  Warnings:

  - The values [ML] on the enum `RoadmapType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `avatarUrl` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePictureUrl` on the `users_profile` table. All the data in the column will be lost.
  - The `completedQuizzes` column on the `users_profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `completedTutorials` column on the `users_profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RoadmapType_new" AS ENUM ('AI', 'BACKEND', 'DEVOPS', 'FRONTEND', 'FULLSTACK', 'DATA_SCIENCE', 'MOBILE', 'MACHINE_LEARNING', 'MERN', 'MEAN', 'BLOCKCHAIN', 'CYBER_SECURITY', 'GAMING', 'CLOUD', 'SOFTWARE_TESTING');
ALTER TABLE "roadmaps" ALTER COLUMN "type" TYPE "RoadmapType_new" USING ("type"::text::"RoadmapType_new");
ALTER TYPE "RoadmapType" RENAME TO "RoadmapType_old";
ALTER TYPE "RoadmapType_new" RENAME TO "RoadmapType";
DROP TYPE "RoadmapType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'ALL';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "avatarUrl";

-- AlterTable
ALTER TABLE "users_profile" DROP COLUMN "profilePictureUrl",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "completedChallenges" TEXT[],
ADD COLUMN     "completedInterviews" TEXT[],
ADD COLUMN     "completedProjects" TEXT[],
ADD COLUMN     "completedRoadmaps" TEXT[],
ADD COLUMN     "completedSteps" TEXT[],
DROP COLUMN "completedQuizzes",
ADD COLUMN     "completedQuizzes" TEXT[],
DROP COLUMN "completedTutorials",
ADD COLUMN     "completedTutorials" TEXT[];
