'use client'

import Image from "next/image"
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { formatDate } from "@/lib/helper";

const UserBadge = ({ badges }: { badges: { badgeId: string, badgeName: string | null, badgeImage: string | null, badgeDescription: string | null, earnedAt: string | null }[] | undefined }) => {
    return (
        <>
            <h3 className="text-lg font-semibold">Badges</h3>
            {badges && badges?.length > 0 && badges?.length <= 5 ? (
                <div className="flex flex-wrap gap-2">
                    {badges?.map((badge) => (
                        <TooltipProvider key={badge?.badgeId}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center">
                                        <Image
                                            src={badge?.badgeImage ?? ''}
                                            alt={badge?.badgeName ?? 'Badge'}
                                            width={40}
                                            height={40}
                                            className="rounded-full"
                                        />
                                        <Badge className="mt-1 text-xs">{badge?.badgeName}</Badge>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{badge?.badgeDescription + ' ' + formatDate(badge?.earnedAt ?? "")}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm">No badges earned yet.</p>
            )}
        </>
    )
}

export default UserBadge