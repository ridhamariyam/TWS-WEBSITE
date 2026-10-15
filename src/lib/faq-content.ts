import type { RichRun } from "@/types/content";
import { aboutHref, ROUTES, serviceHref } from "@/lib/site-links";

/**
 * The questions a first conversation actually opens with, and the studio's
 * answers to them.
 *
 * Every answer here is something the site can stand behind today. TWS opened
 * in 2026 and its first projects are still in build, so nothing below claims
 * a client list, a delivery record, a turnaround it has never had to hit, or
 * a price it has never charged. Where the honest answer is "it depends" or
 * "not yet", that is the answer given — the budget bands are the ones the
 * enquiry form asks about, and the stages are the four in process-content.
 *
 * Shared by the homepage's FAQ block and /faq, so the two cannot drift.
 */

export type FaqEntry = {
  /** Stable id: the anchor on /faq and the key in the structured data. */
  id: string;
  question: string;
  /** Paragraphs, each a run of strings and inline links. */
  answer: RichRun[][];
};

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "new-studio",
    question: "You're a new studio. Why should I trust you with this?",
    answer: [
      [
        "Because you can see the work rather than a logo wall. TWS opened in 2026, and the two projects it is building — a product site with a 3D model viewer, and a commerce platform with a storefront on top of it — are written up on ",
        { label: "the work page", href: ROUTES.work },
        " in enough detail to judge: what was built, what it was built with, and where it stands.",
      ],
      [
        "What a new studio can offer is attention. You are talking to the people doing the work, and nothing is being subcontracted past them.",
      ],
    ],
  },
  {
    id: "cost",
    question: "What does a project cost?",
    answer: [
      [
        "It depends on what is being built, and anyone quoting before they know is guessing. Projects here run up to ₹3,00,000, and the enquiry form asks which band you have in mind — under ₹50,000, ₹50,000–₹1,00,000, ₹1,00,000–₹2,00,000, ₹2,00,000–₹3,00,000, or not sure yet — because a five-page site and a store are not the same conversation.",
      ],
      [
        "You get a fixed price for a defined scope before anything starts. No hourly meter, and no invoice that arrives larger than the number agreed.",
      ],
    ],
  },
  {
    id: "timeline",
    question: "How long does it take?",
    answer: [
      [
        "A straightforward marketing site is usually weeks rather than months; a store or a web application is longer, because there is more to get right than there is to design. The form asks whether you need it as soon as possible, in one to three months, in three to six, or whether you are still exploring — that answer shapes the plan more than any other.",
      ],
      [
        "Whatever the length, you get the dates at the start, and you hear about a slip from us before you notice it yourself.",
      ],
    ],
  },
  {
    id: "process",
    question: "How do you actually work?",
    answer: [
      [
        "Four stages: think, design, build, grow. We get into the business before anything is drawn, turn that into something people can use, engineer it properly, and keep improving it after launch. It is set out stage by stage under ",
        { label: "how we work", href: aboutHref("process") },
        ".",
      ],
      [
        "In practice it means you see work regularly rather than at a single reveal, and nothing is built from a brief we have not questioned.",
      ],
    ],
  },
  {
    id: "what-we-build",
    question: "What can you build?",
    answer: [
      [
        { label: "Websites", href: serviceHref("web-design") },
        " — business sites, launches, redesigns, content platforms — ",
        { label: "online stores", href: serviceHref("ecommerce") },
        ", and ",
        { label: "web applications", href: serviceHref("web-applications") },
        ": portals, dashboards, booking systems, internal tools. The strategy and interface work that shape them are part of the job rather than a separate line on the invoice.",
      ],
      [
        "If what you need is outside that, we will say so rather than take the work and learn on your budget.",
      ],
    ],
  },
  {
    id: "platform",
    question: "Do you use WordPress, Shopify, or build from scratch?",
    answer: [
      [
        "Whichever costs you least over the life of the thing. A content site that a small team updates weekly is well served by a platform they already understand; a product with its own logic is usually cheaper to build properly than to force into one.",
      ],
      [
        "We will tell you which of the two you are looking at, and why, before you commit to either.",
      ],
    ],
  },
  {
    id: "ownership",
    question: "Who owns the site and the code?",
    answer: [
      [
        "You do, on final payment — the code, the content, the domain and the accounts it runs on. They are registered in your name, not the studio's, so nothing about leaving us is difficult.",
      ],
    ],
  },
  {
    id: "after-launch",
    question: "What happens after launch?",
    answer: [
      [
        "Launch is the fourth stage, not the last one. We measure what people actually do on the site and improve it from there, and we can stay on for updates, content and fixes if you want that.",
      ],
      [
        "If you would rather run it yourselves, you get it handed over properly: how it is put together, how to change it, and who to call.",
      ],
    ],
  },
  {
    id: "where",
    question: "Where are you, and does it matter?",
    answer: [
      [
        "The studio is in Calicut, Kerala. Most of the work happens over calls and shared documents either way, so where your business is has not decided anything so far.",
      ],
    ],
  },
  {
    id: "start",
    question: "How do we start?",
    answer: [
      [
        "Tell us what you are building or trying to fix — a few lines is plenty. ",
        { label: "The enquiry form", href: ROUTES.startProject },
        " asks the handful of things that make a first reply useful, and you can call, message or email the studio directly instead if you would rather.",
      ],
      [
        "The first conversation costs nothing and is not a pitch: if we are the wrong studio for it, we would rather say so early.",
      ],
    ],
  },
];
