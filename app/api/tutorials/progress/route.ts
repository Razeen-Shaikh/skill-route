import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resolveTutorialId } from "@/lib/resolveTutorial";
import { NextRequest, NextResponse } from "next/server";
import { awardCoins, awardXp, COIN_REWARDS, ensureGamificationProfile, XP_REWARDS } from "@/lib/gamification";

export async function PATCH(req: NextRequest) {
    const user = await getAuthUser();
    const userId = user?.id;

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorialId: tutorialParam, percentageCompleted } = await req.json();
    const tutorialId = await resolveTutorialId(tutorialParam);

    if (!tutorialId) {
        return NextResponse.json({ error: "Tutorial not found" }, { status: 404 });
    }

    await ensureGamificationProfile(userId);

    const existingProgress = await prisma.userProgress.findUnique({
        where: { profileId_tutorialId: { profileId: userId, tutorialId } },
    });

    const isNewlyCompleted =
        percentageCompleted === 100 && !existingProgress?.isCompleted;

    const progress = await prisma.userProgress.upsert({
        where: { profileId_tutorialId: { profileId: userId, tutorialId } },
        update: {
            percentageCompleted,
            isCompleted: percentageCompleted === 100,
            completedAt: percentageCompleted === 100 ? new Date() : existingProgress?.completedAt,
        },
        create: {
            profileId: userId,
            tutorialId,
            percentageCompleted,
            isCompleted: percentageCompleted === 100,
            completedAt: percentageCompleted === 100 ? new Date() : null,
        },
    });

    if (isNewlyCompleted) {
        const tutorial = await prisma.tutorial.findUnique({
            where: { id: tutorialId },
            select: { title: true },
        });

        await prisma.$transaction(async (tx) => {
            await awardXp(tx, userId, XP_REWARDS.TUTORIAL_COMPLETE, {
                type: "TUTORIAL",
                description: `Completed tutorial: ${tutorial?.title ?? "Tutorial"}`,
                tutorialId,
            });

            await awardCoins(
                tx,
                userId,
                COIN_REWARDS.TUTORIAL_COMPLETE,
                `Completed tutorial: ${tutorial?.title ?? "Tutorial"}`
            );

            const profile = await tx.userProfile.findUnique({
                where: { userId },
                select: { completedTutorials: true },
            });

            if (profile && !profile.completedTutorials.includes(tutorialId)) {
                await tx.userProfile.update({
                    where: { userId },
                    data: { completedTutorials: { push: tutorialId } },
                });
            }
        });
    }

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
        where: { profileId_tutorialId: { profileId: userId, tutorialId } },
    });

    return NextResponse.json(progress);
}
