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

  const {
    data: fetchedTheme,
    isLoading,
    isError,
  } = useQuery<ThemeName>({
    queryKey: ["theme", userId],
    queryFn: async () => {
      const themeFromServer = await fetchTheme(userId);
      return themeFromServer ?? getStoredOrSystemTheme();
    },
    initialData: getStoredOrSystemTheme,
    enabled: !!userId,
  });

  const [theme, setTheme] = useState<ThemeName | undefined>(
    fetchedTheme?.theme
  );

  useEffect(() => {
    if (fetchedTheme) {
      setTheme(fetchedTheme?.theme);
    }
    console.log({ fetchedTheme });
  }, [fetchedTheme]);

  useEffect(() => {
    if (!theme) {
      return;
    }
    document.documentElement.classList.toggle("dark", theme === ThemeName.DARK);
  }, [theme]);

  const updateThemeMutation = useMutation({
    mutationFn: async (newTheme: ThemeName) => updateTheme(userId, newTheme),
    onSuccess: (newTheme) => {
      localStorage.setItem("theme", newTheme.theme);
      setTheme(newTheme.theme);
    },
  });

  if (isLoading) {
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

  if (isError) {
    return null;
  }

  return (
    <button
      onClick={() => {
        const newTheme =
          theme === ThemeName.LIGHT ? ThemeName.DARK : ThemeName.LIGHT;
        console.log({ theme, newTheme });
        updateThemeMutation.mutate(newTheme);
      }}
      className="fixed bottom-4 right-4 p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:scale-110 transition"
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
  if (typeof window === "undefined") {
    return ThemeName.LIGHT;
  }
  return (localStorage.getItem("theme") as ThemeName) ?? getSystemPreference();
}

function getSystemPreference(): ThemeName {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ThemeName.DARK
    : ThemeName.LIGHT;
}
