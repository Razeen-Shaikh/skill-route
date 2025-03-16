import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
        let reward = Math.min(50, streak.streakCount * 5);

        await prisma.userProfile.update({
            where: { userId },
            data: { coinsEarned: { increment: reward } }
        });

        return NextResponse.json({ reward, message: `You earned ${reward} coins!` });

    } catch (error) {
        return NextResponse.json({ error: "Failed to give reward" }, { status: 500 });
    }
}
