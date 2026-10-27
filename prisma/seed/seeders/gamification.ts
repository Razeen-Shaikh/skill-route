import prisma from "@/lib/prisma";
import {
  ActivityType,
  Quiz,
  QuizQuestion,
  Roadmap,
  RoadmapStep,
  Tutorial,
  User,
  UserProfile,
  UserQuizAttempt,
} from "@/generated/prisma";
import { getLevelFromXP, getRankFromLevelXP } from "@/lib/helper";
import { seedHelper } from "@/lib/seedHelper";
import { seedBadges, syncAllUserBadges } from "@/lib/seedBadges";

export async function seedGamificationData(
  users: User[],
  quizzes: Quiz[],
  tutorials: Tutorial[],
  roadmaps: Roadmap[],
  roadmapSteps: RoadmapStep[]
) {
  console.log("🌱 Seeding user profiles...");

  const quizRecords = quizzes;
  const tutorialRecords = tutorials;
  const roadmapRecords = roadmaps;
  const roadmapStepsRecords = roadmapSteps;

  for (let i = 0; i < users.length; i++) {
    const xp = Math.floor(Math.random() * 10_000);
    const level = getLevelFromXP(xp);
    const rank = getRankFromLevelXP(level, xp);

    await prisma.userProfile.upsert({
      where: { userId: users[i].id },
      update: {},
      create: {
        userId: users[i].id,
        bio: `I'm user ${i + 1}!`,
        location: `Location ${i + 1}`,
        website: `https://example${i + 1}.com`,
        socialLinks: [
          `https://twitter.com/user${i + 1}`,
          `https://github.com/user${i + 1}`,
        ],
        avatar: `https://i.pravatar.cc/150?u=${users[i].username}`,
        rank,
        level,
        xp,
        levelProgress: Math.floor(Math.random() * level * 100),
        levelProgressMax: level * 100,
        theme: seedHelper.getTheme(),
        lastLogin: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
        completedQuizzes: quizRecords
          .slice(0, Math.floor(Math.random() * quizRecords.length))
          .map((q) => q.id),
        completedTutorials: tutorialRecords
          .slice(0, Math.floor(Math.random() * tutorialRecords.length))
          .map((t) => t.id),
        completedRoadmaps: roadmapRecords
          .slice(0, Math.floor(Math.random() * roadmapRecords.length))
          .map((r) => r.id),
        completedSteps: roadmapStepsRecords
          .slice(0, Math.floor(Math.random() * roadmapStepsRecords.length))
          .map((s) => s.id),
        createdAt: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
        updatedAt: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
      },
    });
  }

  const userProfileRecords = await prisma.userProfile.findMany();
  console.log(`🌱 Created ${userProfileRecords.length} user profiles`);

  console.log("🌱 Seeding coin transactions...");
  const transactionsData = Array.from({ length: 50 }, () => ({
    profileId: users[Math.floor(Math.random() * users.length)].id,
    amount: Math.floor(Math.random() * 100),
    type: seedHelper.getTransactionType(),
    description: "Transaction description",
    transactionAt: seedHelper.getRandomDate(
      new Date(2022, 0, 1),
      new Date(2024, 11, 31)
    ),
  }));

  for (const transactionData of transactionsData) {
    await prisma.coinTransaction.upsert({
      where: {
        profileId_transactionAt: {
          profileId: transactionData.profileId,
          transactionAt: transactionData.transactionAt,
        },
      },
      update: {},
      create: {
        ...transactionData,
        createdAt: transactionData.transactionAt,
        updatedAt: transactionData.transactionAt,
      },
    });
  }

  console.log("🌱 Seeding streaks...");
  for (const user of users) {
    await prisma.userStreak.create({
      data: {
        profileId: user.id,
        streak: Math.floor(Math.random() * 100),
        streakDays: Math.floor(Math.random() * 30),
        lastLogin: new Date(Date.now() - 1),
        currentStart: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
        currentEnd: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
        longestStreak: Math.floor(Math.random() * 100),
        longestStart: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
        longestEnd: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
      },
    });
  }

  console.log("🌱 Seeding coin wallets...");
  for (const profile of userProfileRecords) {
    await prisma.coinWallet.create({
      data: {
        profileId: profile.userId,
        balance: Math.floor(Math.random() * 1000),
      },
    });
  }

  await seedBadges();
  const badgeRecords = await prisma.badge.findMany();

  await seedQuizAttempts(quizRecords, tutorialRecords, userProfileRecords);
  await seedUserProgress(
    tutorialRecords,
    quizRecords,
    userProfileRecords
  );
  await seedLastActivities(users, badgeRecords, quizRecords, tutorialRecords);

  console.log("🌱 Syncing user badges from activity...");
  await syncAllUserBadges();
}

async function seedQuizAttempts(
  quizRecords: Quiz[],
  tutorialRecords: Tutorial[],
  userProfileRecords: UserProfile[]
) {
  console.log("🌱 Seeding quiz attempts (with attempt history)...");

  const quizQuestionRecords = await prisma.quizQuestion.findMany();
  const questionsByQuiz = new Map<string, QuizQuestion[]>();

  for (const q of quizQuestionRecords) {
    const list = questionsByQuiz.get(q.quizId) ?? [];
    list.push(q);
    questionsByQuiz.set(q.quizId, list);
  }

  let attemptCount = 0;

  for (const profile of userProfileRecords.slice(0, 8)) {
    const sampleQuizzes = quizRecords
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    for (const quiz of sampleQuizzes) {
      const numAttempts = 1 + Math.floor(Math.random() * 3);
      let bestScore = 0;
      let bestAttemptId: string | null = null;

      for (let attemptNum = 1; attemptNum <= numAttempts; attemptNum++) {
        const startedAt = seedHelper.getRandomDate(
          new Date(2023, 0, 1),
          new Date(2024, 11, 31)
        );
        const score = seedHelper.getScoreBasedOnDifficulty(quiz.difficulty);
        const isPassed = score >= quiz.passPercentage;
        const isBest = score >= bestScore;

        if (isBest) bestScore = score;

        const timeSpentSeconds = quiz.isTimed
          ? quiz.timeLimit ?? 600
          : Math.floor(Math.random() * 1200) + 300;

        const attempt = await prisma.userQuizAttempt.create({
          data: {
            profileId: profile.userId,
            quizId: quiz.id,
            attemptNumber: attemptNum,
            isBestAttempt: false,
            startedAt,
            completedAt: new Date(
              startedAt.getTime() + timeSpentSeconds * 1000
            ),
            timeSpentSeconds,
            score,
            isPassed,
            feedback: isPassed
              ? `Passed with ${score}%`
              : `Scored ${score}%. Need ${quiz.passPercentage}% to pass.`,
          },
        });

        if (isBest) bestAttemptId = attempt.id;
        attemptCount++;

        const quizQuestions = questionsByQuiz.get(quiz.id) ?? [];
        for (const question of quizQuestions.slice(0, 5)) {
          const selectedAnswer =
            seedHelper.selectedOption(question.id, {
              options: question.options,
            }) ?? question.options[0] ?? "";
          await prisma.userQuestionAttempt.create({
            data: {
              userQuizAttemptId: attempt.id,
              questionId: question.id,
              selectedOption: selectedAnswer,
              selectedOptions: [selectedAnswer],
              isCorrect: selectedAnswer === question.correctAnswer,
              xpEarned:
                selectedAnswer === question.correctAnswer ? question.xp : 0,
            },
          });
        }
      }

      if (bestAttemptId) {
        await prisma.userQuizAttempt.updateMany({
          where: { profileId: profile.userId, quizId: quiz.id },
          data: { isBestAttempt: false },
        });
        await prisma.userQuizAttempt.update({
          where: { id: bestAttemptId },
          data: { isBestAttempt: true },
        });
      }
    }
  }

  console.log(`🌱 Created ${attemptCount} quiz attempts`);
}

async function seedUserProgress(
  tutorialRecords: Tutorial[],
  quizRecords: Quiz[],
  userProfileRecords: UserProfile[]
) {
  console.log("🌱 Seeding user progress...");
  const quizAttemptRecords = await prisma.userQuizAttempt.findMany();

  const progressCount = Math.min(10, tutorialRecords.length);
  for (let i = 0; i < progressCount; i++) {
    const profileId = seedHelper.getUserId(userProfileRecords);
    const tutorialId = tutorialRecords[i].id;
    const percentageCompleted = seedHelper.getPercentageCompleted(
      profileId,
      tutorialId,
      quizRecords,
      quizAttemptRecords
    );

    await prisma.userProgress.create({
      data: {
        profileId,
        tutorialId,
        isCompleted: seedHelper.getIsCompleted(percentageCompleted),
        attempts: seedHelper.getTotalQuizAttemptsByUserAndTutorial(
          profileId,
          tutorialId,
          quizRecords,
          quizAttemptRecords
        ),
        bestScore: seedHelper.getBestScoreByUserIdAndTutorialId(
          profileId,
          tutorialId,
          quizRecords,
          quizAttemptRecords
        ),
        percentageCompleted,
        interviewCompleted: i % 3 === 0,
        challengeCompleted: i % 4 === 0,
        completedAt: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
      },
    });
  }

  console.log(`🌱 Created ${progressCount} user progress records`);
}

async function seedLastActivities(
  users: User[],
  badgeRecords: { name: string; description: string | null }[],
  quizRecords: Quiz[],
  tutorialRecords: Tutorial[]
) {
  console.log("🌱 Seeding last activities...");
  const transactionRecords = await prisma.coinTransaction.findMany();

  for (const user of users) {
    const type = seedHelper.getActivityType();
    let xpAwarded = Math.floor(Math.random() * 100);

    let description = "Activity";
    if (type === ActivityType.QUIZ) {
      description =
        quizRecords[Math.floor(Math.random() * quizRecords.length)].title;
    } else if (type === ActivityType.BADGE) {
      description =
        badgeRecords[Math.floor(Math.random() * badgeRecords.length)].name;
    } else if (type === ActivityType.TUTORIAL) {
      description =
        tutorialRecords[Math.floor(Math.random() * tutorialRecords.length)]
          .title;
    } else if (type === ActivityType.XP) {
      description = `Earned ${xpAwarded} XP`;
    }

    await prisma.lastActivity.create({
      data: {
        userId: user.id,
        type,
        xpAwarded,
        description,
        createdAt: seedHelper.getRandomDate(
          new Date(2022, 0, 1),
          new Date(2024, 11, 31)
        ),
      },
    });
  }
}
