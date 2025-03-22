"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Loader } from "lucide-react";
import { ThemeName } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchTheme, updateTheme } from "@/lib/api";

export default function ThemeSwitcher() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // **Step 1: State initialized as undefined to avoid hydration mismatch**
  const [theme, setTheme] = useState<ThemeName | undefined>(undefined);

  // **Step 2: Fetch theme from server**
  const {
    data: fetchedTheme,
    isLoading,
    isError,
  } = useQuery<ThemeName>({
    queryKey: ["theme", userId],
    queryFn: async () => {
      const themeFromServer = await fetchTheme(userId);
      return themeFromServer;
    },
    enabled: !!userId,
  });

  // **Step 3: Apply the correct theme after hydration**
  useEffect(() => {
    if (fetchedTheme) {
      setTheme(fetchedTheme?.theme);
    } else {
      setTheme(getStoredOrSystemTheme());
    }
  }, [fetchedTheme]);

  // **Step 4: Toggle dark mode on document when theme changes**
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.toggle(
        "dark",
        theme === ThemeName.DARK
      );
    }
  }, [theme]);

  // **Step 5: Mutation to update user preference**
  const updateThemeMutation = useMutation({
    mutationFn: async (newTheme: ThemeName) => updateTheme(userId, newTheme),
    onSuccess: (newTheme) => {
      localStorage.setItem("theme", newTheme.theme);
      setTheme(newTheme.theme);
    },
  });

  // **Step 6: Prevent hydration errors - Show loading state before theme is set**
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

  return (
    <button
      onClick={() => {
        const newTheme =
          theme === ThemeName.LIGHT ? ThemeName.DARK : ThemeName.LIGHT;
        setTheme(newTheme);
        if (userId) {
          updateThemeMutation.mutate(newTheme);
        } else {
          localStorage.setItem("theme", newTheme);
        }
      }}
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

function getStoredOrSystemTheme(): ThemeName {
  if (typeof window === "undefined") return ThemeName.LIGHT;
  return (localStorage.getItem("theme") as ThemeName) ?? getSystemPreference();
}

function getSystemPreference(): ThemeName {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ThemeName.DARK
    : ThemeName.LIGHT;
}
