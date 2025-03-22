import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const user = await getAuthUser();
    const quizIds = req.nextUrl.searchParams.get("quizIds")?.split(",").map(Number).filter((id) => !isNaN(id)) || [];

    if (quizIds.length === 0) {
        return NextResponse.json([], { status: 200 });
    }

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(user?.id);

    if (!userId) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const completedQuizzes = await prisma.userQuizAttempt.findMany({
        where: { quizId: { in: quizIds as number[] }, userId },
        select: { quizId: true },
    });

    if (!completedQuizzes) {
        return NextResponse.json({ error: "No completed quizzes found" }, { status: 404 });
    }

    return NextResponse.json(completedQuizzes.map((attempt) => attempt.quizId));
}
