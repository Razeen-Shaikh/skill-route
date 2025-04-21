import { CoinTransaction, LastActivity, UserBadge, UserQuizAttempt } from '@/lib/interfaces';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { UserProgress } from "@/lib/interfaces";

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = user?.id;

        if (!userId) {
            return NextResponse.json({ error: "User ID required" }, { status: 400 });
        }

        const userProfile = await prisma.userProfile.findUnique({
            where: { userId },
            include: {
                user: true,
                coinTransaction: true,
                coinWallet: true,
                progress: {
                    include: {
                        tutorial: true,
                    },
                },
                quizAttempts: {
                    include: {
                        quiz: true,
                    },
                },
                userBadges: {
                    include: {
                        badge: true,
                    },
                },
                streaks: true,
                lastActivities: true,
            },
        });

        if (!userProfile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        const formattedUserProfile = flattenUserProfile(userProfile);

        const totalTutorials = await prisma.tutorial.count();
        const totalQuizzes = await prisma.quiz.count();

        return NextResponse.json({ ...formattedUserProfile, totalTutorials, totalQuizzes });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


// export async function PUT(req: Request) {
//     try {
//         const { userId, avatarUrl, theme } = await req.json();

//         const updatedUser = await prisma.userProfile.update({
//             where: { userId },
//             data: { theme, user: { update: { avatarUrl } } },
//             include: { user: true },
//         });

//         return NextResponse.json(updatedUser);
//     } catch {
//         return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
//     }
// }


function flattenUserProfile(userProfile: any) {
    const {
        user,
        coinWallet,
        coinTransaction,
        progress,
        quizAttempts,
        userBadges,
        streaks,
        lastActivities,
        ...profileFields
    } = userProfile;

    return {
        // --- UserProfile fields ---
        ...profileFields,

        // --- Flattened User fields ---
        email: user?.email ?? null,
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        username: user?.username ?? null,
        emailVerified: user?.emailVerified ?? null,
        provider: user?.provider ?? null,

        // --- Wallet ---
        coins: coinWallet?.coins ?? 0,

        // --- Transactions ---
        transactions: coinTransaction.map((tx: CoinTransaction) => ({
            transactionId: tx.id,
            transactionType: tx.type,
            transactionAmount: tx.amount,
            transactionDescription: tx.description,
            transactionDate: tx.transactionAt,
        })),

        // --- Tutorial progress ---
        tutorialProgress: progress.map((p: UserProgress) => ({
            tutorialId: p.tutorialId,
            tutorialTitle: p.tutorial?.title ?? null,
            completed: p.isCompleted,
            completedAt: p.completedAt,
            percentageCompleted: p.percentageCompleted,
            bestScore: p.bestScore,
            attempts: p.attempts,
            challengeCompleted: p.challengeCompleted,
            interviewCompleted: p.interviewCompleted,
        })),

        // --- Quiz attempts ---
        quizAttempts: quizAttempts.map((a: UserQuizAttempt) => ({
            quizAttemptId: a.id,
            quizId: a.quizId,
            quizTitle: a.quiz?.title ?? null,
            score: a.score,
            isPassed: a.isPassed,
            feedback: a.feedback,
            completedAt: a.completedAt,
        })),

        // --- Badges ---
        earnedBadges: userBadges.map((b: UserBadge) => ({
            badgeId: b.badgeId,
            badgeName: b.badge?.name ?? null,
            badgeImage: b.badge?.imageUrl ?? null,
            badgeDescription: b.badge?.description ?? null,
            earnedAt: b.earnedAt ? new Date(b.earnedAt) : null,
        })),

        // --- Streaks ---
        streakCount: streaks?.streak ?? 0,
        streakDays: streaks?.streakDays ?? 0,
        longestStreak: streaks?.longestStreak ?? 0,
        lastStreakLogin: streaks?.lastLogin ? new Date(streaks.lastLogin) : null,
        streakStart: streaks?.currentStart ? new Date(streaks.currentStart) : null,
        streakEnd: streaks?.currentEnd ? new Date(streaks.currentEnd) : null,
        longestStreakStart: streaks?.longestStart ? new Date(streaks.longestStart) : null,
        longestStreakEnd: streaks?.longestEnd ? new Date(streaks.longestEnd) : null,

        // --- Last activity ---
        lastActivities: lastActivities.map((act: LastActivity) => ({
            activityId: act.id,
            activityType: act.type,
            activityDescription: act.description,
            xpAwarded: act.xpAwarded,
            createdAt: act.createdAt,
            quizId: act.quizId,
            tutorialId: act.tutorialId,
            roadmapId: act.roadmapId,
            roadmapStepId: act.roadmapStepId,
        })),
    };
}
