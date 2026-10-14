import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/site-links";
import { SITE_URL } from "@/lib/seo";

/**
 * The live pages only. Work, portfolio, blogs and the FAQ are hidden for now
 * (they redirect home; see next.config.ts), so they are left out. Before
 * launch only the holding page at `/` is live.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  if (process.env.SITE_LAUNCHED !== "true") {
    return [{ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1, lastModified }];
  }
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}${ROUTES.services}`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${SITE_URL}${ROUTES.about}`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}${ROUTES.contact}`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}${ROUTES.startProject}`, changeFrequency: "yearly", priority: 0.6 },
  ];

  return pages.map((entry) => ({ ...entry, lastModified }));
}
