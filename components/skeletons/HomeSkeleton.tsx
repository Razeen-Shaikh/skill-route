import { Skeleton } from "@/components/ui/skeleton";

export default function HomeSkeleton() {
  return (
    <div className="h-full flex flex-col items-center bg-background overflow-y-auto">
      {/* Hero Section Skeleton */}
      <section className="w-full py-16 text-center bg-primary">
        <div className="max-w-3xl mx-auto px-6">
          <Skeleton className="w-3/4 h-10 mx-auto mb-4 bg-primary-foreground/50" />
          <Skeleton className="w-full h-6 mx-auto mb-6 bg-primary-foreground/30" />
          <div className="mt-6">
            <Skeleton className="w-40 h-12 mx-auto rounded-lg bg-secondary/50" />
          </div>
        </div>
      </section>

      {/* Features Section Skeleton */}
      <section className="max-w-5xl mx-auto py-12 px-6">
        <Skeleton className="w-1/3 h-8 mx-auto mb-6 bg-card-foreground/50" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card p-6 shadow-md rounded-lg text-center border border-border"
            >
              <Skeleton className="w-3/4 h-6 mx-auto mb-4 bg-card-foreground/50" />
              <Skeleton className="w-full h-5 mx-auto bg-muted/40" />
            </div>
          ))}
        </div>
      </section>

      {/* Call-to-Action Skeleton */}
      <section className="w-full py-12 text-center bg-accent">
        <Skeleton className="w-1/3 h-8 mx-auto mb-4 bg-accent-foreground/50" />
        <Skeleton className="w-2/3 h-5 mx-auto mb-6 bg-accent-foreground/30" />
        <div className="mt-6">
          <Skeleton className="w-40 h-12 mx-auto rounded-lg bg-primary/50" />
        </div>
      </section>
    </div>
  );
}
