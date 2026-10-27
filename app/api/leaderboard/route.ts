import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const topProfiles = await prisma.userProfile.findMany({
            take: 100,
            orderBy: { xp: "desc" },
            select: {
                userId: true,
                avatar: true,
                rank: true,
                xp: true,
                level: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                coinWallet: {
                    select: { balance: true },
                },
            },
        });

        const formattedTopUsers = topProfiles.map((profile) => ({
            id: profile.userId,
            firstName: profile.user.firstName,
            lastName: profile.user.lastName,
            avatar: profile.avatar,
            rank: profile.rank,
            xp: profile.xp,
            coins: profile.coinWallet?.balance ?? 0,
            level: profile.level,
        }));

        return NextResponse.json(formattedTopUsers, {
            headers: {
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
            },
        });
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
