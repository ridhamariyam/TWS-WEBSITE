import type { ServiceId } from "@/lib/services-content";

/**
 * Every internal destination the site links to. The top-level pages, the
 * enquiry form under /contact, and a page per project; anything narrower is an
 * anchor on the page covering it, so no link can point at a route that does
 * not exist.
 */

export const ROUTES = {
  home: "/",
  work: "/work",
  /** The full-screen project viewer. */
  portfolio: "/portfolio",
  services: "/services",
  about: "/about",
  /** The hub: how to reach the studio, and the two ways in. */
  contact: "/contact",
  /** The enquiry form itself, which every "Start a project" points at. */
  startProject: "/contact/start-a-project",
  blogs: "/blogs",
  faq: "/faq",
} as const;

/** One project's own page. */
export const workHref = (slug: string) => `${ROUTES.work}/${slug}`;

/** The sections of /about that the navigation points into. */
export type AboutAnchor = "process" | "pov";

export const aboutHref = (anchor: AboutAnchor) => `${ROUTES.about}#${anchor}`;

/** Each capability's own page, under /services. */
export const SERVICE_SLUGS: Record<ServiceId, string> = {
  "web-design": "web-development",
  ecommerce: "ecommerce",
  "web-applications": "web-applications",
};

export const serviceHref = (id: ServiceId) => `${ROUTES.services}/${SERVICE_SLUGS[id]}`;

/*
 * The sectors fly past together in /services#industries; there is no section
 * per sector, so every sector link lands there.
 */
export const industryHref = () => `${ROUTES.services}#industries`;

export const CONTACT_EMAIL = "thewebstudioagency@gmail.com";

/** The studio's number, as a person would write it. */
export const CONTACT_PHONE = "+91 73567 58078";

/*
 * The same number with nothing but digits, which is what `tel:` and wa.me
 * want. Derived rather than typed twice, so the two cannot disagree.
 */
const CONTACT_PHONE_DIGITS = CONTACT_PHONE.replace(/\D/g, "");

export const CONTACT_TEL = `tel:+${CONTACT_PHONE_DIGITS}`;
export const WHATSAPP_ENQUIRY_MESSAGE = [
  "Hi TWS! I'd like to enquire about a project.",
  "",
  "Name:",
  "Business / organisation:",
  "What I need (website / online store / web application):",
  "Project details:",
  "Preferred timeline:",
  "Budget range (optional):",
].join("\n");

export const CONTACT_WHATSAPP = `https://wa.me/${CONTACT_PHONE_DIGITS}?text=${encodeURIComponent(WHATSAPP_ENQUIRY_MESSAGE)}`;

/**
 * Opens an email with nothing to fill in but the question.
 *
 * The counterpart to the enquiry form: /contact offers both, and this is the
 * one for someone who has not got a brief yet.
 */
export const MESSAGE_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "A question for TWS",
)}&body=${encodeURIComponent(["Hi TWS,", "", ""].join("\n"))}`;

export const JOIN_TEAM_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Join the TWS team",
)}&body=${encodeURIComponent([
  "Hi TWS,",
  "",
  "Name:",
  "What I do:",
  "Portfolio / CV link:",
  "How I'd like to contribute:",
].join("\n"))}`;

export const PARTNER_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Partnership enquiry",
)}&body=${encodeURIComponent([
  "Hi TWS,",
  "",
  "Name:",
  "Business / organisation:",
  "Website:",
  "Partnership idea:",
].join("\n"))}`;

/** Opens a new email with the questions that make a first reply useful. */
export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "New project",
)}&body=${encodeURIComponent(
  [
    "Hi TWS,",
    "",
    "About us:",
    "What we need (website / store / web application / not sure yet):",
    "Timing:",
    "Current site, if there is one:",
    "",
  ].join("\n"),
)}`;

/** Internal paths go through next/link; mailto:, external and `#` links do not. */
export function isInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}
