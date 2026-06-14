import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resolveTutorialId } from "@/lib/resolveTutorial";
import { NextRequest, NextResponse } from "next/server";

// PATCH /api/tutorials/progress
export async function PATCH(req: NextRequest) {
    const { userId, tutorialId: tutorialParam, percentageCompleted } = await req.json();
    const tutorialId = await resolveTutorialId(tutorialParam);

    if (!tutorialId) {
        return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
    }

    const progress = await prisma.userProgress.upsert({
        where: { profileId_tutorialId: { profileId: userId, tutorialId } },
        update: { percentageCompleted, isCompleted: percentageCompleted === 100, completedAt: new Date() },
        create: { profileId: userId, tutorialId, percentageCompleted },
    });

    return NextResponse.json(progress);
}

export async function GET(req: NextRequest) {
    const user = await getAuthUser();
    const userId = user?.id;

    const url = new URL(req.url);
    const tutorialParam = url.searchParams.get("tutorialId");

    if (!userId) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (!tutorialParam) {
        return NextResponse.json({ error: "No tutorialId found" }, { status: 400 });
    }

    const tutorialId = await resolveTutorialId(tutorialParam);

    if (!tutorialId) {
        return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
    }

    const progress = await prisma.userProgress.findUnique({
        where: { profileId_tutorialId: { profileId: userId, tutorialId } }
    });

    return NextResponse.json(progress)
}