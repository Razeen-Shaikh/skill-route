import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const user = await getAuthUser();
    const quizIds = req.nextUrl.searchParams.get("quizIds")?.split(",") || [];

    if (quizIds.length === 0) {
        return NextResponse.json([], { status: 200 });
    }

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (user?.id);

    if (!userId) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const completedQuizzes = await prisma.userQuizAttempt.findMany({
        where: { quizId: { in: quizIds }, profileId: userId },
        select: { quizId: true, score: true, completedAt: true },
    });

    if (!completedQuizzes) {
        return NextResponse.json({ error: "No completed quizzes found" }, { status: 404 });
    }

    return NextResponse.json(completedQuizzes.map((attempt) => ({ quizId: attempt.quizId, score: attempt.score, completedAt: attempt.completedAt ? new Date(attempt.completedAt) : null })), { status: 200 });
}
