"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const logOut = () => {
    signOut();
    window.location.href = "/";
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
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
          <div className="hidden md:flex space-x-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/tutorials">Tutorials</NavLink>
            <NavLink href="/quizzes">Quizzes</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            {session ? (
              <NavLink href="/" onClick={() => logOut()}>
                Logout
              </NavLink>
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

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden space-y-2 pb-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/tutorials">Tutorials</NavLink>
            <NavLink href="/quizzes">Quizzes</NavLink>
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/auth/login">Login</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

const NavLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-3 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
  >
    {children}
  </Link>
);
