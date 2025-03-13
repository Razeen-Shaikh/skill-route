import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, { params }: { params: { quizId: string } }) {
    const { quizId } = params;

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: parseInt(quizId) },
            include: { questions: true, attempts: true },
        });

        if (!quiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { quizId: string } }) {
    const { quizId } = params;
    let body;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    // ✅ Secure Update: Only allow specific fields
    const { title, description } = body;

    try {
        const updatedQuiz = await prisma.quiz.update({
            where: { id: parseInt(quizId) },
            data: { title, description },
            select: { id: true, title: true, description: true }, // ✅ Prevent leaking sensitive data
        });

        return NextResponse.json(updatedQuiz);
    } catch (error) {
        console.error("Error updating quiz:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { quizId: string } }) {
    const { quizId } = params;

    try {
        await prisma.quiz.delete({
            where: { id: parseInt(quizId) },
        });

        return NextResponse.json({ message: "Quiz deleted" });
    } catch (error) {
        console.error("Error deleting quiz:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}