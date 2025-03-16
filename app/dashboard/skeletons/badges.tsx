"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function BadgesSkeleton() {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-xl font-semibold">🏅 Achievements</h3>
      <div className="flex gap-2 mt-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="w-12 h-12 rounded-full" />
        ))}
      </div>
    </div>
  );
}
