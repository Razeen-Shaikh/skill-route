"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProgressChart from "@/components/ProgressChart";

interface User {
  id: number;
  name: string;
  avatar?: string;
  points: number;
  rank: number;
  previous_rank: number;
  badges: string[];
  achievements: string[];
}

const API_BASE_URL = "/api";

//   TODO: Need to uncomment this
// const fetchUserData = async () => {
//   const { data } = await axios.get<User>(`${API_BASE_URL}/user`, {
//     withCredentials: true,
//   });
//   return data;
// };
//   TODO: Need to uncomment this
// const fetchPoints = async (userId: number) => {
//   if (!userId) {
//     return null;
//   }
//   return await axios.get(`${API_BASE_URL}/points`);
// };

const UserDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [pointsData, setPointsData] = useState(null);
  const queryClient = useQueryClient();
  //   TODO: Need to uncomment this
  //   const {
  //     data: user,
  //     isLoading: userLoading,
  //     error: userError,
  //   } = useQuery({
  //     queryKey: ["user"],
  //     queryFn: fetchUserData,
  //   });
  //   TODO: Need to uncomment this
  //   const userId = useMemo(() => user?.id, [user]);
  //   TODO: Need to uncomment this
  //   const {
  //     data: pointsData,
  //     isLoading: pointsLoading,
  //     error: pointsError,
  //   } = useQuery({
  //     queryKey: ["points", userId],
  //     queryFn: () => (userId ? fetchPoints(userId) : Promise.resolve(null)),
  //     enabled: !!userId,
  //   });
  //   TODO: Need to uncomment this
  //   if (pointsLoading || userLoading)
  //     return <p className="text-center text-gray-600">Loading...</p>;
  //   TODO: Need to uncomment this
  //   if (userError || pointsError)
  //     return <p className="text-center text-red-600">An error occurred!</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Card */}
        <Card className="flex items-center p-6 bg-white shadow-md rounded-lg mb-6">
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={80}
            height={80}
            className="rounded-full border-2 border-gray-300"
          />
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-gray-500">Rank: #{user?.rank}</p>
          </div>
        </Card>

        {/* Points & Rank Section */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-white shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-700">Total Points</h3>
            <p className="text-2xl font-bold text-blue-500">{user?.points}</p>
          </Card>
          <Card className="p-4 bg-white shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-700">
              Leaderboard Rank
            </h3>
            <p className="text-2xl font-bold text-green-500">#{user?.rank}</p>
          </Card>
        </div>

        {/* Badges */}
        <Card className="p-4 mt-6 bg-white shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">🏅 Badges</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.badges.length ? (
              user.badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-yellow-200 text-yellow-800 rounded-full"
                >
                  {badge}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No badges earned yet.</p>
            )}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-4 mt-6 bg-white shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">
            🏆 Achievements
          </h3>
          <ul className="list-disc pl-5 text-gray-600">
            {user?.achievements.length ? (
              user.achievements.map((achievement, index) => (
                <li key={index} className="py-1">
                  {achievement}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No achievements unlocked yet.</p>
            )}
          </ul>
        </Card>

        {/* Progress Chart */}
        <Card className="p-4 mt-6 bg-white shadow-md">
          <ProgressChart data={pointsData} />
        </Card>

        {/* Recent Activity */}
        <Card className="p-4 mt-6 bg-white shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">
            📝 Recent Activity
          </h3>
          <p className="text-gray-500">Coming Soon...</p>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
