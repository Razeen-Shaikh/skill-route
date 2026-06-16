import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BadgesSkeleton() {
  return (
    <div className="p-6 max-w-5xl mx-auto h-[calc(100vh-4.5rem)] overflow-y-auto">
      <Card>
        <CardHeader className="space-y-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-3/4 max-w-xl" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-3 w-14" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
