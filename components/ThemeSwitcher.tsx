"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { updateTheme } from "@/lib/api";
import { toDbTheme } from "@/lib/theme";

export default function ThemeSwitcher() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateThemeMutation = useMutation({
    mutationFn: (newTheme: "light" | "dark") => updateTheme(toDbTheme(newTheme)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theme"] });
    },
  });

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    if (isAuthenticated) {
      updateThemeMutation.mutate(newTheme);
    }
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-3 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full shadow-lg hover:scale-110 transition"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
