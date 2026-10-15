import type { Metadata } from "next";
import { FAQ_ENTRIES } from "@/lib/faq-content";
import { PROJECTS } from "@/lib/work-content";
import { SOCIAL_PROFILES } from "@/lib/social-profiles";
import { CONTACT_EMAIL, CONTACT_PHONE, ROUTES } from "@/lib/site-links";
import { STUDIO_LOCATION } from "@/lib/studio-content";

/**
 * Metadata of the same shape on every route.
 *
 * Next does not carry a page's title and description into Open Graph, so
 * without this every page shares as the homepage. Building the whole set from
 * one title and description is what stops a route keeping the default card.
 */

export const SITE_URL = "https://thewebstudio.agency";
const SITE_NAME = "TWS — The Web Studio";

/** 1200x630, the size both Open Graph and X read as a large card. */
const OG_IMAGE = {
  url: "/seo/og-image.png",
  width: 1200,
  height: 630,
  alt: "TWS — The Web Studio",
} as const;

export function pageMetadata({
  title,
  documentTitle,
  description,
  path,
  ogTitle,
  ogDescription,
}: {
  /** The page's own title, without the site suffix. */
  title: string;
  /**
   * The whole `<title>`, for the home page only: it sits beside the root
   * layout rather than under it, so its `title` replaces `title.template`
   * instead of feeding it and the " — TWS" suffix never appears.
   */
  documentTitle?: string;
  description: string;
  /** Route path, leading slash, no trailing slash except the root. */
  path: string;
  /** Titles and descriptions for link previews, where they differ from the page's. */
  ogTitle?: string;
  ogDescription?: string;
}): Metadata {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  const shared = ogTitle ?? documentTitle ?? `${title} — TWS`;
  const shareDescription = ogDescription ?? description;
  return {
    title: documentTitle ?? title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: shared,
      description: shareDescription,
      url,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shared,
      description: shareDescription,
      images: [OG_IMAGE.url],
    },
  };
}

/**
 * Structured data for the studio and the site.
 *
 * Deliberately thin: no `aggregateRating`, `review` or `award`, because the
 * studio has none. Every field here is a fact or a description of the site.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: "TWS",
        url: SITE_URL,
        email: CONTACT_EMAIL,
        telephone: CONTACT_PHONE,
        foundingDate: "2026",
        description:
          "A digital studio that designs and builds websites, e-commerce stores and web applications.",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/seo/icon-512.png`,
          width: 512,
          height: 512,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Calicut",
          addressRegion: "Kerala",
          addressCountry: "IN",
        },
        // The profiles the footer links, so the two cannot disagree.
        sameAs: SOCIAL_PROFILES.map((profile) => profile.href),
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: STUDIO_LOCATION,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

/** One project as a CreativeWork the studio made, not a product. */
export function projectJsonLd(slug: string) {
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.name,
    description: project.summary,
    url: `${SITE_URL}${ROUTES.work}/${project.slug}`,
    creator: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
    /* "In build" is the truth about both projects today. */
    creativeWorkStatus: project.status,
  };
}

/**
 * The questions and answers on /faq, as an FAQPage.
 *
 * Answers are runs of text and links; the schema takes plain text, so each
 * link contributes its label and the paragraphs are joined. Every answer is
 * the one on the page — this states nothing the page does not.
 */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${ROUTES.faq}#faq`,
    inLanguage: "en",
    mainEntity: FAQ_ENTRIES.map((entry) => ({
      "@type": "Question",
      "@id": `${SITE_URL}${ROUTES.faq}#${entry.id}`,
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer
          .map((paragraph) =>
            paragraph
              .map((run) => (typeof run === "string" ? run : run.label))
              .join(""),
          )
          .join("\n\n"),
      },
    })),
  };
}

/** A page's own questions and answers, as an FAQPage. Plain text, as shown on the page. */
export function pageFaqJsonLd(path: string, faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${path}#faq`,
    inLanguage: "en",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Where a page sits, as a BreadcrumbList: each crumb a name and a route path. */
export function breadcrumbJsonLd(crumbs: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.path === "/" ? SITE_URL : `${SITE_URL}${crumb.path}`,
    })),
  };
}
