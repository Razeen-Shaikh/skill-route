"use client";
import { fetchBadges } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import BadgesSkeleton from "./skeletons/badges";

export default function Badges({ userId }: { userId: number }) {
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { mutate } = useMutation({
    mutationFn: async () => fetchBadges(userId),
    onSuccess: (data) => {
      setBadges(data);
      setLoading(false);
    },
    onError: (error) => {
      console.error("Error fetching badges:", error);
      setLoading(false);
    },
  });

  useEffect(() => {
    mutate();
  }, []);

  if (loading) return <BadgesSkeleton />;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold">🏅 Achievements</h3>
      <div className="flex gap-2 mt-4">
        {badges.length > 0 ? (
          badges.map((badge) => (
            <img
              key={badge.id}
              src={badge.badge.imageUrl}
              alt={badge.badge.name}
              className="w-12 h-12"
            />
          ))
        ) : (
          <p>No badges earned yet.</p>
        )}
      </div>
    </div>
  );
}
