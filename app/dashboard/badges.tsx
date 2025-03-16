"use client";
import { fetchBadges } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import BadgesSkeleton from "./skeletons/badges";

export default function Badges({ userId }: { userId: number }) {
  const { data: badges, isLoading: badgesLoading } = useQuery({
    queryKey: ["badges", userId],
    queryFn: () => fetchBadges(userId),
    enabled: !!userId,
  });

  if (badgesLoading) return <BadgesSkeleton />;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold">🏅 Achievements</h3>
      <div className="flex gap-2 mt-4">
        {badges.length > 0 ? (
          badges.map(
            (badge: {
              id: number;
              badge: { imageUrl: string; name: string };
            }) => (
              <Image
                key={badge.id}
                src={badge.badge.imageUrl}
                alt={badge.badge.name}
                width={48}
                height={48}
                className="w-12 h-12"
              />
            )
          )
        ) : (
          <p>No badges earned yet.</p>
        )}
      </div>
    </div>
  );
}
