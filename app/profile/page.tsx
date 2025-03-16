"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const Profile = () => {
  const [theme, setTheme] = useState("light");

  // Fetch user profile
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axios.get("/api/user/profile");
      return res.data;
    },
  });

  // Fetch available themes
  const { data: themes } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => {
      const res = await axios.get("/api/themes/list");
      return res.data;
    },
  });

  // Theme update mutation
  const updateThemeMutation = useMutation({
    mutationFn: async (newTheme: string) => {
      await axios.post("/api/themes/update", { theme: newTheme });
    },
    onSuccess: () => {
      setTheme(profile?.theme || "light");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex items-center space-x-4">
        <img
          src={profile.avatarUrl || "/default-avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h2 className="text-xl font-bold">{profile.username}</h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>
      </div>

      <div className="mt-4">
        <p>
          <strong>Rank:</strong> {profile.rank}
        </p>
        <p>
          <strong>Points:</strong> {profile.points}
        </p>
        <p>
          <strong>Coins:</strong> {profile.coins}
        </p>
      </div>

      <div className="mt-4">
        <label className="block font-semibold">Theme</label>
        <select
          value={theme}
          onChange={(e) => updateThemeMutation.mutate(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default Profile;
