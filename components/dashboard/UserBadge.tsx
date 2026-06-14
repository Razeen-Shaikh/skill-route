'use client'

import EarnedBadges, { EarnedBadge } from "@/components/badges/EarnedBadges";

const UserBadge = ({ badges }: { badges: EarnedBadge[] }) => {
    return <EarnedBadges badges={badges} />;
};

export default UserBadge;
