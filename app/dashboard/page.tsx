"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBadges,
  fetchDashboardData,
  fetchLeaderboard,
  fetchTutorials,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Coins, Medal, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionHistory from "@/components/TransactionHistory";
import { useRouter } from "next/navigation";
import RecentActivity from "@/components/RecentActivity";
import { Progress } from "@/components/ui/progress";
import Leaderboard from "@/components/dashboard/Leaderboard";
import { calculateRank } from "@/lib/helper";
import { Quiz, Tutorial, User, UserBadge } from "@/lib/interface";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const email = session?.user?.email ?? null;
  const userId = session?.user?.id;
  const router = useRouter();

  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: ["user", email],
    queryFn: () => fetchDashboardData(email!),
    enabled: !!email,
  });

  const { data: badgesData, isLoading: isBadgesLoading } = useQuery({
    queryKey: ["badges", userId],
    queryFn: () => fetchBadges(userId!),
    enabled: !!userId,
  });

  const { data: leaderboardData, isLoading: isLeaderboardLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => fetchLeaderboard(),
    enabled: !!userId,
  });

  const { data: tutorialsdata, isLoading: isTutorialsLoading } = useQuery({
    queryKey: ["tutorials"],
    queryFn: () => fetchTutorials(),
    enabled: !!userId,
  });

  const tutorialsCompletedPercentage =
    tutorialsdata &&
    (tutorialsdata?.filter(
      (tutorial) =>
        tutorial.progress.find((p) => p.userId == userId)?.isCompleted
    ).length /
      tutorialsdata?.length) *
      100;
  const quzzesCompletedPercentage =
    tutorialsdata &&
    (tutorialsdata?.filter((tutorial: Tutorial) =>
      tutorial?.quizzes?.some((quiz: Quiz) => (quiz?.attempts?.length ?? 0) > 0)
    ).length /
      tutorialsdata?.length) *
      100;

  if (status === "unauthenticated") {
    router.push("/auth/login");
    return null;
  }

  if (userError)
    return (
      <div className="text-center text-lg text-red-600">
        Error: Something went wrong. Please try again.
      </div>
    );
  if (
    isUserLoading ||
    isBadgesLoading ||
    isTutorialsLoading ||
    isLeaderboardLoading
  )
    return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-4.5rem)] overflow-y-auto">
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-6 w-full">
          <Avatar className="w-16 h-16 self-start">
            <AvatarImage src={userData?.avatarUrl} alt="User Avatar" />
            <AvatarFallback>
              {userData?.firstName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-semibold">
              {userData?.firstName} {userData?.lastName}
            </h2>

            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>Rank:</span>
              <Medal className="inline text-yellow-500" />
              <span className="font-medium text-gray-800">
                {calculateRank(userData?.profile?.points ?? 0)}
              </span>
            </p>

            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>XP:</span>
              <Star className="inline text-blue-500" />
              <span className="font-semibold text-gray-800">
                {userData?.profile?.points}
              </span>
            </p>

            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span>Coins:</span>
              <Coins className="inline text-yellow-400" />
              <span className="font-semibold text-gray-800">
                {userData?.profile?.coins}
              </span>
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Badges</h3>
        {badgesData && badgesData?.length > 0 && badgesData?.length <= 5 ? (
          <div className="flex flex-wrap gap-3">
            {badgesData.map((badge: UserBadge) => (
              <div key={badge.id} className="flex flex-col items-center">
                <Image
                  src={badge.badge.imageUrl}
                  alt={badge.badge.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <Badge className="mt-1 text-xs">{badge.badge.name}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No badges earned yet.</p>
        )}
      </Card>
      <TransactionHistory />
      <Tabs defaultValue="progress">
        <TabsList className="flex space-x-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
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
              <Leaderboard leaderboardData={leaderboardData ?? []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardContent className="space-y-4">
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
