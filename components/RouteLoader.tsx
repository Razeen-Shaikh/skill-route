// components/RouteLoader.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import "../styles/nprogress.css";

nprogress.configure({ showSpinner: false });

const RouteLoader = () => {
  const pathname = usePathname();
  const previousPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Start nprogress when route changes
    if (
      previousPathRef.current !== null &&
      previousPathRef.current !== pathname
    ) {
      nprogress.start();
    }

    // End nprogress when route completes
    nprogress.done();
    previousPathRef.current = pathname;
  }, [pathname]);

  return null;
};

export default RouteLoader;
