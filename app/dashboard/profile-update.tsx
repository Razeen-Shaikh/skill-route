"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/api";

export default function ProfileUpdate({ userId }: { userId: number }) {
  const [avatar, setAvatar] = useState("");
  const [theme, setTheme] = useState("Default");
  const [loading, setLoading] = useState(false);

  const { mutate } = useMutation({
    mutationFn: async () => updateProfile({ userId, avatar, theme }),
    onSuccess: (data) => {
      setAvatar(data.avatarUrl);
      setTheme(data.theme);
    },
    onError: (error) => {
      console.error("Error fetching profile:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await mutate();
    setLoading(false);
    alert("Profile updated!");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 dark:bg-gray-900 shadow-md rounded-lg space-y-4"
    >
      <h3 className="text-xl font-semibold">📝 Update Profile</h3>
      <div>
        <label className="block text-sm font-medium">Avatar URL:</label>
        <Input
          type="text"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Theme:</label>
        <select
          className="w-full p-2 border rounded"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        >
          <option>Default</option>
          <option>Dark</option>
          <option>Light</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
