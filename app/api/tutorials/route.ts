import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { enrichTutorialForUser } from "@/lib/tutorialProgress";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const user = await getAuthUser();

        const tutorials = await prisma.tutorial.findMany({
            where: category ? { category } : {},
            orderBy: { createdAt: "asc" },
            include: {
                quizzes: { select: { id: true } },
            },
        });

        if (!user?.id) {
            return NextResponse.json(tutorials);
        }

        const enrichedTutorials = await Promise.all(
            tutorials.map((tutorial) =>
                enrichTutorialForUser(user.id, {
                    ...tutorial,
                    quizzes: tutorial.quizzes.map((quiz) => ({ ...quiz, attempts: [] })),
                })
            )
        );

        return NextResponse.json(enrichedTutorials);
    } catch (error) {
        console.error("Error fetching tutorials:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching tutorials." },
            { status: 500 }
        );
    }
}
