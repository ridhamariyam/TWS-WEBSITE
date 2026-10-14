import type { ServiceId } from "@/lib/services-content";
import { INDUSTRIES, SERVICES } from "@/lib/services-content";
import {
  aboutHref,
  industryHref,
  ROUTES,
  serviceHref,
} from "@/lib/site-links";

/**
 * The header's three menus: Services, Industries, Studio.
 *
 * The menu is curated rather than a mirror of services-content.ts — it offers
 * the three capabilities and four sectors the studio leads with, not
 * everything /services covers. Headings, labels and hrefs still come from that
 * file, so a menu item cannot point at a section that does not exist, and a
 * renamed offering fails the build here rather than quietly disappearing.
 *
 * Labels are source-cased; `.type-eyebrow` uppercases them in CSS.
 */

/** The capabilities the menu leads with, and which offerings each one shows. */
const MENU_SERVICES: Array<{ id: ServiceId; offerings: string[] }> = [
  {
    id: "web-design",
    offerings: [
      "Business Websites",
      "Brand & Launch Sites",
      "Website Redesign",
      "Performance & Core Web Vitals",
    ],
  },
  {
    id: "web-applications",
    offerings: [
      "Custom Platforms",
      "Dashboards",
      "Booking Systems",
      "Integrations & APIs",
    ],
  },
  {
    id: "ecommerce",
    offerings: [
      "Online Stores",
      "Headless Commerce",
      "Checkout Experience",
      "Store Migrations",
    ],
  },
];

/** The sectors the menu leads with. */
const MENU_INDUSTRIES = [
  "real-estate",
  "hospitality",
  "professional-services",
  "startups-technology",
];

export const SERVICES_MENU = MENU_SERVICES.map(({ id, offerings }) => {
  const service = SERVICES.find((entry) => entry.id === id);
  if (!service) throw new Error(`Menu names a service that does not exist: ${id}`);

  return {
    heading: service.menuHeading,
    links: offerings.map((label) => {
      const offering = service.offerings.find((entry) => entry.label === label);
      if (!offering) {
        throw new Error(`Menu names an offering ${service.id} does not have: ${label}`);
      }
      return {
        label: offering.label,
        href: serviceHref(id),
        description: offering.description,
      };
    }),
  };
});

/** One entry per sector. No focus areas: the menu lists destinations only. */
export const INDUSTRIES_MENU = MENU_INDUSTRIES.map((id) => {
  const industry = INDUSTRIES.find((entry) => entry.id === id);
  if (!industry) throw new Error(`Menu names a sector that does not exist: ${id}`);

  return {
    heading: industry.name,
    href: industryHref(),
    blurb: industry.blurb,
  };
});

export const STUDIO_MENU = [
  {
    label: "The Studio",
    href: ROUTES.about,
    description: "Small by design. Focused by choice.",
  },
  {
    label: "How We Work",
    href: aboutHref("process"),
    description: "Think. Design. Build. Grow.",
  },
];

export const GET_STARTED_HREF = ROUTES.startProject;
