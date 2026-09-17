/**
 * TWS — The Web Studio
 *
 * Homepage content based on the approved TWS Website Strategy & Copy.
 *
 * Positioning:
 * Strategy, design and technology under one focused studio.
 *
 * Primary tagline:
 * Small studio. Serious work.
 */

import type {
  AboutContent,
  AwardsContent,
  BlogContent,
  CtaContent,
  FeatureItem,
  FooterContent,
  HeaderContent,
  HeroContent,
  LinkItem,
  ProcessStep,
  ProjectsContent,
  TestimonialsContent,
} from "@/types/content";

const logo = {
  src: "/images/brand/tws-wordmark.png",
  alt: "TWS — The Web Studio.",
  width: 400,
  height: 159,
};

/* =========================================================
   NAVIGATION
   ========================================================= */

export const primaryNav: LinkItem[] = [
  { label: "Home", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#projects" },
  { label: "Studio", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const header: HeaderContent = {
  logo,

  nav: primaryNav,

  cta: {
    label: "Start a project",
    href: "#contact",
  },
};

/* =========================================================
   HERO
   ========================================================= */

export const hero: HeroContent = {
  backgroundWord: "TWS.  ",

  lines: [
    "Your website is",
    "the first conversation",
    "with your business.",
  ],
};

/* =========================================================
   HERO / TRUST SIGNALS
   ========================================================= */

export const features: FeatureItem[] = [
  {
    icon: "badge",
    label: "Strategy first",
  },
  {
    icon: "pin",
    label: "One focused studio",
  },
  {
    icon: "heart",
    label: "Built with intent",
  },
];

/* =========================================================
   THE BELIEF / ABOUT
   ========================================================= */

export const about: AboutContent = {
  heading: "Trust is decided before anyone reads a word.",

  body: [
    "A website is not a digital brochure. For most businesses, it's the first real interaction a stranger has with them — before a call, a visit, a booking or a sale. ",
    {
      emphasis: "TWS treats that decision as the whole job.",
    },
    " Strategy comes before decoration. Design has a reason behind every choice. Technology supports the experience instead of getting in its way.",
  ],

  link: {
    label: "Why TWS",
    href: "#studio",
  },

  backgroundWord: "trust",

  image: {
    src: "/images/about/workspace.svg",
    alt: "TWS studio",
    width: 945,
    height: 785,
  },
};

/* =========================================================
   PROCESS
   ========================================================= */

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Think",
    description:
      "Understand the business, the audience, the positioning and the goal — before anything is designed.",
  },

  {
    number: "02",
    title: "Design",
    description:
      "Translate the strategy into a clear, distinctive digital experience — structured around how people decide.",
  },

  {
    number: "03",
    title: "Build",
    description:
      "Develop the experience for performance, responsiveness and scale — built to last, not just launch.",
  },

  {
    number: "04",
    title: "Grow",
    description:
      "Launch, measure and improve. A website is a starting point, not a finished thing.",
  },
];

/* =========================================================
   SERVICES
   ========================================================= */

const serviceList = [
  {
    title: "Web Design & Development",
    category: "Web",
    description:
      "Websites that look considered and work properly.",
  },

  {
    title: "E-commerce",
    category: "Commerce",
    description:
      "Stores built to sell, not just display.",
  },

  {
    title: "Web Applications",
    category: "Applications",
    description:
      "Tools your business — or your customers — actually use.",
  },

  {
    title: "UI / UX Design",
    category: "Experience",
    description:
      "Every screen, designed with a reason.",
  },

  {
    title: "Digital Strategy",
    category: "Strategy",
    description:
      "The thinking that comes before the design.",
  },
];

export const services = {
  heading: "What we do.",

  intro:
    "Strategy, design and technology working together — under one focused studio.",

  items: serviceList.map((service) => service),
};

/* =========================================================
   WHY TWS
   ========================================================= */

export const studio = {
  heading: "Small studio. Serious work.",

  body: [
    "TWS is intentionally small. Not because it can't grow — because growing the wrong way costs clients the thing they're actually paying for: direct access to the people doing the thinking.",

    "There's no account manager translating your brief to a design team you'll never meet, and no developer three layers removed from the strategy.",

    "Strategy, design and technology sit in the same room, working on the same problem — yours.",

    "It's more structure than a freelancer, and more focus than a large agency: a studio built to stay in the room for the whole project, not just the first meeting.",

    "It's a different way of working. It's also why the work holds up.",
  ],

  backgroundWord: "studio",
};

/* =========================================================
   SELECTED WORK
   ========================================================= */

/**
 * Replace these with real TWS projects before launch.
 *
 * Do NOT publish invented results.
 * The strategy explicitly requires real, measured outcomes.
 */

const projectList: Array<[string, string]> = [
  ["Project One", "Real Estate"],
  ["Project Two", "Hospitality"],
  ["Project Three", "E-commerce"],
  ["Project Four", "Professional Services"],
];

export const projects: ProjectsContent = {
  backgroundWord: "selected",

  badgeText:
    "TWS — Strategy / Design / Technology — Selected Work — ",

  link: {
    label: "View our work",
    href: "#projects",
  },

  items: projectList.map(([title, category], i) => ({
    title,
    category,
    href: "#projects",

    image: {
      src: `/images/projects/project-0${i + 1}.svg`,
      alt: `${title} project preview`,
      width: 800,
      height: 635,
    },
  })),
};

/* =========================================================
   INDUSTRIES
   ========================================================= */

export const industries = {
  heading: "Where we do our best work.",

  intro:
    "TWS works best with businesses where a digital presence carries real weight — where trust is decided online before a call, a booking or a visit ever happens.",

  items: [
    {
      title: "Real Estate",
      description:
        "A property is a considered decision. The website needs to build the same confidence a good agent would — before the first viewing.",
    },

    {
      title: "Hospitality",
      description:
        "Hotels and resorts are booked on trust and imagination. The website has to do both — sell an experience, and remove every doubt about booking it.",
    },

    {
      title: "Healthcare",
      description:
        "Patients choose a clinic the way they choose a doctor — carefully. The website needs to earn that confidence in seconds, not sell it in paragraphs.",
    },

    {
      title: "Professional Services",
      description:
        "When the product is expertise, the website is the only proof a prospect gets before the first conversation. It has to carry the weight alone.",
    },

    {
      title: "Startups & Technology",
      description:
        "An early-stage company is judged by its website before its product. It has to look like where the company is going, not just where it is.",
    },

    {
      title: "E-commerce",
      description:
        "Every screen between browsing and buying is a chance to lose the sale. The website has to remove friction, not add polish for its own sake.",
    },
  ],
};

/* =========================================================
   TESTIMONIALS
   ========================================================= */

/**
 * Keep this section only when real client testimonials are available.
 * Placeholder quotes from the previous template have intentionally
 * been removed because fabricated testimonials should never go live.
 */

export const testimonials: TestimonialsContent = {
  rating: "",
  ratingLabel: "",

  background: "/images/testimonials/dot-field.svg",

  items: [],

  logos: [],
};

/* =========================================================
   AWARDS
   ========================================================= */

/**
 * Do not publish fabricated awards or recognition.
 * Populate this section only with verified TWS awards.
 */

export const awards: AwardsContent = {
  heading: "Recognition",
  tag: "Built with intent",
  backgroundWord: "honors",

  intro:
    "Recognition earned through considered strategy, design and technology.",

  rows: [],

  logos: [],
};

/* =========================================================
   INSIGHTS
   ========================================================= */

/**
 * Editorial section.
 *
 * Replace placeholder posts with actual TWS articles before launch.
 */

export const blog: BlogContent = {
  heading: "Thinking behind the work.",

  link: {
    label: "View all insights",
    href: "#blog",
  },

  posts: [
    [
      "Strategy",
      "Insight",
      "Why your website is part of the business strategy.",
    ],

    [
      "Design",
      "Insight",
      "Designing around how people decide.",
    ],

    [
      "Development",
      "Insight",
      "Building websites that hold up beyond launch.",
    ],

    [
      "Business",
      "Insight",
      "What your website tells people before you meet.",
    ],
  ].map(([category, date, title], i) => ({
    category,
    date,
    title,
    href: "#blog",

    image: {
      src: `/images/blog/post-0${i + 1}.svg`,
      alt: title,
      width: 597,
      height: 430,
    },
  })),
};

/* =========================================================
   FINAL CTA
   ========================================================= */

export const cta: CtaContent = {
  darkWord: "build",

  limeWord: "what's next",

  badgeText:
    "Start a conversation — TWS — The Web Studio — Strategy / Design / Technology — ",
};

/* =========================================================
   FOOTER
   ========================================================= */

export const footer: FooterContent = {
  tagline: [
    "TWS — The Web Studio. ",
    {
      emphasis: "Strategy, design and technology, under one studio.",
    },
  ],

  logo,

  offices: [
    {
      name: "TWS — The Web Studio",
      lines: [
        "Calicut, Kerala",
        "India",
      ],
    },
  ],

  phone: "",

  email: "thewebstudioagency@gmail.com",

  nav: primaryNav,

  copyright: [
    "© 2026 TWS — The Web Studio. ",
    {
      emphasis: "Built with intent.",
    },
  ],
};
