"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Loader } from "lucide-react";
import { ThemeName } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchTheme, updateTheme } from "@/lib/api";
import { getStoredOrSystemTheme } from "@/lib/helper";

export default function ThemeSwitcher() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isAuthenticated = status === "authenticated" && userId;

  // **Step 1: Ensure no hydration mismatch by initializing undefined**
  const [theme, setTheme] = useState<ThemeName | undefined>(undefined);

  // **Step 2: Fetch theme from server**
  const { data: fetchedTheme, isLoading, isError } = useQuery({
    queryKey: ["theme", userId],
    queryFn: async () => fetchTheme(userId!),
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
  });

  // **Step 3: Set theme on client after hydration**
  useEffect(() => {
    if (fetchedTheme) {
      setTheme(fetchedTheme);
    } else {
      setTheme(getStoredOrSystemTheme());
    }
  }, [fetchedTheme]);

  // **Step 4: Apply the correct theme**
  useEffect(() => {
    if (theme !== undefined) {
      document.documentElement.classList.toggle(
        "dark",
        theme === ThemeName.DARK
      );
    }
  }, [theme]);

  // **Step 5: Mutation to update user preference**
  const updateThemeMutation = useMutation({
    mutationFn: async (newTheme: ThemeName) => updateTheme(userId!, newTheme),
    onSuccess: (newTheme) => {
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    },
  });

  // **Step 6: Loading state before theme is set**
  if (theme === undefined || isLoading) {
    return (
      <button
        disabled
        className="fixed bottom-4 right-4 p-3 bg-gray-500 text-white rounded-full shadow-lg cursor-not-allowed"
        aria-label="Loading theme..."
      >
        <Loader className="w-5 h-5 animate-spin" />
      </button>
    );
  }

  // **Step 7: Handle errors**
  if (isError) return null;

  // **Step 8: Toggle theme function**
  const toggleTheme = () => {
    const newTheme =
      theme === ThemeName.LIGHT ? ThemeName.DARK : ThemeName.LIGHT;
    setTheme(newTheme);
    if (userId) {
      updateThemeMutation.mutate(newTheme);
    } else {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full shadow-lg hover:scale-110 transition"
      aria-label="Toggle theme"
    >
      {theme === ThemeName.LIGHT ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}


