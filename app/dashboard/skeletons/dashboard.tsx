import { Skeleton } from "@/components/ui/skeleton";
import LeaderboardSkeleton from "./leaderboard";
import StreakSkeleton from "./streak";
import ProfileSkeleton from "./profile";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        <Skeleton className="w-48 h-8 mx-auto" />
      </h2>

      {/* Profile Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">
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
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">
            <Skeleton className="w-32 h-6" />
          </h3>
          <Skeleton className="w-48 h-4 mt-2" />
          <Skeleton className="w-48 h-4 mt-2" />
          <Skeleton className="w-48 h-4 mt-2" />
        </div>
        <Skeleton className="w-full h-40 bg-gray-100 rounded-lg" />
      </div>

      {/* Leaderboard & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <LeaderboardSkeleton />
        <StreakSkeleton />
      </div>

      {/* Daily Rewards & Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Skeleton className="w-full h-40 bg-gray-100 rounded-lg" />
        <div className="p-6 bg-gray-100 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700">
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
