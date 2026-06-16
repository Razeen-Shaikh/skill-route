import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 h-[calc(100vh-4.5rem)] overflow-y-auto">
      <Card className="p-4">
        <div className="flex items-start gap-6">
          <Skeleton className="h-16 w-16 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-2 w-full max-w-md" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4 space-y-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-3 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-full max-w-sm" />
        <Skeleton className="h-9 w-40 rounded-md" />
      </Card>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card className="p-4 space-y-3">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-9 w-40 rounded-md" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </Card>
    </div>
  );
}
