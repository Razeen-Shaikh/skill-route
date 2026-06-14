import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StepStatus } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import { awardCoins, awardXp, COIN_REWARDS, ensureGamificationProfile, XP_REWARDS } from "@/lib/gamification";

export async function POST(req: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id || typeof id !== "string") {
        return NextResponse.json({ message: "Step ID is required" }, { status: 400 });
    }

    await ensureGamificationProfile(user.id);

    const step = await prisma.roadmapStep.findUnique({ where: { id } });
    if (!step) {
        return NextResponse.json({ message: "Step not found" }, { status: 404 });
    }

    const profile = await prisma.userProfile.findUnique({
        where: { userId: user.id },
        select: { completedSteps: true },
    });

    const alreadyCompleted = profile?.completedSteps.includes(id) ?? false;

    const updatedStep = await prisma.roadmapStep.update({
        where: { id },
        data: {
            completed: true,
            progress: 100,
            status: StepStatus.COMPLETED,
            completedAt: new Date(),
        },
    });

    if (!alreadyCompleted) {
        await prisma.$transaction(async (tx) => {
            const updatedProfile = await tx.userProfile.update({
                where: { userId: user.id },
                data: { completedSteps: { push: id } },
                select: { completedSteps: true },
            });

            await awardXp(tx, user.id, XP_REWARDS.ROADMAP_STEP, {
                type: "STEP",
                description: `Completed roadmap step: ${step.title}`,
                roadmapId: step.roadmapId ?? undefined,
                roadmapStepId: step.id,
            });

            await awardCoins(
                tx,
                user.id,
                COIN_REWARDS.ROADMAP_STEP,
                `Completed roadmap step: ${step.title}`
            );

            if (step.roadmapId) {
                const totalSteps = await tx.roadmapStep.count({
                    where: { roadmapId: step.roadmapId },
                });
                const progress = Math.round((updatedProfile.completedSteps.length / totalSteps) * 100);

                await tx.roadmapProgress.upsert({
                    where: {
                        userId_roadmapId: { userId: user.id, roadmapId: step.roadmapId },
                    },
                    update: {
                        progress,
                        completedAt: progress === 100 ? new Date() : null,
                    },
                    create: {
                        userId: user.id,
                        roadmapId: step.roadmapId,
                        progress,
                        completedAt: progress === 100 ? new Date() : null,
                    },
                });
            }
        });
    }

    return NextResponse.json({
        message: alreadyCompleted ? "Step already completed" : "Step marked as complete",
        step: updatedStep,
        xpAwarded: alreadyCompleted ? 0 : XP_REWARDS.ROADMAP_STEP,
        coinsAwarded: alreadyCompleted ? 0 : COIN_REWARDS.ROADMAP_STEP,
    });
}
