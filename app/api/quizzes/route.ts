import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const user = await getAuthUser();

        const quizzes = await prisma.quiz.findMany({
            include: {
                ...(user
                    ? { attempts: { where: { profileId: user.id } } }
                    : {}),
                tutorial: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
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
        console.error('Error fetching quizzes:', error);

        return NextResponse.json(
            { error: 'An error occurred while fetching quizzes.' },
            { status: 500 }
        );
    }
}
