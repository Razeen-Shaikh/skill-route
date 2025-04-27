import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/generated/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST() {
    try {
        const user = await getAuthUser();
        const userId = user?.id;

        if (!user || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const streak = await prisma.userStreak.findUnique({ where: { profileId: userId } });
        if (!streak) {
            return NextResponse.json({ error: "Streak not found" }, { status: 404 });
        }

        // Reward based on streak
        const reward = Math.min(50, streak.streak * 5);

        const userProfile = await prisma.coinWallet.update({
            where: { profileId: userId },
            data: { balance: { increment: reward } }
        });

        await prisma.coinTransaction.create({
            data: {
                profileId: userProfile.profileId,
                amount: reward,
                description: "Streak reward",
                type: TransactionType.EARNED,
            },
        })

        return NextResponse.json({ reward, message: `You earned ${reward} coins!` });

    } catch {
        return NextResponse.json({ error: "Failed to give reward" }, { status: 500 });
    }
}
