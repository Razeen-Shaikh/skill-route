"use client";
import { updateStreak } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import StreakSkeleton from "./skeletons/streak";

export default function Streak({ userId }: { userId: number }) {
  const [streak, setStreak] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { mutate } = useMutation({
    mutationFn: () => updateStreak(userId),
    onSuccess: (data) => {
      setStreak(data.streak);
      setMessage(data.message);
      setLoading(false);
    },
    onError: () => {
      setMessage("Failed to fetch streak. Please try again.");
      setLoading(false);
    },
    retry: false,
  });

  useEffect(() => {
    mutate();
  }, [mutate, userId]);

  if (loading) {
    return <StreakSkeleton />;
  }

  return (
    <div className="p-6 shadow-md dark:bg-gray-900 rounded-lg flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold flex items-center gap-2">
        🔥 Streak
      </h3>
      <p
        className={cn(
          "text-3xl font-bold",
          streak && streak > 5
            ? "text-green-600"
            : streak === 0
            ? "text-red-600"
            : "text-gray-800"
        )}
      >
        {streak} {streak === 1 ? "Day" : "Days"}
      </p>
      <p className="text-sm mt-2">{message}</p>
    </div>
  );
}
