import prisma from "@/lib/prisma";
import { Tutorial, TutorialStatus, User, UserRole } from "@/generated/prisma";
import { seedHelper } from "@/lib/seedHelper";
import { tutorialsData, usersData } from "@/lib/data";

export async function seedUsers(): Promise<User[]> {
  console.log("🌱 Seeding users...");
  const users: User[] = [];

  for (const userData of usersData) {
    const createdAt = seedHelper.getRandomDate(
      new Date(),
      new Date(Date.now() + 60 * 60 * 1000)
    );
    const updatedAt = new Date(
      createdAt.getTime() +
        seedHelper
          .getRandomDate(new Date(), new Date(Date.now() + 60 * 60 * 1000))
          .getTime()
    );

    const user = await prisma.user.create({
      data: {
        username: userData.username ?? "user",
        firstName: userData.firstName ?? "",
        lastName: userData.lastName,
        email: userData.email ?? "default@mail.com",
        passwordHash: await seedHelper.hashPassword("password123"),
        role: (seedHelper.getRole() || "USER") as UserRole,
        emailVerified: true,
        failedAttempts: 0,
        resetToken: seedHelper.getResetToken(),
        resetTokenExpiry: seedHelper.getRandomDate(
          new Date(),
          new Date(Date.now() + 60 * 60 * 1000)
        ),
        lockedUntil: seedHelper.getRandomDate(
          new Date(),
          new Date(Date.now() + 60 * 60 * 1000)
        ),
        verificationToken: seedHelper.getResetToken(),
        createdAt,
        updatedAt,
        deletedAt: null,
      },
    });
    users.push(user);
  }

  console.log(`🌱 Created ${users.length} users`);
  return users;
}

export async function seedTutorials(userIds: string[]): Promise<Tutorial[]> {
  console.log("🌱 Seeding tutorials...");
  const tutorials: Tutorial[] = [];

  for (const tutorialData of tutorialsData) {
    const tutorial = await prisma.tutorial.create({
      data: {
        title: tutorialData.title,
        description: tutorialData.description,
        content: tutorialData.content,
        cost: tutorialData.cost,
        isLocked: tutorialData.isLocked,
        authorId: userIds[Math.floor(Math.random() * userIds.length)],
        likes: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 100),
        category: tutorialData.category,
        hasChallenge: tutorialData?.hasChallenge ?? false,
        difficulty: seedHelper.getRandomDifficulty(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: seedHelper.getTutorialStatus() as TutorialStatus,
        tutorialId: null,
        deletedAt: null,
        stepsId: null,
      },
    });
    tutorials.push(tutorial);
  }

  for (let i = 0; i < tutorials.length - 1; i++) {
    await prisma.tutorial.update({
      where: { id: tutorials[i].id },
      data: { nextTutorialId: tutorials[i + 1].id },
    });
  }

  console.log(`🌱 Created ${tutorials.length} tutorials`);
  return tutorials;
}
