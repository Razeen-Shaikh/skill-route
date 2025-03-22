import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionType } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const streak = await prisma.userStreak.findUnique({ where: { userId } });
        if (!streak) {
            return NextResponse.json({ error: "Streak not found" }, { status: 404 });
        }

        // Reward based on streak
        const reward = Math.min(50, streak.streakCount * 5);

        const userProfile = await prisma.userProfile.update({
            where: { userId },
            data: { coins: { increment: reward } }
        });

        await prisma.coinTransaction.create({
            data: {
                userProfileId: userProfile.userId,
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
