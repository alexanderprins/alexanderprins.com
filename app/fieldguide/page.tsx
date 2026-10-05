import type { Metadata } from "next";
import { MotionAppPage } from "@/components/MotionAppPage";
import { fieldguide } from "@/lib/motion";

// Bespoke, video-led page for Fieldguide's Senior Motion Designer role. Static
// segment, so it overrides the dynamic /[campaign] template for this slug.
export const metadata: Metadata = {
  title: fieldguide.ogTitle,
  description: fieldguide.ogDescription,
};

export default function FieldguidePage() {
  return <MotionAppPage app={fieldguide} />;
}
