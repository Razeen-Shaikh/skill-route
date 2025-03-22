"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchTutorials, fetchUserCoins, fetchUserProgress } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";
import { Tutorial } from "@/lib/interface";
import TutorialCard from "./TutorialCard";

export default function Sidebar() {
  const { id } = useParams();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: tutorials, isLoading: loadingTutorials } = useQuery({
    queryKey: ["tutorials"],
    queryFn: fetchTutorials,
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", userId, id],
    queryFn: () => fetchUserProgress(userId, Number(id)),
    enabled: !!id && !!userId,
  });

  const { data: userCoins, isLoading: loadingCoins } = useQuery<{
    coins: number;
  }>({
    queryKey: ["userCoins", userId],
    queryFn: () => fetchUserCoins(userId),
    enabled: !!userId,
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tutorials</h2>
        {loadingCoins ? (
          <Skeleton className="w-16 h-6 rounded-lg" />
        ) : (
          <Badge variant="secondary">
            Coins: <Coins className="inline text-yellow-400" />{" "}
            {userCoins?.coins ?? 0}
          </Badge>
        )}
      </div>

      {/* Tutorials List */}
      {loadingTutorials ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        tutorials?.map((tutorial: Tutorial) => {
          const isCompleted = progress?.isCompleted;
          return (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              isCompleted={isCompleted ?? false}
            />
          );
        })
      )}
    </div>
  );
}
