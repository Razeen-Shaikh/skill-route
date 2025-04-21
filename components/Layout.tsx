"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";
import Navbar from "./Navbar";
import ThemeSwitcher from "./ThemeSwitcher";
import RouteLoader from "./RouteLoader";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <RouteLoader />
        <header className="bg-white dark:bg-gray-900 w-full h-20 flex items-center justify-between fixed top-0 left-0 shadow-md z-20">
          <Navbar />
        </header>
        <main className="flex-1 pt-20">{children}</main>
        <ThemeSwitcher />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Layout;
