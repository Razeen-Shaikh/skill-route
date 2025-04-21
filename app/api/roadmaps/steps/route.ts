import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get("roadmapId");

    if (!roadmapId) {
        return NextResponse.json({ message: "No roadmapId found" }, { status: 400 });
    }

    const roadmapSteps = await prisma.roadmapStep.findMany({
        where: {
            roadmapId: roadmapId,
        },
        include: {
            parent: true,
            children: true,
        },
    });


    return NextResponse.json(roadmapSteps);
}