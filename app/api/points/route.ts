import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
    const session = await getServerSession(req);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        const points = await prisma.point.findMany({
            where: { userId },
            orderBy: { date: "asc" },
        });

        return NextResponse.json(points);
    } catch (error) {
        console.error("Error fetching points:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
