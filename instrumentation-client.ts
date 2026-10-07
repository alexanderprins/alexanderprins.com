import posthog from "posthog-js";

// PostHog: product analytics + session replay + heatmaps. Runs before the app
// is interactive. Events go through the /ingest rewrite in next.config.ts so
// ad blockers don't drop them. No key (local dev, preview without env) = off.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key && process.env.NODE_ENV === "production") {
  try {
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      // Pins behaviour to this snapshot; includes SPA pageview tracking on
      // client-side route changes.
      defaults: "2026-08-30",
    });
  } catch {
    // Analytics must never break the site.
  }
}
