"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isHomeLayout } from "@/lib/home";

// Routes that always render dark. Toggles `hm-dark` on <html> as the user
// navigates in-app. Initial page loads are handled by the inline script in the
// layout <head> (no flash); this keeps it in sync on client-side navigation.
const HM_DARK_ROUTES = new Set(["/work/hello-marjorie"]);

export function RouteTheme() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.classList.toggle("hm-dark", HM_DARK_ROUTES.has(pathname));
    // /logos manages logos-dark itself (user-toggled). On client nav away,
    // clean it up so the next page doesn't inherit the dark state.
    if (pathname !== "/logos") {
      document.documentElement.classList.remove("logos-dark");
    }
    // the homepage layout (home, its case-study URLs, home-layout job pages)
    // is always dark
    document.documentElement.classList.toggle("home-dark", isHomeLayout(pathname));
  }, [pathname]);
  return null;
}
