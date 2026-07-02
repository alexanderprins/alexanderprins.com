import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// Single typeface sitewide: Aktiv Grotesk, served from Adobe Fonts (licensed
// through Creative Cloud). It loads via the Typekit <link> in <head> below —
// no font files in this repo. globals.css points --font-sans / --font-serif /
// --font-mono at the "aktiv-grotesk" family, so every font-sans/serif/mono
// utility resolves to this one face. Weights in the kit: 400 + 500, each with
// italic (400i = testimonial quote, 500 = h1/h2).

export const metadata: Metadata = {
  title: "Alexander Prins",
  description:
    "Brand designer who ships in code. Identity, brand systems, and AI-native builds.",
  icons: {
    icon: [
      {
        url: "/favicon_light.svg",
        media: "(prefers-color-scheme: light)",
        type: "image/svg+xml",
      },
      {
        url: "/favicon_dark.svg",
        media: "(prefers-color-scheme: dark)",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Aktiv Grotesk via Adobe Fonts CDN (licensed through Creative Cloud). */}
        <link
          rel="preconnect"
          href="https://use.typekit.net"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://use.typekit.net/nsl4rke.css" />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
