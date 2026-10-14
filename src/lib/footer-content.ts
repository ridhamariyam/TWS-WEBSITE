import type { FooterColumn } from "@/types/content";
import {
  aboutHref,
  CONTACT_EMAIL,
  ROUTES,
  serviceHref,
} from "@/lib/site-links";

/**
 * The studio's social profiles, shared by the footer, the question section and
 * /contact. Add a profile only once its URL is confirmed — a wrong guess here
 * links to another company. The Instagram URL is still unverified.
 */
export type SocialProfile = { name: "Instagram" | "LinkedIn"; href: string };

export const SOCIAL_PROFILES: SocialProfile[] = [
  { name: "Instagram", href: "https://www.instagram.com/thewebstudio.agency" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/thewebstudioagency" },
];

/**
 * Footer link columns. Four groups fill exactly one row at >=1020px; below
 * 744px each collapses into an accordion, in this order.
 */
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Services",
    links: [
      { label: "Web Design & Development", href: serviceHref("web-design") },
      { label: "Web Applications", href: serviceHref("web-applications") },
      { label: "E-Commerce", href: serviceHref("ecommerce") },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "The Studio", href: ROUTES.about },
      { label: "How We Work", href: aboutHref("process") },
      { label: "Our POV", href: aboutHref("pov") },
    ],
  },
  {
    heading: "Reach out",
    links: [
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      { label: "Start a project", href: ROUTES.startProject },
      { label: "Calicut · Kerala · India", href: ROUTES.contact },
    ],
  },
  {
    heading: "Follow",
    links: SOCIAL_PROFILES.map(({ name, href }) => ({ label: name, href })),
  },
];
