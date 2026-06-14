import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StepStatus } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await getAuthUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id || typeof id !== "string") {
        return NextResponse.json({ message: "Step ID is required" }, { status: 400 });
    }

    const step = await prisma.roadmapStep.findUnique({ where: { id } });
    if (!step) {
        return NextResponse.json({ message: "Step not found" }, { status: 404 });
    }

    const updatedStep = await prisma.roadmapStep.update({
        where: { id },
        data: {
            completed: true,
            progress: 100,
            status: StepStatus.COMPLETED,
            completedAt: new Date(),
        },
    });

    const profile = await prisma.userProfile.findUnique({
        where: { userId: user.id },
        select: { completedSteps: true },
    });

    if (profile && !profile.completedSteps.includes(id)) {
        await prisma.userProfile.update({
            where: { userId: user.id },
            data: { completedSteps: { push: id } },
        });
    }

    return NextResponse.json({ message: "Step marked as complete", step: updatedStep });
}
