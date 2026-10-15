/**
 * Shared service and industry content for the flow pages and navigation.
 */

export type ServiceId = "web-design" | "ecommerce" | "web-applications";

export type Service = {
  /** Stable ID used by service links and the homepage's service ring. */
  id: ServiceId;
  name: string;
  title: string;
  offering: string;
};

export const SERVICES: Service[] = [
  {
    id: "web-design",
    name: "Web Design & Development",
    title: "First impressions, built properly",
    offering: "Business Websites",
  },
  {
    id: "web-applications",
    name: "Web Applications",
    title: "Software that fits the way you work",
    offering: "Custom Platforms",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    title: "Built to sell, not just look pretty",
    offering: "Online Stores",
  },
];

type Industry = {
  /** Stable ID for the industry's colour swatch and card key. */
  id: string;
  name: string;
  blurb: string;
};

export const INDUSTRIES: Industry[] = [
  {
    id: "real-estate",
    name: "Real Estate",
    blurb: "Property is personal. Build confidence before the first viewing.",
  },
  {
    id: "hospitality",
    name: "Hospitality",
    blurb: "Sell the feeling before the stay.",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    blurb: "Trust starts early — long before the first appointment.",
  },
  {
    id: "professional-services",
    name: "Professional Services",
    blurb: "Your expertise needs proof. Make your digital presence carry its weight.",
  },
  {
    id: "startups-technology",
    name: "Startups & Technology",
    blurb: "Look like where you're going, not where you started.",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    blurb: "Every click counts. Remove the friction between discovery and checkout.",
  },
];
