import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/tutorials/progress
export async function PATCH(req: NextRequest) {
    const { userId, tutorialId, percentageCompleted } = await req.json();

    const progress = await prisma.userProgress.upsert({
        where: { userId_tutorialId: { userId, tutorialId } },
        update: { percentageCompleted, isCompleted: percentageCompleted === 100, completedAt: new Date() },
        create: { userId, tutorialId, percentageCompleted },
    });

    return NextResponse.json(progress);
}

export async function GET(req: NextRequest) {
    const user = await getAuthUser();
    const userId = Number(user?.id);

    const url = new URL(req.url);
    const tutorialId = Number(url.searchParams.get("tutorialId"));

    const progress = await prisma.userProgress.findUnique({
        where: { userId_tutorialId: { userId, tutorialId } }
    });

    return NextResponse.json(progress)


}