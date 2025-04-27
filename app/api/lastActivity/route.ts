import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const user = await getAuthUser();

    const userId = user?.id;

    if (!user || !userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lasttActivities = await prisma.lastActivity.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    if (!lasttActivities) {
        return NextResponse.json({ error: "Recent activities not found" }, { status: 404 });
    }

    return NextResponse.json(lasttActivities);
}
