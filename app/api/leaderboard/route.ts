import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type FormattedUser = {
    id: string;
    firstName: string;
    lastName: string | null;
    avatar: string | null;
    rank: string | null;
    xp: number | null;
    coins: number | null;
    level: number | null;
};

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            take: 100,
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
                                balance: true,
                            },
                        },
                    },
                },
            },
        });

        const formattedTopUsers: FormattedUser[] = topUsers
            .filter((user) => user.profile)
            .map((user) => ({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.profile?.avatar ?? null,
                rank: user.profile?.rank ?? null,
                xp: user.profile?.xp ?? 0,
                coins: user.profile?.coinWallet?.balance ?? 0,
                level: user.profile?.level ?? 1,
            }))
            .sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0));

        return NextResponse.json(formattedTopUsers);
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
