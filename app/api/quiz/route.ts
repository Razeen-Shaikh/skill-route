import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";


export async function GET(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(request);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = session.user;

    try {
        const quizzes = await prisma.quiz.findMany({
            where: { userId },
            orderBy: { date: "asc" },
            include: {
                questions: true,
            },
        });

        return NextResponse.json(quizzes);
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(request);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = session.user;

    const { title, description } = await request.json();

    try {
        const quiz = await prisma.quiz.create({
            data: {
                title,
                description,
                userId,
            },
        });

        return NextResponse.json(quiz);
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(request);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = session.user;

    const { quizId } = request.params as { quizId: string };
    const { title, description } = await request.json();

    try {
        const quiz = await prisma.quiz.update({
            where: { id: quizId },
            data: { title, description },
        });

        return NextResponse.json(quiz);
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const session = await getServerSession(request);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = session.user;

    const { quizId } = request.params as { quizId: string };

    try {
        await prisma.quiz.delete({
            where: { id: quizId },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}