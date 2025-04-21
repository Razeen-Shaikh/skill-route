import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth/authOptions';

export const dynamic = 'force-dynamic';

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const [userCount, tutorialCount, quizCount, pathCount] = await Promise.all([
        prisma.user.count(),
        prisma.tutorial.count(),
        prisma.quiz.count(),
        prisma.roadmap.count()
    ]);

    const topUsers = await prisma.user.findMany({
        orderBy: {
            profile: {
                points: 'desc',
            },
        },
        where: {
            profile: {
                points: {
                    gt: 0,
                },
            },
        },
        take: 5,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profile: {
                select: {
                    points: true,
                    level: true,
                    completedQuizzes: true,
                    completedTutorials: true,
                    rank: true,
                },
            },
        },
    });


    const recentActivities = await prisma.adminActivityLog.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10,
        select: {
            id: true,
            action: true,
            timestamp: true,
            admin: { select: { firstName: true, lastName: true } },
        },
    });

    return NextResponse.json({
        stats: {
            users: userCount,
            tutorials: tutorialCount,
            quizzes: quizCount,
            paths: pathCount,
        },
        topUsers,
        recentActivities,
    });
}
