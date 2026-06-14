import prisma from "@/lib/prisma";
import { getLevelProgressFromXp } from "@/lib/helper";
import { COIN_REWARDS, ensureGamificationProfile, XP_REWARDS } from "@/lib/gamification";
import { evaluateAndAwardBadges } from "@/lib/badgeEvaluation";
import { areAllQuizzesPassed } from "@/lib/tutorialProgress";
import { TransactionType } from "@/generated/prisma";

async function recalculateQuizAttempts() {
    console.log("Recalculating quiz attempts...");

    const attempts = await prisma.userQuizAttempt.findMany({
        include: {
            quiz: { include: { questions: true } },
        },
    });

    let updated = 0;

    for (const attempt of attempts) {
        const questionAttempts = await prisma.userQuestionAttempt.findMany({
            where: { userQuizAttemptId: attempt.id },
        });

        const questions = await prisma.quizQuestion.findMany({
            where: {
                id: {
                    in:
                        questionAttempts.length > 0
                            ? questionAttempts.map((qa) => qa.questionId)
                            : attempt.quiz.questions.map((q) => q.id),
                },
            },
        });
        const questionMap = new Map(questions.map((q) => [q.id, q]));

        let totalScore = 0;

        if (questionAttempts.length > 0) {
            for (const qa of questionAttempts) {
                const question = questionMap.get(qa.questionId);
                if (!question) continue;

                const isCorrect = qa.selectedOption === question.correctAnswer;
                const xpEarned = isCorrect ? (question.xp || 5) : 0;

                if (isCorrect) {
                    totalScore += xpEarned;
                }

                if (qa.xpEarned !== xpEarned || qa.isCorrect !== isCorrect) {
                    await prisma.userQuestionAttempt.update({
                        where: { id: qa.id },
                        data: { xpEarned, isCorrect },
                    });
                }
            }
        } else {
            totalScore = attempt.score;
        }

        const maxScore = attempt.quiz.questions.reduce(
            (sum, question) => sum + (question.xp || 5),
            0
        );
        const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
        const isPassed = scorePercentage >= attempt.quiz.passPercentage;

        await prisma.userQuizAttempt.update({
            where: { id: attempt.id },
            data: {
                score: totalScore,
                isPassed,
                feedback: isPassed
                    ? `Passed with ${scorePercentage.toFixed(0)}%`
                    : `Scored ${scorePercentage.toFixed(0)}%. Need ${attempt.quiz.passPercentage}% to pass.`,
            },
        });

        updated++;
    }

    console.log(`  Updated ${updated} quiz attempts`);
}

async function recalculateUserProgress(userId: string) {
    const tutorials = await prisma.tutorial.findMany({
        include: { quizzes: { select: { id: true } } },
    });

    const completedTutorialIds: string[] = [];
    const completedQuizIds: string[] = [];

    for (const tutorial of tutorials) {
        const quizIds = tutorial.quizzes.map((quiz) => quiz.id);
        const attempts = quizIds.length
            ? await prisma.userQuizAttempt.findMany({
                  where: { profileId: userId, quizId: { in: quizIds } },
              })
            : [];

        const passedAttempts = attempts.filter((attempt) => attempt.isPassed);
        const passedCount = passedAttempts.length;
        const bestScore = attempts.reduce((max, attempt) => Math.max(max, attempt.score), 0);
        const allPassed = await areAllQuizzesPassed(userId, tutorial.id);
        const percentageCompleted =
            quizIds.length > 0 ? Math.round((passedCount / quizIds.length) * 100) : 0;

        for (const attempt of passedAttempts) {
            if (!completedQuizIds.includes(attempt.quizId)) {
                completedQuizIds.push(attempt.quizId);
            }
        }

        if (quizIds.length > 0 || allPassed) {
            await prisma.userProgress.upsert({
                where: {
                    profileId_tutorialId: { profileId: userId, tutorialId: tutorial.id },
                },
                update: {
                    bestScore,
                    attempts: attempts.length,
                    percentageCompleted: allPassed ? 100 : percentageCompleted,
                    isCompleted: allPassed,
                    completedAt: allPassed ? new Date() : null,
                },
                create: {
                    profileId: userId,
                    tutorialId: tutorial.id,
                    bestScore,
                    attempts: attempts.length,
                    percentageCompleted: allPassed ? 100 : percentageCompleted,
                    isCompleted: allPassed,
                    completedAt: allPassed ? new Date() : null,
                },
            });
        }

        if (allPassed) {
            completedTutorialIds.push(tutorial.id);
        }
    }

    return { completedTutorialIds, completedQuizIds };
}

async function calculateTotalXp(
    userId: string,
    completedTutorialIds: string[],
    _completedQuizIds: string[]
) {
    let totalXp = 0;

    const allAttempts = await prisma.userQuizAttempt.findMany({
        where: { profileId: userId },
        select: { quizId: true, score: true, isPassed: true },
    });

    const bestScoreByQuiz = new Map<string, number>();
    const passedQuizIds = new Set<string>();

    for (const attempt of allAttempts) {
        const currentBest = bestScoreByQuiz.get(attempt.quizId) ?? 0;
        bestScoreByQuiz.set(attempt.quizId, Math.max(currentBest, attempt.score));
        if (attempt.isPassed) {
            passedQuizIds.add(attempt.quizId);
        }
    }

    for (const score of bestScoreByQuiz.values()) {
        totalXp += score;
    }

    totalXp += passedQuizIds.size * XP_REWARDS.QUIZ_PASS_BONUS;
    totalXp += completedTutorialIds.length * XP_REWARDS.TUTORIAL_COMPLETE;

    const profile = await prisma.userProfile.findUnique({
        where: { userId },
        select: { completedSteps: true },
    });

    totalXp += (profile?.completedSteps.length ?? 0) * XP_REWARDS.ROADMAP_STEP;

    return totalXp;
}

async function calculateTotalCoins(
    userId: string,
    completedTutorialIds: string[],
    completedQuizIds: string[]
) {
    let coins = completedQuizIds.length * COIN_REWARDS.QUIZ_PASS;
    coins += completedTutorialIds.length * COIN_REWARDS.TUTORIAL_COMPLETE;

    const profile = await prisma.userProfile.findUnique({
        where: { userId },
        select: { completedSteps: true },
    });

    coins += (profile?.completedSteps.length ?? 0) * COIN_REWARDS.ROADMAP_STEP;

    return coins;
}

async function recalculateBadges(userId: string) {
    await prisma.userBadge.deleteMany({ where: { profileId: userId } });
    await evaluateAndAwardBadges(userId);
}

async function recalculateUser(userId: string) {
    await ensureGamificationProfile(userId);

    const { completedTutorialIds, completedQuizIds } =
        await recalculateUserProgress(userId);

    const totalXp = await calculateTotalXp(
        userId,
        completedTutorialIds,
        completedQuizIds
    );
    const { level, levelProgress, levelProgressMax, rank } =
        getLevelProgressFromXp(totalXp);

    await prisma.userProfile.update({
        where: { userId },
        data: {
            xp: totalXp,
            level,
            levelProgress,
            levelProgressMax,
            rank,
            completedTutorials: completedTutorialIds,
            completedQuizzes: completedQuizIds,
        },
    });

    await recalculateBadges(userId);

    const earnedCoins = await calculateTotalCoins(
        userId,
        completedTutorialIds,
        completedQuizIds
    );

    await prisma.coinTransaction.deleteMany({
        where: {
            profileId: userId,
            description: {
                in: [
                    "Quiz pass reward",
                    "Tutorial completion reward",
                    "Roadmap step reward",
                ],
            },
        },
    });

    if (completedQuizIds.length > 0) {
        await prisma.coinTransaction.create({
            data: {
                profileId: userId,
                amount: completedQuizIds.length * COIN_REWARDS.QUIZ_PASS,
                description: "Quiz pass reward",
                type: TransactionType.EARNED,
            },
        });
    }

    if (completedTutorialIds.length > 0) {
        await prisma.coinTransaction.create({
            data: {
                profileId: userId,
                amount: completedTutorialIds.length * COIN_REWARDS.TUTORIAL_COMPLETE,
                description: "Tutorial completion reward",
                type: TransactionType.EARNED,
            },
        });
    }

    const profile = await prisma.userProfile.findUnique({
        where: { userId },
        select: { completedSteps: true },
    });

    if ((profile?.completedSteps.length ?? 0) > 0) {
        await prisma.coinTransaction.create({
            data: {
                profileId: userId,
                amount: (profile?.completedSteps.length ?? 0) * COIN_REWARDS.ROADMAP_STEP,
                description: "Roadmap step reward",
                type: TransactionType.EARNED,
            },
        });
    }

    const transactions = await prisma.coinTransaction.findMany({
        where: { profileId: userId },
    });

    const balance = transactions.reduce((total, tx) => {
        if (tx.type === TransactionType.EARNED || tx.type === TransactionType.REWARD) {
            return total + tx.amount;
        }
        if (tx.type === TransactionType.SPENT || tx.type === TransactionType.PENALTY) {
            return total - tx.amount;
        }
        return total;
    }, 0);

    await prisma.coinWallet.upsert({
        where: { profileId: userId },
        create: { profileId: userId, balance: Math.max(0, balance) },
        update: { balance: Math.max(0, balance) },
    });

    return { userId, totalXp, level, rank, balance: Math.max(0, balance), earnedCoins };
}

async function main() {
    console.log("Starting gamification recalculation...\n");

    await recalculateQuizAttempts();

    const profiles = await prisma.userProfile.findMany({
        select: { userId: true },
    });

    console.log(`\nRecalculating ${profiles.length} user profiles...`);

    for (const profile of profiles) {
        const result = await recalculateUser(profile.userId);
        console.log(
            `  ${result.userId}: XP=${result.totalXp}, Level=${result.level}, Rank=${result.rank}, Coins=${result.balance}`
        );
    }

    console.log("\nRecalculation complete.");
}

main()
    .catch((error) => {
        console.error("Recalculation failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
