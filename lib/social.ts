import type { Metadata } from "next";

// Link-share preview for a job page: the intro video's cover frame becomes the
// og/twitter image. A route's `openGraph` REPLACES the root layout's (no merge),
// so title + description are set explicitly here too.
export function jobSocial(
  title: string,
  description: string,
  image?: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  if (!image) return {};
  const images = [{ url: image, width: 1920, height: 1080, alt: title }];
  return {
    openGraph: { title, description, images, type: "website" },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
