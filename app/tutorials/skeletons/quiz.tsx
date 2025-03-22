import { Skeleton } from "@/components/ui/skeleton";

const QuizSkeleton = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="w-2/4 h-6 rounded-md" />
    <Skeleton className="w-3/4 h-4 rounded-md" />

    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="w-full h-10 rounded-md" />
      ))}
    </div>

    <div className="flex justify-end">
      <Skeleton className="w-32 h-10 rounded-md mt-4" />
    </div>
  </div>
);

export default QuizSkeleton;
