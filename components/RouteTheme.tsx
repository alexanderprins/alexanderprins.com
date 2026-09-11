"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
  }, [pathname]);
  return null;
}
