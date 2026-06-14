import prisma from "@/lib/prisma";
import { BADGE_DEFINITIONS } from "@/lib/badges";
import { evaluateAndAwardBadges, getBadgeProgress, getUserBadgeMetrics } from "@/lib/badgeEvaluation";

export async function seedBadges() {
    console.log("Seeding badges...");

    await prisma.userBadge.deleteMany();
    await prisma.badge.deleteMany();

    for (const badge of BADGE_DEFINITIONS) {
        await prisma.badge.create({
            data: {
                slug: badge.slug,
                name: badge.name,
                description: badge.description,
                imageUrl: badge.slug,
                criteriaType: badge.criteriaType,
                criteriaValue: badge.criteriaValue,
                xpReq: badge.criteriaType === "XP" ? badge.criteriaValue : 0,
            },
        });
    }

    console.log(`Created ${BADGE_DEFINITIONS.length} badges`);
}

export async function syncAllUserBadges() {
    const profiles = await prisma.userProfile.findMany({ select: { userId: true } });

    for (const profile of profiles) {
        await evaluateAndAwardBadges(profile.userId);
    }

    console.log(`Synced badges for ${profiles.length} users`);
}

export async function getBadgesWithStatus(userId: string) {
    const [allBadges, earnedBadges, metrics] = await Promise.all([
        prisma.badge.findMany({ orderBy: { criteriaValue: "asc" } }),
        prisma.userBadge.findMany({
            where: { profileId: userId },
        }),
        getUserBadgeMetrics(userId),
    ]);

    const earnedMap = new Map(
        earnedBadges.map((badge) => [badge.badgeId, badge.earnedAt])
    );

    return allBadges.map((badge) => ({
        badgeId: badge.id,
        slug: badge.slug,
        badgeName: badge.name,
        badgeDescription: badge.description,
        earnedAt: earnedMap.get(badge.id)?.toISOString() ?? null,
        earned: earnedMap.has(badge.id),
        progress: getBadgeProgress(badge.criteriaType, badge.criteriaValue, metrics),
        criteriaType: badge.criteriaType,
        criteriaValue: badge.criteriaValue,
    }));
}
