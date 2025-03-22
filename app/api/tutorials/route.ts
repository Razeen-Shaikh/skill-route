import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const tutorials = await prisma.tutorial.findMany({
            orderBy: { createdAt: 'asc' },
            include: {
                quizzes: true,
                progress: true,
            },
        });

        return NextResponse.json(tutorials);
    } catch (error) {
        console.error('Error fetching tutorials:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching tutorials.' },
            { status: 500 }
        );
    }
}