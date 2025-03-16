import { Skeleton } from "@/components/ui/skeleton";

const QuizSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[92vh] space-y-6">
    <div className="w-[400px] p-6 dark:bg-gray-900 bg-white border rounded-lg dark:shadow-lg shadow-md text-center space-y-4">
      <Skeleton className="w-36 h-6 rounded-md mx-auto" />
      <Skeleton className="w-3/4 h-4 rounded-md mx-auto" />

      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="w-full h-10 rounded-md" />
        ))}
      </div>

      <Skeleton className="w-32 h-10 rounded-md mx-auto mt-4" />
    </div>
  </div>
);

export default QuizSkeleton;
