/**
 * The projects shown on /work, on their own pages and on the homepage.
 *
 * The rule for this file: if it is not in the repository, it does not go on
 * the page. Both projects are still in build, so there are no testimonials,
 * metrics or outcomes — add an `outcome` chapter when one is true.
 */

export type Chapter = {
  title: string;
  body: string;
  /** Rendered under the prose, for chapters that are an inventory. */
  list?: string[];
};

export type Project = {
  slug: string;
  name: string;
  /** What this is. Never "case study", never a client claim. */
  label: string;
  category: string;
  /** Where it honestly stands today. */
  status: string;
  summary: string;
  /** Basename in the image manifest; see src/lib/images.ts. */
  image: string;
  /**
   * Further screens for the project page, as image-manifest ids, laid out in
   * pairs between the chapters. Real screens of this project only; leave it
   * out rather than reuse the hero or borrow another project's art.
   */
  gallery?: string[];
  /** Present when there is enough real material for a page of its own. */
  detail?: {
    lead: string;
    chapters: Chapter[];
    stack: string[];
  };
};

export const PROJECTS: Project[] = [
  {
    slug: "pen-foundation",
    name: "PEN Foundation",
    label: "Product site",
    category: "Web design & development",
    status: "In build",
    summary:
      "A product site for a pre-engineered foundation system, built around a 3D model viewer rather than a brochure.",
    image: "pen-foundation",
    detail: {
      lead: "A site for the PEN (Pre-Engineered Nail) Foundation system — an engineering product that is difficult to photograph and easy to misunderstand.",
      chapters: [
        {
          title: "Context",
          body: "PEN Foundation is a pre-engineered nail foundation system. The product is structural: what matters about it is how it works underground, which is exactly the part a photograph cannot show. The site had to carry engineering, research and completed projects alongside the usual pages a company needs.",
        },
        {
          title: "Objective",
          body: "Make the system understandable to someone deciding whether to specify it. That meant treating the technology page as the centre of the site rather than an afterthought, and giving the engineering and research material room of its own instead of flattening it into a single services page.",
        },
        {
          title: "Approach",
          body: "One route per subject, each backed by its own component tree, so a section can grow without the rest of the site being rebuilt around it. Projects and research are collections with their own detail pages, so the library can be added to over time. The hero is a scroll-scrubbed film, re-encoded specifically so it can be scrubbed smoothly rather than merely played.",
        },
        {
          title: "What we built",
          body: "A full product site in the Next.js App Router, with:",
          list: [
            "A technology page carrying an interactive 3D model viewer and the system's spec sheet",
            "Engineering and research sections, research as a collection with per-article pages",
            "A projects collection with a detail page per project",
            "A gallery, a resources section, and about and contact pages",
            "A scroll-scrubbed hero film, re-encoded for frame-accurate scrubbing",
          ],
        },
        {
          title: "Technical detail",
          body: "The 3D viewer runs on React Three Fiber with drei helpers, so the model is a React tree rather than an imperative scene — the same component model as the rest of the site. Motion is Framer Motion, and the design tokens are CSS-first Tailwind v4 `@theme` variables, so the palette and type scale live in one stylesheet rather than in a JavaScript config.",
        },
      ],
      stack: [
        "Next.js (App Router)",
        "TypeScript",
        "React Three Fiber + drei",
        "Framer Motion",
        "Tailwind CSS v4",
      ],
    },
  },
  {
    slug: "zeen",
    name: "ZEEN",
    label: "Commerce platform",
    category: "E-commerce & web applications",
    status: "In build",
    summary:
      "A fashion storefront, and the multi-tenant commerce platform underneath it — catalogue to checkout to fulfilment, plus the admin to run it.",
    image: "zeen",
    detail: {
      lead: "A storefront for a fashion label, built on a commerce platform this studio wrote from scratch — multi-tenant from the first commit, so it can carry more than one store.",
      chapters: [
        {
          title: "Context",
          body: "A clothing brand needs more than a catalogue: it needs the whole path from a product page to a paid order, and somewhere to run the shop from once orders start arriving. Hosted platforms cover that, at the cost of owning none of it.",
        },
        {
          title: "Objective",
          body: "Build the commerce system as a product rather than as one store. Every model carries a tenant, domains resolve to tenants, and the seed brings a store up from nothing — so the second store costs a configuration, not a rebuild.",
        },
        {
          title: "Approach",
          body: "An API-first backend with the storefront and the admin as separate route groups against it. The domain is split into modules that match how a shop actually works — catalogue, cart, orders, payments, pricing, coupons — rather than into generic CRUD layers, so the parts that carry business rules are the parts that are easiest to find.",
        },
        {
          title: "What we built",
          body: "A working commerce system, end to end:",
          list: [
            "Catalogue with categories, products, variants and inventory",
            "Cart, checkout, payments, orders, invoices and order history",
            "Pricing, tax and shipping rules, and coupons",
            "Customer accounts, addresses, wishlists and ratings",
            "Search and filtering across the catalogue",
            "An admin dashboard for running the store",
            "Multi-tenancy: tenants, tenant domains, and a seed that stands a new store up",
          ],
        },
        {
          title: "Technical detail",
          body: "FastAPI with async SQLAlchemy on PostgreSQL, and Redis for caching and rate limiting. Schema changes go through Alembic, and the build gate runs compilation, ruff, a migration-drift check and the test suite together — so a migration that does not match the models fails the build rather than production. The whole stack comes up under Docker Compose with one command.",
        },
      ],
      stack: [
        "FastAPI",
        "PostgreSQL + async SQLAlchemy",
        "Redis",
        "Alembic",
        "Next.js",
        "Docker Compose",
      ],
    },
  },
];

export const projectBySlug = (slug: string) =>
  PROJECTS.find((project) => project.slug === slug);
