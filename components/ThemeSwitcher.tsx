"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Loader } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchTheme, updateTheme } from "@/lib/api";
import { getStoredOrSystemTheme } from "@/lib/helper";
import { ThemeName } from "@/lib/interfaces";

export default function ThemeSwitcher() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [theme, setTheme] = useState<ThemeName | undefined>(undefined);

  const {
    data: fetchedTheme,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["theme"],
    queryFn: async () => fetchTheme(),
    enabled: !!isAuthenticated,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (fetchedTheme) {
      setTheme(fetchedTheme);
    } else {
      setTheme(getStoredOrSystemTheme());
    }
  }, [fetchedTheme]);

  useEffect(() => {
    if (theme !== undefined) {
      document.documentElement.classList.toggle("dark", theme === "DARK");
    }
  }, [theme]);

  const updateThemeMutation = useMutation({
    mutationFn: async (newTheme: ThemeName) => updateTheme(newTheme),
    onSuccess: (newTheme) => {
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    },
  });

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

  if (isError) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = theme === "LIGHT" ? "DARK" : "LIGHT";
    setTheme(newTheme);
    if (!!isAuthenticated) {
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
      {theme === "LIGHT" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}
