import prisma from "@/lib/prisma";

/** Clears seedable data in FK-safe order for idempotent re-seeding */
export async function cleanDatabase() {
  console.log("🧹 Cleaning existing seed data...");

  await prisma.userQuestionAttempt.deleteMany();
  await prisma.lastActivity.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.userQuizAttempt.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.coinTransaction.deleteMany();
  await prisma.coinWallet.deleteMany();
  await prisma.userStreak.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.adminActivityLog.deleteMany();
  await prisma.roadmapProgress.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.tutorial.deleteMany();
  await prisma.roadmapStep.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.quizCategory.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Database cleaned");
}
