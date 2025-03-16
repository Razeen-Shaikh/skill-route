import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fetch user progress
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const tutorialId = searchParams.get('tutorialId');

        if (!userId || !tutorialId) {
            return NextResponse.json(
                { error: 'userId and tutorialId are required.' },
                { status: 400 }
            );
        }

        const progress = await prisma.userProgress.findUnique({
            where: {
                userId_tutorialId: {
                    userId: parseInt(userId),
                    tutorialId: parseInt(tutorialId),
                },
            },
        });

        return NextResponse.json(progress || { isCompleted: false });
    } catch (error) {
        console.error('Error fetching user progress:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching user progress.' },
            { status: 500 }
        );
    }
}

// Update user progress
export async function POST(request: NextRequest) {
    try {
        const { userId, tutorialId, isCompleted } = await request.json();

        if (!userId || !tutorialId || isCompleted === undefined) {
            return NextResponse.json(
                { error: 'userId, tutorialId, and isCompleted are required.' },
                { status: 400 }
            );
        }

        const progress = await prisma.userProgress.upsert({
            where: {
                userId_tutorialId: {
                    userId: parseInt(userId),
                    tutorialId: parseInt(tutorialId),
                },
            },
            update: { isCompleted, completedAt: new Date() },
            create: {
                userId: parseInt(userId),
                tutorialId: parseInt(tutorialId),
                isCompleted,
                completedAt: new Date(),
            },
        });

        return NextResponse.json(progress);
    } catch (error) {
        console.error('Error updating user progress:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating user progress.' },
            { status: 500 }
        );
    }
}