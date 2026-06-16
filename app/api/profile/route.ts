import { UserStreak, LastActivity, UserBadge, CoinWallet, User, UserProfile, Badge } from '@/generated/prisma';
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from '@/lib/auth';
import { ensureGamificationProfile, refreshUserStreak } from '@/lib/gamification';

export async function GET() {
    try {
        const user = await getAuthUser();
        const userId = user?.id;

        if (!user || !userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await ensureGamificationProfile(userId);
        await refreshUserStreak(userId);

        const [userProfile, totalTutorials, totalQuizzes] = await Promise.all([
            prisma.userProfile.findUnique({
                where: { userId },
                include: {
                    user: {
                        select: {
                            email: true,
                            firstName: true,
                            lastName: true,
                            username: true,
                            emailVerified: true,
                        },
                    },
                    coinWallet: { select: { balance: true } },
                    userBadges: {
                        include: {
                            badge: {
                                select: {
                                    slug: true,
                                    name: true,
                                    imageUrl: true,
                                    description: true,
                                },
                            },
                        },
                    },
                    streaks: true,
                    lastActivities: {
                        orderBy: { createdAt: "desc" },
                        take: 10,
                    },
                },
            }),
            prisma.tutorial.count(),
            prisma.quiz.count(),
        ]);

        if (!userProfile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        const formattedUserProfile = flattenUserProfile(userProfile);

        return NextResponse.json({ ...formattedUserProfile, totalTutorials, totalQuizzes });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

type ProfileWithRelations = UserProfile & {
    user: Pick<User, "email" | "firstName" | "lastName" | "username" | "emailVerified">;
    coinWallet: Pick<CoinWallet, "balance"> | null;
    userBadges: (UserBadge & { badge: Pick<Badge, "slug" | "name" | "imageUrl" | "description"> })[];
    streaks: UserStreak | null;
    lastActivities: LastActivity[];
};

function flattenUserProfile(userProfile: ProfileWithRelations) {
    const {
        user,
        coinWallet,
        userBadges,
        streaks,
        lastActivities,
        ...profileFields
    } = userProfile;

    return {
        ...profileFields,
        email: user?.email ?? null,
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        username: user?.username ?? null,
        emailVerified: user?.emailVerified ?? null,
        coins: coinWallet?.balance ?? 0,
        earnedBadges: userBadges.map((b) => ({
            badgeId: b.badgeId,
            slug: b.badge?.slug ?? b.badge?.imageUrl ?? "",
            badgeName: b.badge?.name ?? null,
            badgeImage: b.badge?.imageUrl ?? null,
            badgeDescription: b.badge?.description ?? null,
            earnedAt: b.earnedAt ? new Date(b.earnedAt) : null,
        })),
        streakCount: streaks?.streak ?? 0,
        streakDays: streaks?.streakDays ?? 0,
        longestStreak: streaks?.longestStreak ?? 0,
        lastStreakLogin: streaks?.lastLogin ? new Date(streaks.lastLogin) : null,
        streakStart: streaks?.currentStart ? new Date(streaks.currentStart) : null,
        streakEnd: streaks?.currentEnd ? new Date(streaks.currentEnd) : null,
        longestStreakStart: streaks?.longestStart ? new Date(streaks.longestStart) : null,
        longestStreakEnd: streaks?.longestEnd ? new Date(streaks.longestEnd) : null,
        lastActivities: lastActivities.map((act) => ({
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
