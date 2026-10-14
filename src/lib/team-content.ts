/**
 * The people on /about. A portrait is a path under public/; without one, the
 * initials stand in. The masters are in assets/images/people/. Add a person
 * only with their name and role as they want them.
 *
 * `links` are their own profiles. Add one only with its real URL — a guess
 * could link to a stranger — and its icon appears with it.
 */
export type TeamLink = {
  label: "LinkedIn" | "Instagram";
  href: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  portrait?: string;
  bio: string[];
  /** Profile URLs; an icon shows only once its URL is filled in. */
  linkedin?: string;
  instagram?: string;
  links?: TeamLink[];
};

export const TEAM: TeamMember[] = [
  {
    id: "daniel-t-gilbert",
    name: "Daniel T Gilbert",
    role: "Founder",
    portrait: "/images/people/daniel-t-gilbert.webp",
    bio: [
      "Daniel is the founder of TWS, driving the vision, direction and growth of the company.",
      "He focuses on the bigger picture — understanding where a business needs to go, finding the opportunities worth pursuing, and turning ideas into something the team can actually build.",
      "At TWS, he brings together business, strategy and creative thinking to make sure every project has a clear purpose beyond simply looking good.",
    ],
    // e.g. { label: "LinkedIn", href: "https://www.linkedin.com/in/…" }
    links: [],
  },
  {
    id: "ridha-mariyam",
    name: "Ridha Mariyam",
    role: "CTO & Co-Founder",
    bio: [
      "Ridha is the technical force behind TWS, responsible for turning ideas into reliable digital products and systems.",
      "From architecture and backend engineering to product development, automation and technical strategy, she works across the technology that powers what TWS builds.",
      "She thinks in systems — how things should work, how they should scale, and how technology can create a real advantage for the businesses TWS works with.",
    ],
    links: [],
  },
];
