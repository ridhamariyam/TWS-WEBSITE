import type { WorkPick } from "@/components/flow/flow-work";
import type { ServiceId } from "@/lib/services-content";

/**
 * The copy for each service's own page, from "TWS_Service_Pages_Content_Copy"
 * (the client's copy deck). Wording is the deck's own, with three kinds of
 * line left out until TWS settles them:
 *
 * - anything marked [CONFIRM] that cannot stand without the confirmation
 *   (handover and ownership after launch, the ERP/CRM answer); where the
 *   marker only asks for a further detail, the sentence stays and the marker
 *   goes;
 * - empty placeholders, such as the case-study context and decision lines.
 *   Each "Selected work" card says instead what the project's own summary in
 *   work-content.ts says, with its status, and no result line.
 */

type ServiceItem = { title: string; body: string };

export type ServicePage = {
  id: ServiceId;
  slug: string;
  name: string;
  meta: {
    documentTitle: string;
    description: string;
    ogTitle?: string;
    ogDescription?: string;
  };
  hero: { eyebrow: string; title: string; muted: string; lead: string; footRight: string; image: string };
  /** Short lines from the copy, played as kinetic type. */
  statements: Array<{ parts: Array<string | { text: string; serif?: boolean }>; white?: boolean }>;
  build: { label: string; text: string; items: ServiceItem[]; images: string[] };
  chapters: Array<{
    id?: string;
    eyebrow: string;
    title: string;
    accent?: string;
    intro?: string[];
    items?: Array<{ title: string; body?: string }>;
    variant?: "grid" | "steps" | "rows";
    note?: string;
    /** Where it sits: before the "What we build" scenes, or after. */
    beforeBuild?: boolean;
  }>;
  /** Sits just before the "How we work" chapter. */
  work: { eyebrow?: string; title: string; accent?: string; intro?: string[]; picks: WorkPick[] };
  faqTitle: string;
  faqs: Array<{ question: string; answer: string }>;
  closing: { lead: string; accent: string; note: string };
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    id: "web-design",
    slug: "web-development",
    name: "Web Design & Development",
    meta: {
      documentTitle: "Website Design & Development Services | TWS - TheWebStudio",
      description:
        "Website design and development for startups, SMEs and B2B companies. Custom-built, strategy first, under one studio.",
      ogTitle: "Website design and development — TheWebStudio (TWS)",
      ogDescription:
        "Your website is often the first real conversation with your business. We design and build it to hold up.",
    },
    hero: {
      eyebrow: "Web Design & Development",
      title: "Websites that",
      muted: "earn trust.",
      lead: "Your website is often the first conversation with your business. We combine strategy, design and technology to build websites that hold up.",
      footRight: "Strategy, design and development — in the same room.",
      image: "web-design",
    },
    statements: [
      { parts: ["Most website projects pass through", { text: "too many hands.", serif: true }] },
      { parts: ["Something is lost at", { text: "every hand-off.", serif: true }] },
      { parts: ["Strategy, design and development —", { text: "in the same room.", serif: true }], white: true },
    ],
    build: {
      label: "Websites we design and build",
      text: "Different businesses need their website to do different jobs. Our web design services start by working out which job yours has.",
      images: ["real-estate", "professional-services", "hospitality", "studio-footer", "startups-technology", "web-design", "healthcare", "web-applications"],
      items: [
        {
          title: "Corporate websites",
          body: "Corporate website development for organisations with several audiences, a lot of content and more than one person signing off. Each audience finds what it came for. Your team keeps it current without calling a developer.",
        },
        {
          title: "B2B websites",
          body: "B2B website design for offers that take more than a sentence to explain. Clear structure, credible proof, an obvious route to enquiry. The website supports the sales conversation instead of repeating the brochure.",
        },
        {
          title: "Custom business websites",
          body: "Custom website development for businesses that have outgrown a template. Designed around your content and your customers. Built to take new pages, features and integrations as the business changes.",
        },
        {
          title: "Landing pages",
          body: "Landing page design for launches, campaigns and single offers. One page. One job. Consistent with everything else you've built.",
        },
      ],
    },
    chapters: [
      {
        eyebrow: "Small studio. Serious work.",
        title: "Strategy, design and development —",
        accent: "in the same room.",
        intro: [
          "Most website projects pass through too many hands. A strategist writes a brief. A designer interprets it. A developer builds what survives. Something is lost at every hand-off.",
          "At TWS, the people who think through your business are the people who design and build your website. You talk to them directly. No account managers, no translation layer. It's more structure than a freelancer, and more focus than a large agency.",
        ],
        items: [
          {
            title: "Strategy first",
            body: "Before anything is designed, we work out what the website has to do: who it's for, what they need to understand, and in what order.",
          },
          {
            title: "Design with intent",
            body: "Every layout decision follows from that thinking. Pages are structured around how people read, compare and decide.",
          },
          {
            title: "Technology that holds up",
            body: "Development is in the room from day one. What gets designed can be built properly, loads quickly and stays easy to maintain.",
          },
        ],
        note: "Need an online store or a custom platform? That's e-commerce development or web application development.",
      },
      {
        eyebrow: "The baseline",
        title: "Built into every website",
        intro: ["None of this is an add-on. It's the standard."],
        variant: "rows",
        items: [
          { title: "Works on every screen", body: "Responsive layouts designed for phones, tablets and desktops. Not squeezed to fit." },
          { title: "Fast", body: "Lean pages, optimised images, only the code the site needs." },
          { title: "Accessible", body: "Usable by more people, including with a keyboard or screen reader." },
          { title: "Built to grow", body: "New pages, features and integrations can be added without starting again." },
        ],
      },
      {
        id: "process",
        eyebrow: "How we work",
        title: "How a project runs",
        intro: [
          "Four stages. The same on every project. You always know what's happening, what we need from you, and what you'll get.",
        ],
        variant: "steps",
        items: [
          { title: "Think", body: "We learn the business, the audience and the goal. We look hard at what exists today." },
          { title: "Design", body: "We turn the strategy into page designs, starting with the pages that matter most." },
          {
            title: "Build",
            body: "We build the site, set up the content management and integrations, and test it across devices and browsers.",
          },
          { title: "Grow", body: "We launch, check everything works, and hand over. Then we measure and improve." },
        ],
      },
      {
        eyebrow: "Redesigns",
        title: "Redesigning an existing website",
        intro: [
          "A redesign is worth it when the website no longer reflects the business. When it's hard to update, slow to load, or not turning visitors into enquiries.",
          "Our website redesign service starts with a review of what's already there: content, user experience, performance and search visibility. We keep what works. We fix what doesn't. Sometimes that means a refresh; sometimes a rebuild. The review decides.",
        ],
        items: [
          {
            title: "Protecting what you've already earned",
            body: "Pages that bring you traffic today should keep bringing it. We map every old address to its new one, set up redirects, carry over page titles and descriptions, and watch search performance after launch.",
          },
        ],
      },
      {
        eyebrow: "After launch",
        title: "A website is a starting point,",
        accent: "not a finished thing.",
        intro: ["Launch day is when real people start using it. That's when the useful learning starts."],
        variant: "rows",
        items: [
          {
            title: "Maintenance and support",
            body: "Our website maintenance services keep the site updated, secure and backed up, with help on hand when something needs changing.",
          },
          {
            title: "Ongoing improvement",
            body: "As the business changes, the website can change with it. We keep measuring and refining where it's useful.",
          },
        ],
      },
    ],
    work: {
      title: "The thinking behind",
      accent: "the screens.",
      intro: ["A small selection, shown with the reasoning behind it."],
      picks: [
        { slug: "pen-foundation", label: "Interactive website", link: "View the project", alt: "PEN Foundation website" },
        { slug: "zeen", label: "Multi-tenant e-commerce platform", link: "How we built Zeen", alt: "Zeen platform interface" },
      ],
    },
    faqTitle: "Questions, answered plainly",
    faqs: [
      {
        question: "How much does a website design and development project cost?",
        answer:
          "The cost depends on the website's scope, number of pages, functionality, integrations and content requirements. We understand what the business needs first, then provide a project-specific estimate rather than fitting every website into the same package.",
      },
      {
        question: "How long does it take to design and develop a website?",
        answer:
          "The timeline depends on the size and complexity of the project, the amount of content, and the features or integrations involved. We define the stages, deliverables and expected timeline before development begins.",
      },
      {
        question: "Do you build custom websites or use templates?",
        answer:
          "We provide custom website development for businesses that need more than a standard template. The website is designed around your content, audience and requirements. Where a proven platform or open-source tool makes sense, we use it rather than adding complexity for its own sake.",
      },
      {
        question: "Do you provide website redesign services?",
        answer:
          "Yes. Our website redesign services start with reviewing the existing website, including its content, structure, user experience, performance and search visibility. We keep what works and improve or rebuild what doesn't.",
      },
      {
        question: "Do you provide website maintenance services after launch?",
        answer:
          "Yes. Website maintenance services can include updates, security, backups, fixes and ongoing improvements, depending on the support arrangement agreed for the project.",
      },
      {
        question: "Do you offer B2B website design and corporate website development?",
        answer:
          "Yes. We work on B2B website design and corporate website development where the website needs to communicate complex offerings, serve different audiences and support enquiries or sales conversations. The structure is planned around how your visitors need to understand and evaluate the business.",
      },
      {
        question: "Do you work with businesses across Kerala?",
        answer:
          "Yes. TWS is a web design company in Kerala, based in Kozhikode (Calicut), and works with businesses across Kerala and beyond. Projects can be handled remotely with clear communication, review points and direct access to the team.",
      },
    ],
    closing: {
      lead: "Let's build",
      accent: "what's next.",
      note: "A new website. A redesign. Something you haven't fully defined yet. Start with a conversation. We work best with businesses that treat their website as part of how they operate.",
    },
  },
  {
    id: "web-applications",
    slug: "web-applications",
    name: "Web Application Development",
    meta: {
      documentTitle: "Web Application Development Services | TWS - TheWebStudio",
      description:
        "Web application development services for businesses that have outgrown standard software: custom platforms, dashboards, booking systems and integrations.",
    },
    hero: {
      eyebrow: "Web Application Development",
      title: "Software that fits",
      muted: "the way you work.",
      lead: "TWS provides web application development services for businesses whose workflows, data or rules don't fit standard software. Custom platforms, dashboards, booking systems — and the integrations that connect them.",
      footRight: "Custom platforms, dashboards, booking systems and integrations.",
      image: "web-applications",
    },
    statements: [
      { parts: ["It usually starts with", { text: "a spreadsheet.", serif: true }] },
      { parts: ["Then", { text: "a second one.", serif: true }] },
      { parts: ["Your team does", { text: "the rest by hand.", serif: true }] },
      { parts: ["Another tool", { text: "isn't always the answer.", serif: true }], white: true },
    ],
    build: {
      label: "What we build",
      text: "Four kinds of system. Many projects combine them.",
      images: ["web-applications", "startups-technology", "professional-services", "healthcare", "web-design", "studio-footer", "real-estate", "hospitality"],
      items: [
        {
          title: "Custom platforms",
          body: "Web applications built around a specific business model, workflow or set of rules — the ones no off-the-shelf product was designed for. Internal tools for your team, platforms for your customers, or both.",
        },
        {
          title: "Dashboards",
          body: "The numbers that matter, in one place, without someone compiling them every week. Built around the decisions people actually make, not every metric available.",
        },
        {
          title: "Booking systems",
          body: "Availability, schedules and reservations, plus the customer journey around them: confirming, changing and cancelling. Built around how your business actually takes bookings.",
        },
        {
          title: "Integrations & APIs",
          body: "Systems that share data instead of relying on people to copy it. Our API development services cover connecting the tools you already use and building APIs so your own systems can talk to each other. What's possible depends on the systems involved, so we check that early.",
        },
      ],
    },
    chapters: [
      {
        beforeBuild: true,
        eyebrow: "The problem",
        title: "When software",
        accent: "gets in the way",
        intro: [
          "It usually starts with a spreadsheet. Then a second one. Then a shared folder, three logins and a weekly meeting to reconcile them.",
          "Work gets copied from one tool to another. Information lives in several places, and none of them is quite right. The software you pay for does most of the job. Your team does the rest by hand.",
          "Another tool isn't always the answer. Sometimes the business needs a system built around how it actually works.",
        ],
      },
      {
        eyebrow: "Built around how your business works",
        title: "The software should fit the business.",
        accent: "Not the other way around.",
        intro: [
          "Every business runs on its own logic. Who does what. Who approves what. Which rules apply, and when. What data matters, and who should see it.",
          "Standard software asks you to adopt its version of that logic. Often that's fine. When it isn't, teams build workarounds — and the workarounds quietly become the real system.",
          "Custom web application development starts from the other end: the workflow first, then the software shaped around it. Roles, approval steps and customer journeys are designed in, not bolted on.",
        ],
      },
      {
        eyebrow: "Under the surface",
        title: "The systems behind",
        accent: "the interface",
        intro: ["The screens are the small part of a web application. What sits behind them decides whether it holds up."],
        variant: "rows",
        items: [
          { title: "Data", body: "Structured so it can be trusted, searched and reported on." },
          { title: "Access", body: "Different teams see the information they need, without exposing what they don't." },
          { title: "Sign-in and security", body: "Secure sign-in and sensible permissions from the start." },
          { title: "Integrations", body: "Clear connections to the systems around it, instead of manual exports." },
          { title: "Performance", body: "Fast enough that people prefer it to the spreadsheet it replaced." },
          { title: "Room to grow", body: "More users, more data and new features without starting over." },
          { title: "Maintainability", body: "Built so it can be changed later without breaking what already works." },
        ],
      },
      {
        eyebrow: "Is it worth it?",
        title: "When you need",
        accent: "custom software",
        intro: [
          "Custom software isn't always the right answer. An existing platform, set up well, is often faster and cheaper. We'll say so when it is.",
          "It becomes worth considering when:",
        ],
        variant: "rows",
        items: [
          { title: "The software expects a workflow your business doesn't follow." },
          { title: "Several tools need to behave like one system." },
          { title: "Your business rules are too specific to configure." },
          { title: "Teams rely on manual workarounds to fill the gaps." },
          { title: "Important data is split across places that don't talk to each other." },
          { title: "What you need doesn't exist as a product." },
        ],
        note: "That's when working with a custom software development company makes sense — as long as the decision comes from the requirement, not from the appeal of building something new.",
      },
      {
        id: "process",
        eyebrow: "How we work",
        title: "How the project takes shape",
        intro: [
          "Choosing a web application development company is also choosing how the work will run. Ours is simple.",
        ],
        variant: "steps",
        items: [
          { title: "Understand", body: "We map how the work really happens today, workarounds included." },
          { title: "Structure", body: "We define the data, roles and rules before designing a single screen." },
          { title: "Design", body: "We design the screens people use most, and check them against real tasks." },
          { title: "Build", body: "We develop and test in stages, so you see working software early." },
          {
            title: "Launch",
            body: "We roll out carefully, support the team through the change, and stay on hand afterwards.",
          },
        ],
      },
    ],
    work: {
      eyebrow: "Our work",
      title: "Selected work",
      picks: [
        { slug: "pen-foundation", label: "Interactive digital platform", link: "View the project", alt: "PEN Foundation platform on desktop and mobile" },
        { slug: "zeen", label: "Multi-tenant commerce platform", link: "How we built Zeen", alt: "Zeen platform interface" },
      ],
    },
    faqTitle: "Questions before starting",
    faqs: [
      {
        question: "How much does web application development cost?",
        answer:
          "The cost of web app development services depends on the number of users and roles, the workflows involved, integrations and any data to be migrated. We scope the work first, then give a project-specific estimate.",
      },
      {
        question: "How long does it take?",
        answer:
          "It depends on scope, integrations and how many workflows are involved. We agree the stages and timeline before development starts.",
      },
      {
        question: "Can you build software around our existing workflow?",
        answer:
          "Yes. That's where we start: how work actually happens today, including the spreadsheets and workarounds. The software is shaped around that, and simplifies it where the workflow itself can be simpler.",
      },
      {
        question: "Can you connect our existing systems?",
        answer: "Often, yes. It depends on what those systems allow, so we check that early — before committing to an approach.",
      },
      {
        question: "Do you build dashboards and booking systems?",
        answer:
          "Yes. Dashboards bring the information your team needs into one place. Booking systems handle availability, schedules and the customer journey around them. Both are built around how your business works, not a fixed template.",
      },
      {
        question: "Do you develop APIs?",
        answer: "Yes — to connect your systems with the services you already use, and to let your own applications share data.",
      },
    ],
    closing: {
      lead: "Building something your current",
      accent: "software can't handle?",
      note: "Start with a conversation about how the work happens today.",
    },
  },
  {
    id: "ecommerce",
    slug: "ecommerce",
    name: "E-commerce Development",
    meta: {
      documentTitle: "E-commerce Development Company | TWS - TheWebStudio",
      description:
        "An ecommerce development company building online stores, headless storefronts and checkouts - and migrating existing stores without losing what they've earned.",
    },
    hero: {
      eyebrow: "E-commerce Development",
      title: "We build online stores",
      muted: "that scale.",
      lead: "TWS is an ecommerce development company for businesses that sell online. We build online stores, headless storefronts and checkouts — and migrate stores that have outgrown their platform.",
      footRight: "Online stores, headless storefronts, checkouts and store migrations.",
      image: "ecommerce",
    },
    statements: [
      { parts: ["Your store has", { text: "a job to do.", serif: true }] },
      { parts: ["An online store", { text: "isn't a catalogue.", serif: true }] },
      { parts: ["It's part of", { text: "how the business earns.", serif: true }] },
      { parts: ["Stores built to sell,", { text: "not just display.", serif: true }], white: true },
    ],
    build: {
      label: "What we build",
      text: "Four areas of e-commerce work. Most projects involve more than one.",
      images: ["ecommerce-crop", "ecommerce", "web-design", "hospitality", "real-estate", "studio-footer", "startups-technology", "professional-services"],
      items: [
        {
          title: "Online stores",
          body: "New stores, built around your products and how your customers buy. Catalogue, product pages, search and checkout are planned as one system, not assembled from parts.",
        },
        {
          title: "Headless commerce",
          body: "The storefront, separated from the commerce engine. The platform runs products, orders and payments; a custom front end handles everything customers see. More control over design and speed — worth it when a standard storefront is holding the business back.",
        },
        {
          title: "Checkout experience",
          body: "The last few screens are where hesitation costs the most. We build checkouts that ask for less and work properly on a phone — for new stores or existing ones.",
        },
        {
          title: "Store migrations",
          body: "Moving to a new platform without losing what the current store has earned. Products, customers, URLs and search visibility are planned for before anything moves.",
        },
      ],
    },
    chapters: [
      {
        beforeBuild: true,
        eyebrow: "The business behind the store",
        title: "Your store has",
        accent: "a job to do.",
        intro: [
          "An online store isn't a catalogue. It's where someone who has never met you decides whether to trust you with their money.",
          "It has to make products easy to find, easy to understand and easy to choose between. Then it has to get out of the way.",
          "Every unclear product page is a sale that quietly didn't happen. The store isn't a layer on top of the business. It's part of how the business earns.",
        ],
      },
      {
        eyebrow: "The customer's path",
        title: "The experience between",
        accent: "product and purchase",
        intro: ["Good ecommerce web development starts with the customer's path, not a feature list."],
        variant: "steps",
        items: [
          {
            title: "Discover",
            body: "People often land on a product page, not your homepage. Navigation has to make sense from wherever they arrive.",
          },
          { title: "Explore", body: "Search that understands what people type. Filters that match how they actually choose." },
          {
            title: "Evaluate",
            body: "The product page does the selling: clear images, the details that matter, straight answers on delivery and returns.",
          },
          { title: "Purchase", body: "Cart and checkout: fewer steps, no surprises, nothing the order doesn't need." },
        ],
        note: "Much of this happens on a phone, so every stage has to work there.",
      },
      {
        eyebrow: "Built around the business",
        title: "The technology should fit the business.",
        accent: "Not the other way around.",
        intro: [
          "No two e-commerce businesses sell the same way. Products, customers, buying journeys and business rules all differ.",
          "A standard store handles the common case well. When a business isn't the common case, the template starts to push back.",
          "That's where custom ecommerce development earns its place. Sometimes the answer is a custom or headless build; sometimes it's an established platform, set up well. The business decides, not our preference.",
        ],
      },
      {
        eyebrow: "The baseline",
        title: "The technical foundation",
        intro: ["These are basic standards a modern store should meet."],
        variant: "rows",
        items: [
          { title: "Mobile", body: "Works properly on a phone, not just fits on one." },
          { title: "Speed", body: "Pages and images that load quickly." },
          { title: "Search visibility", body: "Clean URLs, well-structured pages, proper metadata." },
          { title: "Accessibility", body: "Usable with a keyboard or screen reader." },
          { title: "Room to grow", body: "More products and traffic without starting over." },
          { title: "Maintainability", body: "Easy to work with long after launch." },
        ],
      },
      {
        eyebrow: "Existing stores",
        title: "When the existing store",
        accent: "isn't working",
        intro: [
          "Sometimes the store exists, but something isn't right. Products are hard to find. Pages are slow. Checkout fails on mobile. The design has aged, or the platform has become the limit.",
          "We look at what's actually happening first: how the store is structured, where people drop off, and what the platform allows.",
          "Then we recommend the smallest change that solves the problem. Sometimes that's focused work on navigation, product pages or checkout. Sometimes it's a migration.",
        ],
      },
      {
        id: "process",
        eyebrow: "How we work",
        title: "How the project takes shape",
        intro: ["The project shouldn't feel like a black box."],
        variant: "steps",
        items: [
          { title: "Understand", body: "How you sell, who buys, and what gets in their way." },
          { title: "Structure", body: "Catalogue, navigation and buying journeys, planned before any design." },
          { title: "Design", body: "The pages that sell first: category, product, cart and checkout." },
          { title: "Build", body: "Developed and tested across devices, browsers and test orders." },
          { title: "Launch", body: "Live carefully, checked, and supported afterwards." },
        ],
      },
    ],
    work: {
      eyebrow: "Our work",
      title: "Selected",
      accent: "e-commerce work",
      picks: [{ slug: "zeen", label: "E-commerce platform", link: "How we built Zeen", alt: "Zeen platform interface" }],
    },
    faqTitle: "Questions answered",
    faqs: [
      {
        question: "How much does e-commerce development cost?",
        answer:
          "The cost of ecommerce development services depends on catalogue size, custom functionality, integrations and content. We scope the work first, then give a project-specific estimate.",
      },
      {
        question: "How long does an e-commerce project take?",
        answer: "It depends on scope, catalogue size and integrations. We agree the stages and timeline before development starts.",
      },
      {
        question: "Do you build custom e-commerce websites?",
        answer:
          "Yes, when the business needs one. Often an established platform, set up well, is the right answer. When it isn't, we build what's needed — including headless storefronts.",
      },
      {
        question: "Can you work on our existing store?",
        answer:
          "Yes. We review how it's structured and where it loses customers, then recommend focused fixes, a checkout rework or a rebuild.",
      },
      {
        question: "What is headless commerce, and do we need it?",
        answer:
          "It separates the storefront from the platform that runs products, orders and payments. It gives more control over design and speed, and adds complexity — so it's worth it only when a standard storefront is holding you back. We'll tell you plainly which applies.",
      },
      {
        question: "Do you work with businesses in Kerala and across India?",
        answer:
          "Yes. TWS is an ecommerce website development company in Kerala, based in Kozhikode (Calicut). For businesses looking for an ecommerce website development company in India, projects run remotely with regular calls and clear review points.",
      },
    ],
    closing: {
      lead: "Have an e-commerce",
      accent: "project in mind?",
      note: "A new store, a slow checkout, or a platform you've outgrown. Start with a conversation.",
    },
  },
];

export const servicePage = (slug: string) => SERVICE_PAGES.find((page) => page.slug === slug);
