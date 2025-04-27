import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const roadmaps = await prisma.roadmap.findMany({
        where: {
            deletedAt: null,
        }
    });

    if (!roadmaps) {
        return NextResponse.json({ message: "No roadmap found" }, { status: 404 });
    }

    return NextResponse.json(roadmaps);
}