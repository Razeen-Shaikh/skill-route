"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchTutorials, fetchUserCoins } from "@/lib/api";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";
import TutorialCard from "./TutorialCard";
import { Tutorial } from "@/lib/interfaces";
import { TutorialsSidebarSkeleton } from "@/components/skeletons";

export default function Sidebar() {
  const { id: activeTutorialId } = useParams();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isAuthenticated = status === "authenticated" && !!userId;

  const { data: tutorials, isLoading: loadingTutorials } = useQuery({
    queryKey: ["tutorials", userId],
    queryFn: fetchTutorials,
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const { data: userCoins, isLoading: loadingCoins } = useQuery({
    queryKey: ["userCoins", userId],
    queryFn: () => fetchUserCoins(userId!),
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const currentTutorialId = Array.isArray(activeTutorialId)
    ? activeTutorialId[0]
    : activeTutorialId;

  if (status === "loading" || loadingTutorials) {
    return <TutorialsSidebarSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tutorials</h2>
        {loadingCoins ? (
          <Skeleton className="w-16 h-6 rounded-lg" />
        ) : (
          <Badge variant="secondary">
            Coins: <Coins className="inline text-yellow-400" />{" "}
            {userCoins?.balance ?? 0}
          </Badge>
        )}
      </div>

      {tutorials?.map((tutorial: Tutorial & { isCompleted?: boolean }) => {
          const isActive = tutorial.id === currentTutorialId;
          return (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              isCompleted={tutorial.isCompleted ?? false}
              isActive={isActive}
            />
          );
        })}
    </div>
  );
}
