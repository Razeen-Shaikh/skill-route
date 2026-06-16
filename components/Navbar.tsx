"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, LogOut, User, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import AuthNavLink from "@/components/AuthNavLink";
import { getHomeHref, getNavItems } from "@/lib/authNav";

export default function Navbar({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const isAuthenticated = !!session;
  const homeHref = getHomeHref(isAuthenticated);
  const navItems = getNavItems(isAuthenticated);

  const logOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="w-full">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            href={homeHref}
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer flex items-center"
            onClick={closeMobileMenu}
          >
            <BookOpen className="w-6 h-6" />
            <span className="ml-2">SkillRoute</span>
          </Link>

          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 cursor-pointer"
                  >
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
              <AuthNavLink />
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900 dark:text-white" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${
            isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} onClick={closeMobileMenu}>
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  closeMobileMenu();
                  logOut();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <div onClick={closeMobileMenu}>
                <AuthNavLink />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className="block px-3 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
  >
    {children}
  </Link>
);
