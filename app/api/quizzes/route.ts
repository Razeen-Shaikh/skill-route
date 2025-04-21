import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const quizzes = await prisma.quiz.findMany({
            include: {
                attempts: true, 
                tutorial: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
            orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);

        return NextResponse.json(
            { error: 'An error occurred while fetching quizzes.' },
            { status: 500 }
        );
    }
}