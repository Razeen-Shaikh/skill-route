import { Skeleton } from "@/components/ui/skeleton";

export function RoadmapTreeSkeleton() {
  return (
    <div className="relative w-full h-[calc(100vh-4.5rem)] flex flex-col items-center p-8 overflow-hidden">
      <div className="flex justify-center gap-10 my-8">
        <Skeleton className="h-24 w-32 rounded-xl" />
      </div>
      <div className="flex justify-center gap-10 my-8">
        <Skeleton className="h-24 w-32 rounded-xl" />
        <Skeleton className="h-24 w-32 rounded-xl" />
      </div>
      <div className="flex justify-center gap-10 my-8">
        <Skeleton className="h-24 w-32 rounded-xl" />
        <Skeleton className="h-24 w-32 rounded-xl" />
        <Skeleton className="h-24 w-32 rounded-xl" />
      </div>
    </div>
  );
}
