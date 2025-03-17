import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="p-4 dark:bg-gray-900 shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4">📝 Update Profile</h3>
      <div className="space-y-4">
        <div>
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        <div>
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}
