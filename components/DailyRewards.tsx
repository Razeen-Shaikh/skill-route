"use client";
import { updateRewards } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function DailyRewards({ userId }: { userId: number }) {
  const [reward, setReward] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => updateRewards(userId),
    onSuccess: (data) => {
      if (data.reward) {
        setReward(data.reward);
      }
      setMessage(data.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["rewards", userId.toString()],
      });
    },
    retry: false,
  });

  useEffect(() => {
    mutate();
  }, []);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold">🎁 Daily Reward</h3>
      {reward !== null ? <p>+{reward} Coins</p> : <p>{message}</p>}
    </div>
  );
}
