import type { RichRun } from "@/types/content";
import { serviceHref } from "@/lib/site-links";

/**
 * The studio's insight posts. Paragraphs are runs of strings and inline links,
 * so links stay real anchors rather than being flattened into text.
 */
export type InsightEntry = {
  category: string;
  title: string;
  body: RichRun[][];
};

export const INSIGHT_ENTRIES: InsightEntry[] = [
  {
    category: "Strategy",
    title: "Your website isn't a brochure. So stop treating it like one.",
    body: [
      [
        "A brochure describes. A website decides. The moment someone lands on your site they are working out whether you understand their problem, whether you can be trusted with it, and what they should do next — usually in that order.",
      ],
      [
        "Pages built to list what you do rarely answer any of that. Pages built around positioning and architecture almost always do.",
      ],
    ],
  },
  {
    category: "Design",
    title: "Good UX doesn't feel like UX.",
    body: [
      [
        "Nobody notices a navigation that works, a form that asks for the right things, or a page that puts the answer where the question was. They only notice the friction.",
      ],
      [
        "Which is the point: interface work is at its best when it disappears and leaves nothing but the decision the visitor came to make.",
      ],
    ],
  },
  {
    category: "Development",
    title: "Your website can look expensive and still load like it's 2012.",
    body: [
      [
        "Design gets the attention, but the first thing anyone experiences is weight — uncompressed images, render-blocking scripts, a hero that takes four seconds to settle. On a phone, on mobile data, that is the whole first impression.",
      ],
      [
        "Performance isn't a finishing task. It is a decision made at build time, and it is why we treat ",
        { label: "engineering", href: serviceHref("web-design") },
        " as part of the design, not a step after it.",
      ],
    ],
  },
  {
    category: "E-Commerce",
    title: "The checkout is part of your brand.",
    body: [
      [
        "Brands spend months on the product page and inherit the checkout. Then they wonder where the drop-off comes from.",
      ],
      [
        "Every field, every unexpected cost, every redirect is a reason to leave. Designing ",
        { label: "the last five steps", href: serviceHref("ecommerce") },
        " as carefully as the first five is usually the cheapest revenue you will ever find.",
      ],
    ],
  },
];
