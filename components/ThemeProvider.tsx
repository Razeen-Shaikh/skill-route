"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { fetchTheme } from "@/lib/api";
import { migrateLegacyThemeStorage, toAppTheme } from "@/lib/theme";

function ThemeSync() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();
  const isAuthenticated = status === "authenticated" && Boolean(session?.user?.email);
  const hasSyncedServerTheme = useRef(false);

  const { data: fetchedTheme } = useQuery({
    queryKey: ["theme"],
    queryFn: () => fetchTheme(),
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    migrateLegacyThemeStorage();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      hasSyncedServerTheme.current = false;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !fetchedTheme || hasSyncedServerTheme.current) return;

    setTheme(toAppTheme(fetchedTheme));
    hasSyncedServerTheme.current = true;
  }, [fetchedTheme, isAuthenticated, setTheme]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
