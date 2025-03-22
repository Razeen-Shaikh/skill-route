import { Skeleton } from "@/components/ui/skeleton";
import LeaderboardSkeleton from "./leaderboard";
import StreakSkeleton from "./streak";
import ProfileSkeleton from "./profile";

export default function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center">
        Welcome to Your Dashboard
      </h1>

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
        <div className="p-4 dark:bg-gray-900 shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-4">🏆 Leaderboard</h3>
          <ul>
            {[...Array(5)].map((_, index) => (
              <li
                key={index}
                className="flex justify-between py-2 border-b items-center"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 dark:bg-gray-900 shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-4">🔥 Streak</h3>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-16 h-8 rounded-md" />
            <Skeleton className="w-32 h-4 rounded-md" />
            <Skeleton className="w-40 h-3 rounded-md mt-2" />
          </div>
        </div>
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
