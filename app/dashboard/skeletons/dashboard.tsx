import { Skeleton } from "@/components/ui/skeleton";
import LeaderboardSkeleton from "./leaderboard";
import StreakSkeleton from "./streak";
import ProfileSkeleton from "./profile";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center">
        <Skeleton className="w-48 h-8 mx-auto" />
      </h2>

      {/* Profile Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-lg shadow-md dark:bg-gray-900">
          <h3 className="text-xl font-semibold ">
            <Skeleton className="w-32 h-6" />
          </h3>
          <Skeleton className="w-40 h-4 mt-2" />
          <Skeleton className="w-40 h-4 mt-2" />
          <Skeleton className="w-40 h-4 mt-2" />
          <Skeleton className="w-40 h-4 mt-2" />
          <Skeleton className="w-40 h-4 mt-2" />
        </div>
        <ProfileSkeleton />
      </div>

      {/* Progress & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 rounded-lg shadow-md dark:bg-gray-900">
          <h3 className="text-xl font-semibold">
            <Skeleton className="w-32 h-6" />
          </h3>
          <Skeleton className="w-48 h-4 mt-2" />
          <Skeleton className="w-48 h-4 mt-2" />
          <Skeleton className="w-48 h-4 mt-2" />
        </div>
        <Skeleton className="w-full h-40 rounded-lg dark:bg-gray-900" />
      </div>

      {/* Leaderboard & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LeaderboardSkeleton />
        <StreakSkeleton />
      </div>

      {/* Daily Rewards & Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Skeleton className="w-full h-40 rounded-lg dark:bg-gray-900" />
        <div className="p-6 rounded-lg shadow-md dark:bg-gray-900">
          <h3 className="text-xl font-semibold">
            <Skeleton className="w-32 h-6" />
          </h3>
          <Skeleton className="w-48 h-4 mt-2" />
          <Skeleton className="w-48 h-4 mt-2" />
          <Skeleton className="w-48 h-4 mt-2" />
        </div>
      </div>
    </div>
  );
}
