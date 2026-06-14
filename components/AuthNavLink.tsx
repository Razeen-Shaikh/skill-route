"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getAuthNavLink } from "@/lib/authNav";

const linkClassName =
    "block px-3 py-2 rounded-md text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer";

export default function AuthNavLink() {
    const pathname = usePathname();
    const { href, label } = getAuthNavLink(pathname);

    return (
        <Link href={href} className={linkClassName}>
            {label}
        </Link>
    );
}
