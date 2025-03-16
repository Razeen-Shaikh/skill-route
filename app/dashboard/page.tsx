"use client";

import Badges from "@/app/dashboard/badges";
import ProfileUpdate from "@/app/dashboard/profile-update";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import DailyRewards from "@/components/DailyRewards";
import Streak from "@/app/dashboard/streak";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/lib/api";
import DashboardSkeleton from "./skeletons/dashboard";
import Leaderboard from "./leaderboard";
import ProfileCard from "./profile";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const email = useMemo(() => session?.user?.email, [session]);

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", email],
    queryFn: () => fetchDashboardData(email as string),
    enabled: !!email,
  });

  const userId = useMemo(() => user?.id, [user]);

  if (userError) {
    console.error("Error fetching user data:", userError);
    return (
      <div className="text-center text-lg text-red-600">
        Error: {userError.message || "Something went wrong. Please try again."}
      </div>
    );
  }

  if (userLoading || !user) {
    return <DashboardSkeleton />;
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-red-100">
        <div className="text-center p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p>Please log in to view the dashboard.</p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => router.push("/auth/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center">
        Welcome, {user?.username} 👋
      </h2>

      {/* Profile Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard user={user} />
        <ProfileUpdate userId={userId} />
      </div>

      {/* Progress & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 rounded-lg shadow-md dark:bg-gray-900">
          <h3 className="text-xl font-semibold">Tutorial Progress</h3>
          {user?.progress?.length > 0 ? (
            user.progress.map(
              (prog: {
                tutorialId: string;
                tutorial: { title: string };
                isCompleted: boolean;
              }) => (
                <p key={prog.tutorialId}>
                  {prog.tutorial.title} -{" "}
                  {prog.isCompleted ? "✅ Completed" : "⏳ In Progress"}
                </p>
              )
            )
          ) : (
            <p>No progress yet.</p>
          )}
        </div>
        <Badges userId={userId} />
      </div>

      {/* Leaderboard & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Leaderboard />
        <Streak userId={userId} />
      </div>

      {/* Daily Rewards & Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DailyRewards userId={userId} />
        <div className="p-6 rounded-lg shadow-md dark:bg-gray-900">
          <h3 className="text-xl font-semibold">Coin Transactions</h3>
          {user?.transactions.length > 0 ? (
            user.transactions.map(
              (txn: { id: string; description: string; amount: number }) => (
                <p key={txn.id}>
                  {txn.description} - {txn.amount} coins
                </p>
              )
            )
          ) : (
            <p>No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
