import type { Metadata } from "next";
import { MotionAppPage } from "@/components/MotionAppPage";
import { jobSocial } from "@/lib/social";
import { baseten } from "@/lib/motion";

// Bespoke, video-led page for Baseten's Motion Designer, Brand Team role.
// Static segment, so it overrides the dynamic /[campaign] template for this slug.
export const metadata: Metadata = {
  title: baseten.ogTitle,
  description: baseten.ogDescription,
  ...jobSocial(baseten.ogTitle, baseten.ogDescription, baseten.introVideo.poster),
};

export default function BasetenPage() {
  return <MotionAppPage app={baseten} />;
}
