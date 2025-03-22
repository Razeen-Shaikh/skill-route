import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { error: 'id is required.' },
                { status: 400 }
            );
        }

        const tutorial = await prisma.tutorial.findUnique({
            where: { id: Number(id) },
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