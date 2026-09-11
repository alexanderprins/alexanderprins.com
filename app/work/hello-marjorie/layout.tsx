import type { Metadata } from "next";

// The page itself is a client component (can't export metadata), so its
// title/description + social preview live here. OG image = the project cover.
export const metadata: Metadata = {
  title: "Hello, Marjorie — Alexander Prins",
  description:
    "An interactive redesign of a cocktail bar's menu, rebuilt in code and annotated with the decisions behind it.",
  openGraph: { images: ["/work/hello-marjorie/cover.png"] },
};

export default function HelloMarjorieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
