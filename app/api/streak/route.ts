import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays, isSameDay } from "date-fns";
import { getAuthUser } from "@/lib/auth";
import { ensureGamificationProfile } from "@/lib/gamification";

export async function POST() {
    try {
        const user = await getAuthUser();

        if (!user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user.id;
        await ensureGamificationProfile(userId);

        const userStreak = await prisma.userStreak.findUnique({ where: { profileId: userId } });
        const today = new Date();

        if (!userStreak) {
            await prisma.userStreak.create({
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
            return NextResponse.json({ streak: 1, message: "Streak started!" });
        }

        if (userStreak.lastLogin && isSameDay(today, userStreak.lastLogin)) {
            return NextResponse.json({ streak: userStreak.streak, message: "Already logged in today!" });
        }

        if (userStreak.lastLogin && isSameDay(userStreak.lastLogin, subDays(today, 1))) {
            const newStreak = userStreak.streak + 1;
            const longestStreak = Math.max(userStreak.longestStreak, newStreak);

            await prisma.userStreak.update({
                where: { profileId: userId },
                data: {
                    streak: newStreak,
                    streakDays: newStreak,
                    lastLogin: today,
                    currentEnd: today,
                    longestStreak,
                    longestEnd: longestStreak === newStreak ? today : userStreak.longestEnd,
                    longestStart: longestStreak === newStreak ? (userStreak.currentStart ?? today) : userStreak.longestStart,
                },
            });

            return NextResponse.json({ streak: newStreak, message: "Streak continued!" });
        }

        await prisma.userStreak.update({
            where: { profileId: userId },
            data: {
                streak: 1,
                streakDays: 1,
                lastLogin: today,
                currentStart: today,
                currentEnd: today,
            },
        });

        return NextResponse.json({ streak: 1, message: "Streak reset!" });
    } catch {
        return NextResponse.json({ error: "Failed to update streak" }, { status: 500 });
    }
}
