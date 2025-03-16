import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const topUsers = await prisma.user.findMany({
            orderBy: { profile: { points: "desc" } },
            take: 10,
            select: {
                id: true,
                username: true,
                profile: { select: { points: true, rank: true } },
            },
        });

        return NextResponse.json(topUsers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }
}
