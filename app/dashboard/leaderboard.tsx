"use client";
import { fetchLeaderboard } from "@/lib/api";
import LeaderboardSkeleton from "./skeletons/leaderboard";
import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";

export default function Leaderboard() {
  const {
    data: leaders = [],
    isLoading,
    error,
  } = useQuery({ queryKey: ["leaderboard"], queryFn: fetchLeaderboard });

  if (isLoading) return <LeaderboardSkeleton />;

  if (error) {
    console.error("Error fetching leaderboard:", error);
    return <p>Error loading Leaderboard.</p>;
  }

  return (
    <div className="p-4 shadow-md dark:bg-gray-900 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">🏆 Leaderboard</h3>
      <ul>
        {leaders.map(
          (user: User & { profile: { points: number } }, index: number) => (
            <li key={user.id} className="flex justify-between py-2 border-b">
              <span>
                #{index + 1} {user.username}
              </span>
              <span>{user.profile.points} pts</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
