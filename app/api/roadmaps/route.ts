import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const roadmaps = await prisma.roadmap.findMany({
        where: {
            deletedAt: null,
        },
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            type: true,
        },
        orderBy: { title: "asc" },
    });

    if (!roadmaps) {
        return NextResponse.json({ message: "No roadmap found" }, { status: 404 });
    }

    return NextResponse.json(roadmaps);
}