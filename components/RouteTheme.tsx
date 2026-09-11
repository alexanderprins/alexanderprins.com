"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Routes that render in dark mode. Toggles `hm-dark` on <html> as the user
// navigates in-app. Initial page loads are handled by the inline script in the
// layout <head> (no flash); this keeps it in sync on client-side navigation.
const DARK_ROUTES = new Set(["/work/hello-marjorie"]);

export function RouteTheme() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.toggle("hm-dark", DARK_ROUTES.has(pathname));
  }, [pathname]);
  return null;
}
