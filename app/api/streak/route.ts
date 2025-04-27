import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays, isSameDay } from "date-fns";
import { getAuthUser } from "@/lib/auth";

export async function POST() {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user?.id;

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const userStreak = await prisma.userStreak.findUnique({ where: { profileId: userId } });

        const today = new Date();
        if (!userStreak) {
            // First time login - create streak record
            await prisma.userStreak.create({
                data: { profileId: userId, streak: 1, lastLogin: today }
            });
            return NextResponse.json({ streak: 1, message: "Streak started!" });
        }

        // If last login is today, no update needed
        if (userStreak.lastLogin && isSameDay(today, userStreak.lastLogin)) {
            return NextResponse.json({ streak: userStreak.streak, message: "Already logged in today!" });
        }

        // If last login was yesterday, continue streak
        if (userStreak.lastLogin && isSameDay(userStreak.lastLogin, subDays(today, 1))) {
            await prisma.userStreak.update({
                where: { profileId: userId },
                data: { streak: userStreak.streak + 1, lastLogin: today }
            });
            return NextResponse.json({ streak: userStreak.streak + 1, message: "Streak continued!" });
        }

        // If more than 1 day missed, reset streak
        await prisma.userStreak.update({
            where: { profileId: userId },
            data: { streak: 1, lastLogin: today }
        });
        return NextResponse.json({ streak: 1, message: "Streak reset!" });
    } catch {
        return NextResponse.json({ error: "Failed to update streak" }, { status: 500 });
    }
}
