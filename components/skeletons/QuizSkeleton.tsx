import { Skeleton } from "@/components/ui/skeleton";

const QuizSkeleton = () => (
  <div className="p-6 max-w-2xl mx-auto space-y-6">
    <Skeleton className="h-9 w-2/3" />
    <Skeleton className="h-6 w-32" />

    <div className="border border-border rounded-lg p-4 space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-full" />
    </div>

    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>

    <div className="flex justify-end">
      <Skeleton className="h-10 w-36 rounded-lg" />
    </div>
  </div>
);

export default QuizSkeleton;
