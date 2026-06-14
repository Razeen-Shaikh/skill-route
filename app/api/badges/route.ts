import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { getBadgesWithStatus } from "@/lib/seedBadges";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userIdParam = url.searchParams.get("userId");
        const all = url.searchParams.get("all") === "true";

        const authUser = await getAuthUser();
        const userId = userIdParam ?? authUser?.id;

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        if (all) {
            const badges = await getBadgesWithStatus(userId);
            return NextResponse.json(badges);
        }

        const badges = await prisma.userBadge.findMany({
            where: { profileId: userId },
            include: { badge: true },
        });

        return NextResponse.json(badges);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
