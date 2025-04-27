import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Define the FormattedUser type
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

        if (!topUsers) {
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

        const formattedTopUsers: FormattedUser[] = topUsers.map((user) => ({
            id: 'id' in user ? user.id : '',
            firstName: 'firstName' in user ? user.firstName : '',
            lastName: 'lastName' in user ? user.lastName : null,
            avatar: user.profile?.avatar ?? null,
            rank: user.profile?.rank ?? null,
            xp: user.profile?.xp ?? null,
            coins: user.profile?.coinWallet?.balance ?? null,
            level: user.profile?.level ?? null,
        }));

        // Sort users by rank
        formattedTopUsers.sort((a, b) => {
            if (a.rank && b.rank) {
                return a.rank.localeCompare(b.rank);
            }
            return 0;
        });

        return NextResponse.json(formattedTopUsers);
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
