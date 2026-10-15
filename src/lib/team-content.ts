/** The founders shown on /about, with their names, roles and biographies. */
type TeamMember = {
  name: string;
  role: string;
  bio: string[];
};

export const TEAM: TeamMember[] = [
  {
    name: "Daniel T Gilbert",
    role: "Founder",
    bio: [
      "Daniel is the founder of TWS, driving the vision, direction and growth of the company.",
      "He focuses on the bigger picture — understanding where a business needs to go, finding the opportunities worth pursuing, and turning ideas into something the team can actually build.",
      "At TWS, he brings together business, strategy and creative thinking to make sure every project has a clear purpose beyond simply looking good.",
    ],
  },
  {
    name: "Ridha Mariyam",
    role: "CTO & Co-Founder",
    bio: [
      "Ridha is the technical force behind TWS, responsible for turning ideas into reliable digital products and systems.",
      "From architecture and backend engineering to product development, automation and technical strategy, she works across the technology that powers what TWS builds.",
      "She thinks in systems — how things should work, how they should scale, and how technology can create a real advantage for the businesses TWS works with.",
    ],
  },
];
