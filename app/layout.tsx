import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Self-hosted PP Editorial New. --font-pp-editorial is consumed by
// --font-serif in globals.css (which the `font-serif` utility reads).
const ppEditorial = localFont({
  src: [
    { path: "./fonts/PPEditorialNew-Ultralight.ttf", weight: "200", style: "normal" },
    { path: "./fonts/PPEditorialNew-UltralightItalic.ttf", weight: "200", style: "italic" },
    { path: "./fonts/PPEditorialNew-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/PPEditorialNew-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/PPEditorialNew-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/PPEditorialNew-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-pp-editorial",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ppEditorial.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
