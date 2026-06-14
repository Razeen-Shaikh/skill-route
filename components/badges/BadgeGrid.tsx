"use client";

import BadgeIcon from "@/components/badges/BadgeIcon";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { getEarnRequirementText, getBadgeDefinition } from "@/lib/badges";
import { formatDate } from "@/lib/helper";

export type BadgeWithStatus = {
    badgeId: string;
    slug: string;
    badgeName: string;
    badgeDescription: string | null;
    earnedAt: string | null;
    earned: boolean;
    progress: number;
    criteriaType: string;
    criteriaValue: number;
};

export default function BadgeGrid({
    badges,
    showHeader = true,
}: {
    badges: BadgeWithStatus[];
    showHeader?: boolean;
}) {
    if (!badges.length) {
        return <p className="text-muted-foreground text-sm">No badges configured.</p>;
    }

    const earnedCount = badges.filter((badge) => badge.earned).length;

    return (
        <div className="space-y-4">
            {showHeader && (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Badges</h3>
                    <span className="text-sm text-muted-foreground">
                        {earnedCount}/{badges.length} earned
                    </span>
                </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
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
                                            earned={badge.earned}
                                            size="md"
                                            showLabel
                                        />
                                        {!badge.earned && (
                                            <div className="w-full mt-1 h-1 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary/60 transition-all"
                                                    style={{ width: `${badge.progress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p className="font-semibold">{badge.badgeName}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {requirement}
                                    </p>
                                    {badge.earned && badge.earnedAt && (
                                        <p className="text-xs mt-1">
                                            Earned {formatDate(badge.earnedAt)}
                                        </p>
                                    )}
                                    {!badge.earned && (
                                        <p className="text-xs mt-1">{badge.progress}% complete</p>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </div>
        </div>
    );
}
