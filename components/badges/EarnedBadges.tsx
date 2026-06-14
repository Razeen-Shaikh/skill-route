"use client";

import Link from "next/link";
import BadgeIcon from "@/components/badges/BadgeIcon";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEarnRequirementText, getBadgeDefinition } from "@/lib/badges";
import { formatDate } from "@/lib/helper";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export type EarnedBadge = {
    badgeId: string;
    slug: string;
    badgeName: string | null;
    badgeDescription: string | null;
    earnedAt: string | Date | null;
};

export default function EarnedBadges({ badges }: { badges: EarnedBadge[] }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Earned Badges</h3>
                    <p className="text-sm text-muted-foreground">
                        {badges.length === 0
                            ? "Complete quizzes, tutorials, and challenges to earn badges."
                            : `${badges.length} badge${badges.length === 1 ? "" : "s"} unlocked`}
                    </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/badges" className="gap-1.5">
                        View all badges
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </Button>
            </div>

            {badges.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                        No badges earned yet.
                    </p>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href="/badges">Browse available badges</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4">
                    {badges.map((badge) => {
                        const definition = getBadgeDefinition(badge.slug);
                        const requirement = definition
                            ? getEarnRequirementText(definition)
                            : badge.badgeDescription;

                        return (
                            <TooltipProvider key={badge.badgeId}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-col items-center cursor-default">
                                            <BadgeIcon
                                                slug={badge.slug}
                                                earned
                                                size="md"
                                                showLabel
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-semibold">{badge.badgeName}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {requirement}
                                        </p>
                                        {badge.earnedAt && (
                                            <p className="text-xs mt-1">
                                                Earned {formatDate(
                                                    badge.earnedAt instanceof Date
                                                        ? badge.earnedAt.toISOString()
                                                        : badge.earnedAt
                                                )}
                                            </p>
                                        )}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
