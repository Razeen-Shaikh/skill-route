import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(user?.id);

    if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const recentActivities = await prisma.recentActivity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    if (!recentActivities) {
        return NextResponse.json({ error: "Recent activities not found" }, { status: 404 });
    }

    return NextResponse.json(recentActivities);
}
