import type { Metadata } from "next";
import { PageShell } from "@/components/layout/page-shell";
import { PortfolioView, type PortfolioItem } from "@/components/portfolio/portfolio-view";
import { ROUTES, workHref } from "@/lib/site-links";
import { PROJECTS } from "@/lib/work-content";
import { fallbackSrc, srcSet } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description:
    "The work of TWS — The Web Studio, one project at a time: a product site with a 3D model viewer, and a multi-tenant commerce platform. Both in build.",
  path: ROUTES.portfolio,
});

/*
 * The portfolio: the same projects as /work, shown full screen, one at a
 * time. Every project here is real and links to its case study.
 */

const PROJECT_ITEMS: PortfolioItem[] = PROJECTS.map((project) => ({
  key: project.slug,
  title: project.name,
  role: project.category,
  href: project.detail ? workHref(project.slug) : undefined,
  src: fallbackSrc(project.image),
  srcSet: srcSet(project.image),
  alt: `Screens from the ${project.name} project`,
}));

export default function PortfolioPage() {
  return (
    <PageShell>
      <h1 className="sr-only">Portfolio</h1>
      <PortfolioView items={PROJECT_ITEMS} />
    </PageShell>
  );
}
