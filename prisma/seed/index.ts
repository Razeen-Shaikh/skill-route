import prisma from "@/lib/prisma";
import { cleanDatabase } from "./clean";
import { seedUsers, seedTutorials } from "./seeders/content";
import { seedCategories, seedCompanies, seedTags } from "./seeders/catalog";
import { seedQuizzes } from "./seeders/quizzes";
import { seedRoadmaps } from "./seeders/roadmaps";
import { seedGamificationData } from "./seeders/gamification";

export async function runSeed() {
  console.log("🌱 Starting database seeding...");

  await cleanDatabase();

  const users = await seedUsers();
  const userIds = users.map((u) => u.id);

  const tutorials = await seedTutorials(userIds);
  const tutorialIds = tutorials.map((t) => t.id);

  const categoryMap = await seedCategories();
  const companyMap = await seedCompanies();
  const tagMap = await seedTags();

  const quizzes = await seedQuizzes(
    tutorialIds,
    categoryMap,
    companyMap,
    tagMap
  );

  const { roadmaps, steps } = await seedRoadmaps(userIds);

  await seedGamificationData(users, quizzes, tutorials, roadmaps, steps);

  console.log("✅ Database seeding completed successfully!");
}
