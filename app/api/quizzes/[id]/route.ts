import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, context: { params: { id: string } }) {
    const { params } = context;

    if (!params.id) {
        return NextResponse.json(
            { error: 'id is required.' },
            { status: 400 }
        );
    }

    const quizId = parseInt(params.id);
    if (isNaN(quizId)) {
        return NextResponse.json(
            { error: 'Invalid quiz id.' },
            { status: 400 }
        );
    }

    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true },
    });

    if (!quiz) {
        return NextResponse.json(
            { error: 'Quiz not found.' },
            { status: 404 }
        );
    }

    return NextResponse.json(quiz);
}