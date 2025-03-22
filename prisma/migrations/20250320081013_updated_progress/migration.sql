-- AlterTable
ALTER TABLE "tutorials" ADD COLUMN     "hasChallenge" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users_progress" ADD COLUMN     "challengeCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "interviewCompleted" BOOLEAN NOT NULL DEFAULT false;
