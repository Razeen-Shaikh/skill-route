import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            orderBy: { profile: { rank: "asc" } },
            take: 10,
            include: {
                profile: {
                    select: {
                        rank: true,
                        points: true,
                        coins: true
                    },
                },
            },
        });

        return NextResponse.json(topUsers);
    } catch {
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
