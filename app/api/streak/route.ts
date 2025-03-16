import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays, isSameDay } from "date-fns";

export async function POST(req: Request) {
    try {
        const { userId } = await req.json();
        if (!userId) { return NextResponse.json({ error: "User ID required" }, { status: 400 }); }

        const userStreak = await prisma.userStreak.findUnique({ where: { userId } });

        const today = new Date();
        if (!userStreak) {
            // First time login - create streak record
            await prisma.userStreak.create({
                data: { userId, streakCount: 1, lastLogin: today }
            });
            return NextResponse.json({ streak: 1, message: "Streak started!" });
        }

        // If last login is today, no update needed
        if (isSameDay(today, userStreak.lastLogin)) {
            return NextResponse.json({ streak: userStreak.streakCount, message: "Already logged in today!" });
        }

        // If last login was yesterday, continue streak
        if (isSameDay(userStreak.lastLogin, subDays(today, 1))) {
            await prisma.userStreak.update({
                where: { userId },
                data: { streakCount: userStreak.streakCount + 1, lastLogin: today }
            });
            return NextResponse.json({ streak: userStreak.streakCount + 1, message: "Streak continued!" });
        }

        // If more than 1 day missed, reset streak
        await prisma.userStreak.update({
            where: { userId },
            data: { streakCount: 1, lastLogin: today }
        });
        return NextResponse.json({ streak: 1, message: "Streak reset!" });

    } catch (error) {
        return NextResponse.json({ error: "Failed to update streak" }, { status: 500 });
    }
}
