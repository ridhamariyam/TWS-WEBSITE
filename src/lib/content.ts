/**
 * Homepage copy and imagery. Everything here is TWS placeholder content,
 * written to the same lengths and line structure as the reference layout so
 * the design holds. Replace with final copy and photography before launch.
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

const logo = { src: "/images/brand/tws-mark.svg", alt: "TWS", width: 100, height: 112 };

export const primaryNav: LinkItem[] = [
  { label: "Home", href: "#" },
  { label: "Agency", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "People", href: "#testimonials" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export const header: HeaderContent = {
  logo,
  nav: primaryNav.map((item) =>
    item.label === "Expertise"
      ? {
          ...item,
          children: [
            { label: "Brand strategy", href: "#expertise" },
            { label: "Web design", href: "#expertise" },
            { label: "Development", href: "#expertise" },
            { label: "Digital marketing", href: "#expertise" },
          ],
        }
      : item,
  ),
  cta: { label: "Let's talk", href: "#contact" },
};

export const hero: HeroContent = {
  backgroundWord: "branding",
  lines: ["We build bold", "digital brands"],
};

export const features: FeatureItem[] = [
  { icon: "badge", label: "Full-service digital studio" },
  { icon: "pin", label: "Working across time zones" },
  { icon: "heart", label: "Loved by our clients" },
];

export const about: AboutContent = {
  heading: "We shape brands people remember.",
  body: [
    "Every project starts with listening. With ",
    { emphasis: "10+ years of craft" },
    " behind us, we pair sharp strategy with thoughtful design to build websites and brands that feel effortless to use and grow with our clients.",
  ],
  link: { label: "Meet the team", href: "#testimonials" },
  backgroundWord: "story",
  image: {
    src: "/images/about/workspace.svg",
    alt: "The TWS studio workspace",
    width: 945,
    height: 785,
  },
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Brand strategy",
    description: "Research and positioning that give your brand a clear, confident direction.",
  },
  {
    number: "02",
    title: "Web design",
    description: "Considered interfaces that guide visitors and turn attention into action.",
  },
  {
    number: "03",
    title: "Development",
    description: "Fast, accessible builds engineered to scale as your business grows.",
  },
];

const projectList: Array<[string, string]> = [
  ["Northline Coffee", "Branding"],
  ["Atlas Journal", "Editorial"],
  ["Soft Form", "Product"],
  ["Paperlane", "Packaging"],
  ["Ember Goods", "Identity"],
  ["Quiet Hours", "Digital"],
  ["Field Notes", "Campaign"],
  ["Stone & Salt", "Packaging"],
];

export const projects: ProjectsContent = {
  backgroundWord: "showcase",
  badgeText: "TWS studio • design & development • since 2014 • ",
  link: { label: "View all work", href: "#projects" },
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

export const awards: AwardsContent = {
  heading: "Industry recognition",
  tag: "Made with intent",
  backgroundWord: "honors",
  intro:
    "Our work has been recognised by design juries around the world, proof that careful craft and clear strategy pay off for the brands we partner with.",
  rows: [
    { count: "6X", label: "Site of the day", source: "Honorline", year: "2025" },
    { count: "3X", label: "Developer award", source: "Pixelboard", year: "2024" },
    { count: "5X", label: "Site of the month", source: "Honorline", year: "2023" },
    { count: "2X", label: "Best portfolio", source: "Studiorank", year: "2022" },
  ],
  logos: [1, 2, 3].map((n) => ({
    src: `/images/awards/award-0${n}.svg`,
    alt: ["Honorline", "Pixelboard", "Studiorank"][n - 1],
    width: 170,
    height: 30,
  })),
};

export const testimonials: TestimonialsContent = {
  rating: "4.96",
  ratingLabel: "Client rating",
  background: "/images/testimonials/dot-field.svg",
  items: [
    {
      quote: [
        "Working with TWS felt like having a ",
        { emphasis: "brilliant" },
        " in-house team. They listened, moved fast and delivered beyond our brief.",
      ],
      author: "@Maya Fernandes",
    },
    {
      quote: [
        "The new site doubled our enquiries in three months. Clear process, ",
        { emphasis: "thoughtful" },
        " design and zero surprises.",
      ],
      author: "@Daniel Okafor",
    },
    {
      quote: [
        "From strategy to launch every detail was handled with care. Our brand finally looks like the ",
        { emphasis: "company" },
        " we are.",
      ],
      author: "@Priya Raman",
    },
  ],
  logos: [
    ["Northwind", 146],
    ["Globex", 128],
    ["Initech", 104],
    ["Vandelay", 150],
    ["Umbra", 116],
  ].map(([alt, width], i) => ({
    src: `/images/clients/client-0${i + 1}.svg`,
    alt: String(alt),
    width: Number(width),
    height: 35,
  })),
};

export const blog: BlogContent = {
  heading: "Latest insights",
  link: { label: "Read the journal", href: "#blog" },
  posts: [
    ["Strategy", "12 August 2026", "How to brief a design agency and get the site you want."],
    ["Design", "28 July 2026", "Choosing a type pairing that carries your brand voice."],
    ["Development", "9 July 2026", "Why page speed is still the quietest conversion booster."],
    ["Branding", "21 June 2026", "Building a colour system that scales across channels."],
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

export const cta: CtaContent = {
  darkWord: "start",
  limeWord: "something",
  badgeText: "Let's build something great • TWS studio • ",
};

export const footer: FooterContent = {
  tagline: ["Have a project in mind? ", { emphasis: "Let's talk." }],
  logo,
  offices: [
    { name: "TWS - Studio One", lines: ["120 Harbour Street, Level 4,", "Waterfront District"] },
    { name: "TWS - Studio Two", lines: ["48 Market Lane, Suite 9,", "Old Town Quarter"] },
  ],
  phone: "+ 000 123 4567",
  email: "hello@tws.studio",
  nav: primaryNav,
  copyright: ["© 2026 TWS Studio. Designed & built by ", { emphasis: "TWS" }],
};
