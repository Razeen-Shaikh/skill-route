import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const badges = await prisma.userBadge.findMany({
            where: { userId: parseInt(userId) },
            include: { badge: true },
        });

        return NextResponse.json(badges);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch badges" }, { status: 500 });
    }
}
