/**
 * The content of /services, and the source for the header's Services and
 * Industries menus (see nav-content.ts) — so no menu item can point at a
 * section this page does not have.
 */

export type ServiceId = "web-design" | "ecommerce" | "web-applications";

export type Service = {
  /** The section's anchor on /services. */
  id: ServiceId;
  name: string;
  /** The column heading this service gets in the header's Services menu. */
  menuHeading: string;
  title: string;
  body: string;
  offerings: Array<{ label: string; description?: string }>;
};

export const SERVICES: Service[] = [
  {
    id: "web-design",
    name: "Web Design & Development",
    menuHeading: "Web Design & Development",
    title: "First impressions, built properly",
    body: "Custom websites designed around your business, your audience and what you need people to do next. Fast. Responsive. Built properly.",
    offerings: [
      { label: "Business Websites" },
      { label: "Brand & Launch Sites" },
      { label: "Website Redesign" },
      { label: "Content Platforms" },
      { label: "Performance & Core Web Vitals" },
      { label: "Accessibility" },
    ],
  },
  {
    id: "web-applications",
    name: "Web Applications",
    menuHeading: "Web Applications",
    title: "Software that fits the way you work",
    body: "Custom web applications, platforms, portals and business tools built around real workflows. No template gymnastics.",
    offerings: [
      { label: "Custom Platforms" },
      { label: "Client Portals" },
      { label: "Dashboards" },
      { label: "Booking Systems" },
      { label: "Internal Tools" },
      { label: "Integrations & APIs" },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    menuHeading: "E-Commerce",
    title: "Built to sell, not just look pretty",
    body: "From product discovery to checkout, we design e-commerce experiences around how people actually buy. Less friction. Better journeys. More room to grow.",
    offerings: [
      { label: "Online Stores" },
      { label: "Product Discovery" },
      { label: "Checkout Experience" },
      { label: "Headless Commerce" },
      { label: "Subscriptions" },
      { label: "Store Migrations" },
    ],
  },
];

export type Industry = {
  /** Anchored on /services as `for-<id>` — see `industryAnchor`. */
  id: string;
  name: string;
  blurb: string;
  focus: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    blurb: "Property is personal. Build confidence before the first viewing.",
    focus: [
      "Developers",
      "Brokerages",
      "Project Launches",
      "Villas & Resorts",
      "Commercial Spaces",
      "Listing Platforms",
    ],
  },
  {
    id: "hospitality",
    name: "Hospitality",
    blurb: "Sell the feeling before the stay.",
    focus: [
      "Hotels & Resorts",
      "Restaurants & Cafés",
      "Homestays",
      "Event Venues",
      "Travel Experiences",
      "Booking Journeys",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    blurb: "Trust starts early — long before the first appointment.",
    focus: [
      "Hospitals",
      "Clinics & Practices",
      "Dental & Specialty",
      "Diagnostics",
      "Wellness Centres",
      "Patient Portals",
    ],
  },
  {
    id: "professional-services",
    name: "Professional Services",
    blurb: "Your expertise needs proof. Make your digital presence carry its weight.",
    focus: [
      "Law Firms",
      "Consultants",
      "Financial Services",
      "Architecture & Interiors",
      "Agencies",
      "B2B Services",
    ],
  },
  {
    id: "startups-technology",
    name: "Startups & Technology",
    blurb: "Look like where you're going, not where you started.",
    focus: [
      "SaaS Platforms",
      "Product Launches",
      "Fundraising Sites",
      "Marketplaces",
      "Fintech",
      "Developer Tools",
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    blurb: "Every click counts. Remove the friction between discovery and checkout.",
    focus: [
      "D2C Brands",
      "Fashion & Apparel",
      "Home & Lifestyle",
      "Food & Beverage",
      "Jewellery",
      "Subscription Products",
    ],
  },
];
