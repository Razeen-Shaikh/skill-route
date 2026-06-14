import prisma from "@/lib/prisma";
import { Prisma, BadgeCriteria } from "@/generated/prisma";
import { ActivityType } from "@/generated/prisma";

export type UserBadgeMetrics = {
    xp: number;
    level: number;
    quizzesPassed: number;
    tutorialsCompleted: number;
    roadmapStepsCompleted: number;
    longestStreak: number;
    coins: number;
    perfectQuizzes: number;
};

export async function getUserBadgeMetrics(userId: string): Promise<UserBadgeMetrics> {
    const [profile, streak, wallet, quizzesPassed, perfectQuizzes] = await Promise.all([
        prisma.userProfile.findUnique({
            where: { userId },
            select: {
                xp: true,
                level: true,
                completedTutorials: true,
                completedSteps: true,
            },
        }),
        prisma.userStreak.findUnique({
            where: { profileId: userId },
            select: { longestStreak: true, streak: true },
        }),
        prisma.coinWallet.findUnique({
            where: { profileId: userId },
            select: { balance: true },
        }),
        prisma.userQuizAttempt.count({
            where: { profileId: userId, isPassed: true },
        }),
        countPerfectQuizzes(userId),
    ]);

    return {
        xp: profile?.xp ?? 0,
        level: profile?.level ?? 1,
        quizzesPassed,
        tutorialsCompleted: profile?.completedTutorials.length ?? 0,
        roadmapStepsCompleted: profile?.completedSteps.length ?? 0,
        longestStreak: Math.max(streak?.longestStreak ?? 0, streak?.streak ?? 0),
        coins: wallet?.balance ?? 0,
        perfectQuizzes,
    };
}

async function countPerfectQuizzes(userId: string) {
    const attempts = await prisma.userQuizAttempt.findMany({
        where: { profileId: userId, isPassed: true },
        include: {
            quiz: { include: { questions: true } },
        },
    });

    return attempts.filter((attempt) => {
        const maxScore = attempt.quiz.questions.reduce(
            (sum, question) => sum + (question.xp || 5),
            0
        );
        return maxScore > 0 && attempt.score >= maxScore;
    }).length;
}

export function isBadgeEarned(
    criteriaType: BadgeCriteria,
    criteriaValue: number,
    metrics: UserBadgeMetrics
): boolean {
    switch (criteriaType) {
        case "XP":
            return metrics.xp >= criteriaValue;
        case "LEVEL":
            return metrics.level >= criteriaValue;
        case "QUIZZES_PASSED":
            return metrics.quizzesPassed >= criteriaValue;
        case "TUTORIALS_COMPLETED":
            return metrics.tutorialsCompleted >= criteriaValue;
        case "ROADMAP_STEPS":
            return metrics.roadmapStepsCompleted >= criteriaValue;
        case "STREAK":
            return metrics.longestStreak >= criteriaValue;
        case "COINS":
            return metrics.coins >= criteriaValue;
        case "PERFECT_QUIZ":
            return metrics.perfectQuizzes >= criteriaValue;
        default:
            return false;
    }
}

export async function evaluateAndAwardBadges(
    userId: string,
    tx: Prisma.TransactionClient = prisma
) {
    const metrics = await getUserBadgeMetrics(userId);
    const allBadges = await tx.badge.findMany();
    const existing = await tx.userBadge.findMany({
        where: { profileId: userId },
        select: { badgeId: true },
    });
    const earnedIds = new Set(existing.map((badge) => badge.badgeId));
    const newlyEarned = [];

    for (const badge of allBadges) {
        if (earnedIds.has(badge.id)) continue;

        const earned = isBadgeEarned(badge.criteriaType, badge.criteriaValue, metrics);
        if (!earned) continue;

        await tx.userBadge.create({
            data: { profileId: userId, badgeId: badge.id },
        });

        await tx.lastActivity.create({
            data: {
                userId,
                type: ActivityType.BADGE,
                xpAwarded: 0,
                description: `Earned badge: ${badge.name}`,
            },
        });

        newlyEarned.push(badge);
    }

    return newlyEarned;
}

export function getBadgeProgress(
    criteriaType: BadgeCriteria,
    criteriaValue: number,
    metrics: UserBadgeMetrics
): number {
    let current = 0;

    switch (criteriaType) {
        case "XP":
            current = metrics.xp;
            break;
        case "LEVEL":
            current = metrics.level;
            break;
        case "QUIZZES_PASSED":
            current = metrics.quizzesPassed;
            break;
        case "TUTORIALS_COMPLETED":
            current = metrics.tutorialsCompleted;
            break;
        case "ROADMAP_STEPS":
            current = metrics.roadmapStepsCompleted;
            break;
        case "STREAK":
            current = metrics.longestStreak;
            break;
        case "COINS":
            current = metrics.coins;
            break;
        case "PERFECT_QUIZ":
            current = metrics.perfectQuizzes;
            break;
    }

    if (criteriaValue <= 0) return 100;
    return Math.min(100, Math.round((current / criteriaValue) * 100));
}
