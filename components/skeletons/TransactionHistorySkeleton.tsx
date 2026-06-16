import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TransactionHistorySkeleton() {
  return (
    <Card className="p-4">
      <CardHeader className="px-0 pt-0">
        <Skeleton className="h-6 w-44" />
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        <Skeleton className="h-9 w-40 rounded-md" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center gap-4 border-b border-border pb-2">
            <Skeleton className="h-4 flex-1 max-w-xs" />
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
