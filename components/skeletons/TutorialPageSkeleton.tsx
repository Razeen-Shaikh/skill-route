import { Skeleton } from "@/components/ui/skeleton";
import { QuizCardSkeleton } from "./QuizCardSkeleton";

export function TutorialPageSkeleton() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-9 w-2/3 max-w-lg" />
        <Skeleton className="h-5 w-1/2 max-w-md" />
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 ${i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-5/6" : "w-4/6"}`}
          />
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-7 w-24" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuizCardSkeleton />
          <QuizCardSkeleton />
        </div>
      </div>
    </div>
  );
}
