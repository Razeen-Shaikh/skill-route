import { Skeleton } from "@/components/ui/skeleton";

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2 px-2">
        <Skeleton className="h-4 w-6 mx-auto" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12 mx-auto" />
        <Skeleton className="h-4 w-12 mx-auto" />
        <Skeleton className="h-4 w-8 mx-auto" />
        <Skeleton className="h-4 w-10 mx-auto" />
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-2 py-2">
          <Skeleton className="h-4 w-6" />
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <Skeleton className="h-4 flex-1 max-w-[140px]" />
          <Skeleton className="h-6 w-16 rounded-full mx-auto" />
          <Skeleton className="h-4 w-8 mx-auto" />
          <Skeleton className="h-4 w-12 mx-auto" />
          <Skeleton className="h-4 w-10 mx-auto" />
        </div>
      ))}
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}
