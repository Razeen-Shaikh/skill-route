"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProfile,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import RecentActivities from "@/components/RecentActivities";
import { Progress } from "@/components/ui/progress";
import Leaderboard from "@/components/dashboard/Leaderboard";
import UserProfile from "@/components/dashboard/Profile";
import UserBadge from "@/components/dashboard/UserBadge";
import DailyRewards from "@/components/dashboard/DailyRewards";
import { DashboardSkeleton, TransactionHistorySkeleton } from "@/components/skeletons";

const TransactionHistory = dynamic(
  () => import("@/components/TransactionHistory"),
  {
    loading: () => <TransactionHistorySkeleton />,
    ssr: false,
  }
);

export default function Dashboard() {
  const { status } = useSession();

  const isAuthenticated = status === "authenticated";

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });

  const {
    completedTutorials,
    totalTutorials,
    completedQuizzes,
    totalQuizzes,
    earnedBadges,
    coins,
    level,
    xp,
    rank,
    avatar,
    firstName,
    lastName,
    username,
    email,
    streakCount,
    longestStreak,
    lastActivities
  } = profile || {};

  const tutorialsCompletedPercentage =
    ((completedTutorials?.length ?? 0) / (totalTutorials || 1)) * 100;
  const quzzesCompletedPercentage =
    ((completedQuizzes?.length ?? 0) / (totalQuizzes || 1)) * 100;

  if (status === "loading" || isProfileLoading) {
    return <DashboardSkeleton />;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-4.5rem)] overflow-y-auto">
      <Card className="p-4 flex items-center justify-between">
        <UserProfile
          firstName={firstName!}
          lastName={lastName!}
          username={username!}
          avatar={avatar!}
          rank={rank!}
          xp={xp!}
          coins={coins!}
          level={level!}
          email={email!}
          streakCount={streakCount!}
          longestStreak={longestStreak!}
        />
      </Card>
      <Card className="p-4">
        <UserBadge badges={earnedBadges ?? []} />
      </Card>
      <DailyRewards />
      <Tabs defaultValue="progress">
        <TabsList className="flex space-x-4">
          <TabsTrigger value="progress" className="cursor-pointer">
            Progress
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="cursor-pointer">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="activity" className="cursor-pointer">
            Recent Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="progress">
          <Card>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium">Course Completion</p>
              <Progress
                value={tutorialsCompletedPercentage}
                className="w-full"
              />
              <p className="text-lg font-medium">Quizzes Attempted</p>
              <Progress value={quzzesCompletedPercentage} className="w-full" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leaderboard">
          <Card>
            <CardContent>
              <Leaderboard />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardContent className="space-y-4">
              <RecentActivities activities={lastActivities ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <TransactionHistory />
    </div>
  );
}
