"use client";
import { updateStreak } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  }, []);

  if (loading) {
    return <StreakSkeleton />;
  }

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg flex flex-col items-center justify-center">
      <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        🔥 Streak
      </h3>
      <p
        className={cn(
          "text-3xl font-bold",
          streak && streak > 5 ? "text-green-600" : "text-gray-800"
        )}
      >
        {streak} {streak === 1 ? "Day" : "Days"}
      </p>
      <p className="text-sm text-gray-500 mt-2">{message}</p>
    </div>
  );
}
