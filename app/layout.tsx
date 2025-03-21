"use client";

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            <Navbar />
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="p-6"
              >
                {children}
              </motion.main>
            </AnimatePresence>
            <ThemeSwitcher />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

// /app
//   ├── layout.tsx
//   ├── page.tsx (Home)
//   ├── api/ (API calls)
//   ├── auth/
//   │   ├── login.tsx
//   │   ├── register.tsx
//   ├── dashboard/
//   │   ├── page.tsx
//   │   ├── leaderboard.tsx
//   │   ├── settings.tsx
//   ├── quizzes/
//   │   ├── page.tsx
//   │   ├── [id].tsx
//   ├── tutorials/
//   │   ├── page.tsx
//   │   ├── [id].tsx
//   ├── components/
//   │   ├── Navbar.tsx
//   │   ├── ThemeSwitcher.tsx
//   │   ├── Leaderboard.tsx
//   ├── lib/
//   │   ├── api.ts
//   │   ├── auth.ts
