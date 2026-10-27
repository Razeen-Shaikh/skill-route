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

type TutorialListItem = {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    isLocked: boolean;
    cost: number;
    difficulty: string;
    nextTutorialId: string | null;
    createdAt: Date;
    quizzes: { id: string }[];
};

export async function listTutorialsForUser(userId: string | undefined, category?: string | null) {
    const tutorials = await prisma.tutorial.findMany({
        where: category ? { category } : {},
        orderBy: { createdAt: "asc" },
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            isLocked: true,
            cost: true,
            difficulty: true,
            nextTutorialId: true,
            createdAt: true,
            quizzes: { select: { id: true } },
        },
    });

    if (!userId) {
        return tutorials.map((tutorial) => ({
            ...tutorial,
            isCompleted: false,
            allQuizzesPassed: false,
            quizzes: tutorial.quizzes.map((quiz) => ({ ...quiz, attempts: [] })),
        }));
    }

    return enrichTutorialList(userId, tutorials);
}

async function enrichTutorialList(userId: string, tutorials: TutorialListItem[]) {
    const listedQuizIds = tutorials.flatMap((tutorial) => tutorial.quizzes.map((quiz) => quiz.id));

    const [links, quizLinks, progressRows, passedAttempts, listedAttempts] = await Promise.all([
        prisma.tutorial.findMany({
            select: { id: true, nextTutorialId: true },
        }),
        prisma.quiz.findMany({
            where: { tutorialId: { not: null } },
            select: { id: true, tutorialId: true },
        }),
        prisma.userProgress.findMany({
            where: { profileId: userId, tutorialId: { in: tutorials.map((tutorial) => tutorial.id) } },
            select: { tutorialId: true, isCompleted: true },
        }),
        prisma.userQuizAttempt.findMany({
            where: { profileId: userId, isPassed: true },
            select: { quizId: true },
            distinct: ["quizId"],
        }),
        listedQuizIds.length === 0
            ? Promise.resolve([])
            : prisma.userQuizAttempt.findMany({
                where: { profileId: userId, quizId: { in: listedQuizIds } },
                select: { quizId: true, score: true, isPassed: true, profileId: true },
                orderBy: { completedAt: "desc" },
            }),
    ]);

    const previousIdByTutorial = new Map<string, string>();
    for (const link of links) {
        if (link.nextTutorialId) previousIdByTutorial.set(link.nextTutorialId, link.id);
    }

    const quizIdsByTutorial = new Map<string, string[]>();
    for (const quiz of quizLinks) {
        if (!quiz.tutorialId) continue;
        const quizIds = quizIdsByTutorial.get(quiz.tutorialId) ?? [];
        quizIds.push(quiz.id);
        quizIdsByTutorial.set(quiz.tutorialId, quizIds);
    }

    const passedQuizIds = new Set(passedAttempts.map((attempt) => attempt.quizId));
    const completedIds = new Set(
        progressRows.filter((progress) => progress.isCompleted).map((progress) => progress.tutorialId)
    );

    const attemptByQuizId = new Map<string, (typeof listedAttempts)[number]>();
    for (const attempt of listedAttempts) {
        if (!attemptByQuizId.has(attempt.quizId)) attemptByQuizId.set(attempt.quizId, attempt);
    }

    const allQuizzesPassed = (tutorialId: string) => {
        const quizIds = quizIdsByTutorial.get(tutorialId) ?? [];
        return quizIds.length === 0 || quizIds.every((quizId) => passedQuizIds.has(quizId));
    };

    return tutorials.map((tutorial) => {
        const previousId = previousIdByTutorial.get(tutorial.id);
        const passed = allQuizzesPassed(tutorial.id);

        return {
            ...tutorial,
            isLocked: previousId ? !allQuizzesPassed(previousId) : false,
            isCompleted: completedIds.has(tutorial.id) || passed,
            allQuizzesPassed: passed,
            quizzes: tutorial.quizzes.map((quiz) => ({
                ...quiz,
                attempts: attemptByQuizId.has(quiz.id) ? [attemptByQuizId.get(quiz.id)!] : [],
            })),
        };
    });
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
