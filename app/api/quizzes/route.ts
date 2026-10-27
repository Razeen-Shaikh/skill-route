import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getAuthUser();

        const quizzes = await prisma.quiz.findMany({
            select: {
                id: true,
                title: true,
                isTimed: true,
                timeLimit: true,
                maxScore: true,
                passPercentage: true,
                order: true,
                tutorialLocked: true,
                tutorialId: true,
                tutorial: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                ...(user
                    ? {
                        attempts: {
                            where: { profileId: user.id },
                            select: { score: true, isPassed: true },
                            orderBy: { completedAt: "desc" as const },
                        },
                    }
                    : {}),
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(
            quizzes.map((quiz) => ({
                ...quiz,
                attempts: "attempts" in quiz ? quiz.attempts : [],
            }))
        );
    } catch (error) {
        console.error("Error fetching quizzes:", error);

        return NextResponse.json(
            { error: "An error occurred while fetching quizzes." },
            { status: 500 }
        );
    }
}
