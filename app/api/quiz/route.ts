import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const quizIdParam = req.nextUrl.searchParams.get('quizId');

    if (!quizIdParam) {
        return NextResponse.json({ error: 'quizId is required' }, { status: 400 });
    }

    const quizId = quizIdParam;

    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });

        if (!quiz) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
