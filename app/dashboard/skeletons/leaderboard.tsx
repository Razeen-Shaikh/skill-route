"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardSkeleton() {
  return (
    <div className="p-4 dark:bg-gray-900 shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">🏆 Leaderboard</h3>
      <ul>
        {[...Array(5)].map((_, index) => (
          <li
            key={index}
            className="flex justify-between py-2 border-b items-center"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </li>
        ))}
      </ul>
    </div>
  );
}
