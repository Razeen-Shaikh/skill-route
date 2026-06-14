import { ActivityType, Prisma, TransactionType } from "@/generated/prisma";
import { getLevelFromXP, getLevelProgressFromXp } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { isSameDay, subDays } from "date-fns";

export const XP_REWARDS = {
    QUIZ_PASS_BONUS: 25,
    TUTORIAL_COMPLETE: 50,
    ROADMAP_STEP: 75,
} as const;

export const COIN_REWARDS = {
    QUIZ_PASS: 10,
    TUTORIAL_COMPLETE: 15,
    ROADMAP_STEP: 20,
    DAILY_STREAK_CAP: 50,
} as const;

type ActivityPayload = {
    type: ActivityType;
    description: string;
    quizId?: string;
    tutorialId?: string;
    roadmapId?: string;
    roadmapStepId?: string;
    quizAttemptId?: string;
};

export async function ensureGamificationProfile(userId: string) {
    await prisma.coinWallet.upsert({
        where: { profileId: userId },
        create: { profileId: userId, balance: 0 },
        update: {},
    });

    await prisma.userStreak.upsert({
        where: { profileId: userId },
        create: { profileId: userId, streak: 0 },
        update: {},
    });
}

export async function refreshUserStreak(userId: string) {
    await ensureGamificationProfile(userId);

    const userStreak = await prisma.userStreak.findUnique({ where: { profileId: userId } });
    const today = new Date();

    if (!userStreak) {
        return prisma.userStreak.create({
            data: {
                profileId: userId,
                streak: 1,
                streakDays: 1,
                lastLogin: today,
                currentStart: today,
                longestStreak: 1,
                longestStart: today,
            },
        });
    }

    if (userStreak.lastLogin && isSameDay(today, userStreak.lastLogin)) {
        return userStreak;
    }

    if (userStreak.lastLogin && isSameDay(userStreak.lastLogin, subDays(today, 1))) {
        const newStreak = userStreak.streak + 1;
        const longestStreak = Math.max(userStreak.longestStreak, newStreak);

        return prisma.userStreak.update({
            where: { profileId: userId },
            data: {
                streak: newStreak,
                streakDays: newStreak,
                lastLogin: today,
                currentEnd: today,
                longestStreak,
                longestEnd: longestStreak === newStreak ? today : userStreak.longestEnd,
                longestStart:
                    longestStreak === newStreak
                        ? (userStreak.currentStart ?? today)
                        : userStreak.longestStart,
            },
        });
    }

    return prisma.userStreak.update({
        where: { profileId: userId },
        data: {
            streak: 1,
            streakDays: 1,
            lastLogin: today,
            currentStart: today,
            currentEnd: today,
        },
    });
}

export async function checkAndAwardBadges(
    tx: Prisma.TransactionClient,
    userId: string,
    totalXp: number
) {
    const eligibleBadges = await tx.badge.findMany({
        where: { xpReq: { lte: totalXp } },
    });

    if (eligibleBadges.length === 0) {
        return [];
    }

    const existingBadges = await tx.userBadge.findMany({
        where: { profileId: userId },
        select: { badgeId: true },
    });
    const earnedIds = new Set(existingBadges.map((badge) => badge.badgeId));
    const newBadges = eligibleBadges.filter((badge) => !earnedIds.has(badge.id));

    for (const badge of newBadges) {
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
    }

    return newBadges;
}

export async function awardXp(
    tx: Prisma.TransactionClient,
    userId: string,
    xpAmount: number,
    activity: ActivityPayload
) {
    if (xpAmount <= 0) {
        return { xpAwarded: 0, leveledUp: false, level: 1, rank: "Beginner" };
    }

    const previousProfile = await tx.userProfile.findUnique({
        where: { userId },
        select: { xp: true },
    });
    const previousLevel = getLevelFromXP(previousProfile?.xp ?? 0);

    const profile = await tx.userProfile.update({
        where: { userId },
        data: { xp: { increment: xpAmount } },
    });

    const progress = getLevelProgressFromXp(profile.xp);

    await tx.userProfile.update({
        where: { userId },
        data: {
            level: progress.level,
            levelProgress: progress.levelProgress,
            levelProgressMax: progress.levelProgressMax,
            rank: progress.rank,
        },
    });

    await checkAndAwardBadges(tx, userId, profile.xp);

    await tx.lastActivity.create({
        data: {
            userId,
            type: activity.type,
            xpAwarded: xpAmount,
            description: activity.description,
            quizId: activity.quizId,
            tutorialId: activity.tutorialId,
            roadmapId: activity.roadmapId,
            roadmapStepId: activity.roadmapStepId,
            quizAttemptId: activity.quizAttemptId,
        },
    });

    return {
        xpAwarded: xpAmount,
        leveledUp: progress.level > previousLevel,
        level: progress.level,
        rank: progress.rank,
        totalXp: profile.xp,
    };
}

export async function awardCoins(
    tx: Prisma.TransactionClient,
    userId: string,
    amount: number,
    description: string,
    type: TransactionType = TransactionType.EARNED
) {
    if (amount <= 0) {
        return 0;
    }

    await tx.coinWallet.upsert({
        where: { profileId: userId },
        create: { profileId: userId, balance: amount },
        update: { balance: { increment: amount } },
    });

    await tx.coinTransaction.create({
        data: {
            profileId: userId,
            amount,
            description,
            type,
        },
    });

    return amount;
}
