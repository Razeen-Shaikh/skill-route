import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";
import { awardCoins, awardXp, COIN_REWARDS, XP_REWARDS } from "@/lib/gamification";

export async function getPreviousTutorialId(tutorialId: string): Promise<string | null> {
    const previous = await prisma.tutorial.findFirst({
        where: { nextTutorialId: tutorialId },
        select: { id: true },
    });

    return previous?.id ?? null;
}

export async function areAllQuizzesPassed(
    userId: string,
    tutorialId: string,
    tx: Prisma.TransactionClient | typeof prisma = prisma
): Promise<boolean> {
    const quizzes = await tx.quiz.findMany({
        where: { tutorialId },
        select: { id: true },
    });

    if (quizzes.length === 0) {
        return true;
    }

    const passedAttempts = await tx.userQuizAttempt.findMany({
        where: {
            profileId: userId,
            quizId: { in: quizzes.map((quiz) => quiz.id) },
            isPassed: true,
        },
        select: { quizId: true },
    });

    const passedQuizIds = new Set(passedAttempts.map((attempt) => attempt.quizId));
    return quizzes.every((quiz) => passedQuizIds.has(quiz.id));
}

export async function isTutorialUnlocked(userId: string, tutorialId: string): Promise<boolean> {
    const previousTutorialId = await getPreviousTutorialId(tutorialId);

    if (!previousTutorialId) {
        return true;
    }

    return areAllQuizzesPassed(userId, previousTutorialId);
}

export async function completeTutorialIfReady(
    tx: Prisma.TransactionClient,
    userId: string,
    tutorialId: string
) {
    const allPassed = await areAllQuizzesPassed(userId, tutorialId, tx);
    if (!allPassed) {
        return { tutorialCompleted: false, nextTutorialId: null as string | null };
    }

    const existingProgress = await tx.userProgress.findUnique({
        where: { profileId_tutorialId: { profileId: userId, tutorialId } },
    });

    const isNewlyCompleted = !existingProgress?.isCompleted;

    await tx.userProgress.upsert({
        where: { profileId_tutorialId: { profileId: userId, tutorialId } },
        update: {
            percentageCompleted: 100,
            isCompleted: true,
            completedAt: existingProgress?.completedAt ?? new Date(),
        },
        create: {
            profileId: userId,
            tutorialId,
            percentageCompleted: 100,
            isCompleted: true,
            completedAt: new Date(),
        },
    });

    const tutorial = await tx.tutorial.findUnique({
        where: { id: tutorialId },
        select: { title: true, nextTutorialId: true },
    });

    if (isNewlyCompleted && tutorial) {
        await awardXp(tx, userId, XP_REWARDS.TUTORIAL_COMPLETE, {
            type: "TUTORIAL",
            description: `Completed tutorial: ${tutorial.title}`,
            tutorialId,
        });

        await awardCoins(
            tx,
            userId,
            COIN_REWARDS.TUTORIAL_COMPLETE,
            `Completed tutorial: ${tutorial.title}`
        );

        const profile = await tx.userProfile.findUnique({
            where: { userId },
            select: { completedTutorials: true },
        });

        if (profile && !profile.completedTutorials.includes(tutorialId)) {
            await tx.userProfile.update({
                where: { userId },
                data: { completedTutorials: { push: tutorialId } },
            });
        }
    }

    return {
        tutorialCompleted: true,
        nextTutorialId: tutorial?.nextTutorialId ?? null,
        isNewlyCompleted,
    };
}

export async function enrichTutorialForUser<
    T extends {
        id: string;
        isLocked: boolean;
        quizzes: { id: string; attempts?: { profileId: string; isPassed: boolean }[] }[];
    },
>(userId: string | undefined, tutorial: T) {
    if (!userId) {
        return {
            ...tutorial,
            isLocked: tutorial.isLocked,
            isCompleted: false,
            allQuizzesPassed: false,
            quizzes: tutorial.quizzes.map((quiz) => ({
                ...quiz,
                attempts: [],
            })),
        };
    }

    const unlocked = await isTutorialUnlocked(userId, tutorial.id);
    const allQuizzesPassed = await areAllQuizzesPassed(userId, tutorial.id);
    const progress = await prisma.userProgress.findUnique({
        where: { profileId_tutorialId: { profileId: userId, tutorialId: tutorial.id } },
    });

    const quizAttempts = await prisma.userQuizAttempt.findMany({
        where: {
            profileId: userId,
            quizId: { in: tutorial.quizzes.map((quiz) => quiz.id) },
        },
    });

    const attemptsByQuizId = new Map(quizAttempts.map((attempt) => [attempt.quizId, attempt]));

    return {
        ...tutorial,
        isLocked: !unlocked,
        isCompleted: progress?.isCompleted ?? allQuizzesPassed,
        allQuizzesPassed,
        quizzes: tutorial.quizzes.map((quiz) => ({
            ...quiz,
            attempts: attemptsByQuizId.has(quiz.id) ? [attemptsByQuizId.get(quiz.id)!] : [],
        })),
    };
}
