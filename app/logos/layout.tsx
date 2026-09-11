import type { Metadata } from "next";

// /logos is a client component (can't export metadata), so its title +
// social preview live here. OG image = a screenshot of the page.
export const metadata: Metadata = {
  title: "Logos — Alexander Prins",
  description: "A selection of logos and marks by Alexander Prins.",
  openGraph: { images: ["/og/logos.jpg"] },
};

export default function LogosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
