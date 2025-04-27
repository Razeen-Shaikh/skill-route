import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const tutorialParam = req.nextUrl.searchParams.get('tutorialId');

        if (!tutorialParam) {
            return NextResponse.json({ error: 'tutorialId is required' }, { status: 400 });
        }

        const tutorialId = tutorialParam;

        const tutorial = await prisma.tutorial.findUnique({
            where: { id: tutorialId },
            include: { quizzes: { include: { questions: true, attempts: true } }, progress: true },
        });

        if (!tutorial) {
            return NextResponse.json(
                { error: 'Tutorial not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(tutorial);
    } catch (error) {
        console.error('Error fetching tutorial:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching the tutorial.' },
            { status: 500 }
        );
    }
}