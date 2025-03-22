"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const logOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <nav className="w-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            🚀 SkillRoute
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/tutorials">Tutorials</NavLink>
            <NavLink href="/quizzes">Quizzes</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>

            {/* Auth Actions */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {session?.user?.name || "Profile"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => logOut()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <NavLink href="/auth/login">Login</NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu with Animation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden space-y-2 pb-4"
            >
              <NavLink href="/">Home</NavLink>
              <NavLink href="/tutorials">Tutorials</NavLink>
              <NavLink href="/quizzes">Quizzes</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
              {session ? (
                <button
                  onClick={() => logOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  Logout
                </button>
              ) : (
                <NavLink href="/auth/login">Login</NavLink>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="block px-3 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
  >
    {children}
  </Link>
);
