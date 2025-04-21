import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            orderBy: {
                profile: {
                    xp: "desc",
                },
            },
            include: {
                profile: {
                    include: {
                        coinWallet: {
                            select: {
                                coins: true,
                            },
                        },
                    },
                },
            },
        });

        if (!topUsers) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

        const formattedTopUsers = topUsers.map((user) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            avatar: user.profile?.avatar,
            rank: user?.profile?.rank,
            xp: user?.profile?.xp,
            coins: user?.profile?.coinWallet?.coins,
            level: user?.profile?.level,
        }));

        // Sort users by rank
        formattedTopUsers.sort((a, b) => (Number(a.rank) ?? Infinity) - (Number(b.rank) ?? Infinity));

        return NextResponse.json(formattedTopUsers);
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
