"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProfile,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionHistory from "@/components/TransactionHistory";
import RecentActivities from "@/components/RecentActivities";
import { Progress } from "@/components/ui/progress";
import Leaderboard from "@/components/dashboard/Leaderboard";
import UserProfile from "@/components/dashboard/Profile";
import UserBadge from "@/components/dashboard/UserBadge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { status } = useSession();

  const isAuthenticated = (status === "authenticated");

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
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

  const tutorialsCompletedPercentage = ((Number(completedTutorials) ?? 0) / (Number(totalTutorials) ?? 1)) * 100;
  const quzzesCompletedPercentage = ((Number(completedQuizzes) ?? 0) / (Number(totalQuizzes) ?? 1)) * 100;

  if (isProfileLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-4 flex items-center space-x-6">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-1/5" />
            <Skeleton className="h-3 w-1/5" />
          </div>
        </Card>

        <Card className="p-4">
          <Skeleton className="h-4 w-32 mb-4" />
          <div className="flex gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-12 rounded-full" />
            ))}
          </div>
        </Card>

        <Tabs defaultValue="progress">
          <TabsList className="flex space-x-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="progress">
            <Card>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-1/3 mt-4" />
                <Skeleton className="h-2 w-full" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="leaderboard">
            <Card>
              <CardContent className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity">
            <Card>
              <CardContent className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
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
