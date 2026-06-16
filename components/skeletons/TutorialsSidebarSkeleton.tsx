import { Skeleton } from "@/components/ui/skeleton";

export function TutorialsSidebarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border border-border rounded-lg p-4 space-y-2 bg-card"
        >
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
