import { Skeleton } from "@/components/ui/skeleton";

export function QuizCardSkeleton() {
  return (
    <div className="border border-border p-4 rounded-lg space-y-3 bg-card">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-9 w-full rounded-lg" />
    </div>
  );
}
