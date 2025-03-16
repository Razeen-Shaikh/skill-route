"use client";
import { fetchLeaderboard } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import LeaderboardSkeleton from "./skeletons/leaderboard";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { mutate } = useMutation({
    mutationFn: () => fetchLeaderboard(),
    onSuccess: (data) => {
      setLeaders(data);
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

  if (loading) return <LeaderboardSkeleton />;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">🏆 Leaderboard</h3>
      <ul>
        {leaders.map((user, index) => (
          <li key={user.id} className="flex justify-between py-2 border-b">
            <span>
              #{index + 1} {user.username}
            </span>
            <span>{user.profile.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
