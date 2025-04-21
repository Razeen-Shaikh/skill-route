"use client";
import { updateRewards } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function DailyRewards({ userId }: { userId: number }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["rewards", userId.toString()],
    queryFn: () => updateRewards(userId),
    retry: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading rewards</p>;

  return (
    <div className="p-4 shadow-md dark:bg-gray-900 rounded-lg">
      <h3 className="text-xl font-semibold">🎁 Daily Reward</h3>
      {data?.reward != null ? (
        <p>+{data.reward} Coins</p>
      ) : (
        <p>{data?.message}</p>
      )}
    </div>
  );
}
