import { Skeleton } from "@/components/ui/skeleton";
import { QuizCardSkeleton } from "./QuizCardSkeleton";

export function QuizzesSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Skeleton className="h-9 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <QuizCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
