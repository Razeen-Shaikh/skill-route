import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma";
import { getAuthUser } from "@/lib/auth";
import { COIN_REWARDS, ensureGamificationProfile } from "@/lib/gamification";
import { startOfDay } from "date-fns";

export async function POST() {
    try {
        const user = await getAuthUser();
        const userId = user?.id;

        if (!user || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await ensureGamificationProfile(userId);

        const streak = await prisma.userStreak.findUnique({ where: { profileId: userId } });
        if (!streak) {
            return NextResponse.json({ error: "Streak not found" }, { status: 404 });
        }

        const today = startOfDay(new Date());
        const existingReward = await prisma.coinTransaction.findFirst({
            where: {
                profileId: userId,
                description: "Daily streak reward",
                transactionAt: { gte: today },
            },
        });

        if (existingReward) {
            return NextResponse.json({
                reward: 0,
                alreadyClaimed: true,
                message: "Daily reward already claimed. Come back tomorrow!",
            });
        }

        const reward = Math.min(
            COIN_REWARDS.DAILY_STREAK_CAP,
            Math.max(5, streak.streak * 5)
        );

        await prisma.coinWallet.update({
            where: { profileId: userId },
            data: { balance: { increment: reward } },
        });

        await prisma.coinTransaction.create({
            data: {
                profileId: userId,
                amount: reward,
                description: "Daily streak reward",
                type: TransactionType.EARNED,
            },
        });

        await prisma.lastActivity.create({
            data: {
                userId,
                type: "COINS",
                description: `Claimed daily streak reward (+${reward} coins)`,
            },
        });

        return NextResponse.json({
            reward,
            alreadyClaimed: false,
            message: `You earned ${reward} coins!`,
        });
    } catch {
        return NextResponse.json({ error: "Failed to give reward" }, { status: 500 });
    }
}
