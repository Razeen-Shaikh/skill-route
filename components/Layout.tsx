"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, } from "next-auth/react";
import React, { useState } from "react";
import Navbar from "./Navbar";
import ThemeSwitcher from "./ThemeSwitcher";
import { ThemeProvider } from "./ThemeProvider";
import RouteLoader from "./RouteLoader";
import { Session } from "next-auth";

const Layout = ({ children, session }: { children: React.ReactNode, session: Session | null }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouteLoader />
          <header className="bg-white dark:bg-gray-900 w-full h-20 flex items-center justify-between fixed top-0 left-0 shadow-md z-20">
            <Navbar session={session} />
          </header>
          <main className="flex-1 pt-20">{children}</main>
          <ThemeSwitcher />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Layout;
