import { Skeleton } from "@/components/ui/skeleton";

export function RoadmapsSkeleton() {
  return (
    <div className="min-h-screen w-full px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-9 w-56 mx-auto" />
        <div className="flex flex-wrap gap-6 justify-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-72 h-64 p-6 rounded-2xl border border-border bg-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-2 w-full rounded-full mt-4" />
              </div>
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
