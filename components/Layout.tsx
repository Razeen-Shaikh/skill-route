"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import Navbar from "./Navbar";
import ThemeSwitcher from "./ThemeSwitcher";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <header className="bg-white dark:bg-gray-900 w-full h-20 flex items-center justify-between fixed top-0 left-0 shadow-md z-20">
          <Navbar />
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 pt-20"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <ThemeSwitcher />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Layout;
