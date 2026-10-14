/**
 * The content of /about. The principles are also the homepage's "We start with
 * the business" cards, shared so the two pages cannot drift apart.
 */

export const STUDIO_INTRO =
  "TWS — The Web Studio — is a digital product studio. We design and build interactive, story-driven websites and custom digital experiences, bringing strategy, storytelling, UI/UX, motion and engineering together under one roof.";

export const STUDIO_LOCATION = "Calicut · Kerala · India — Est. 2026";

export const STUDIO_PRINCIPLES = [
  {
    id: "brief",
    title: "A brief tells us what you think you need.",
    body: "We want to understand why. What's the business trying to become? Who needs to believe in it? Where are people dropping off? What needs to change?",
  },
  {
    id: "answers",
    title: "Then we design and build around the answers.",
    body: "Because a great website isn't decoration. It's business thinking, made visible.",
  },
] as const;

export const STUDIO_POV = {
  statement:
    "We don't build websites. We build digital experiences that tell stories, build trust, and convert visitors into customers.",
  points: [
    {
      heading: "Vision",
      body: "To elevate India's digital design ecosystem by creating interactive, story-driven websites that meet international standards.",
    },
    {
      heading: "Mission",
      body: "To help businesses stand out through digital experiences that combine storytelling, strategic design and engineering excellence — turning visitors into customers.",
    },
  ],
};

/** What the studio stands for: /about's values, each with its picture. */
export const STUDIO_VALUES = [
  {
    title: "Strategy first",
    body: "We start with why: what the business wants to become, who needs to believe in it, and where people drop off.",
    image: "web-design",
  },
  {
    title: "Story-driven",
    body: "A site should say who you are before anyone reads a word. We shape the story, then design around it.",
    image: "hospitality",
  },
  {
    title: "Engineered",
    body: "Fast, accessible and built to last. The code underneath matters as much as the design on top.",
    image: "web-applications",
  },
  {
    title: "Honest work",
    body: "No borrowed logos, no inflated promises. We show what we have built and say plainly what we will do.",
    image: "professional-services",
  },
];
