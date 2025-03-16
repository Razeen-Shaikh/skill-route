"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function StreakSkeleton() {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">🔥 Streak</h3>
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="w-16 h-8 rounded-md" />
        <Skeleton className="w-32 h-4 rounded-md" />
        <Skeleton className="w-40 h-3 rounded-md mt-2" />
      </div>
    </div>
  );
}
