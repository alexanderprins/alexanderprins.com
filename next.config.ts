import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PostHog reverse proxy: /ingest/* is forwarded to PostHog (US cloud) so
  // analytics requests are first-party and survive ad blockers. See
  // instrumentation-client.ts.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  // PostHog's API paths end in a trailing slash; don't redirect them.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
