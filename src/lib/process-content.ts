import type { RichRun } from "@/types/content";
import { serviceHref } from "@/lib/site-links";

/** The four-stage process, as an ordered list on /about and the homepage. */
export const PROCESS_STEPS: Array<{ heading: string; body: RichRun[] }> = [
  {
    heading: "01 — Think",
    body: [
      "We get into the business first. Audience. Positioning. Goals. Problems. No design theatre before we know what we're solving — which is why every project starts with strategy, not a moodboard.",
    ],
  },
  {
    heading: "02 — Design",
    body: [
      "We turn the thinking into an experience people can actually understand and use. Clear structure, distinctive design, zero filler — interfaces where every pixel has a reason to be there.",
    ],
  },
  {
    heading: "03 — Build",
    body: [
      "We engineer it properly. Performance, responsiveness, accessibility and scalability, whether it's a ",
      { label: "website", href: serviceHref("web-design") },
      ", a ",
      { label: "store", href: serviceHref("ecommerce") },
      " or a full ",
      { label: "web application", href: serviceHref("web-applications") },
      ". Built for launch — and everything after it.",
    ],
  },
  {
    heading: "04 — Grow",
    body: [
      "Launch isn't the finish line. We measure, learn and improve what comes next, so the site keeps earning its place long after it goes live.",
    ],
  },
];

