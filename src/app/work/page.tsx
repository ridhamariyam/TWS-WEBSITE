import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { WorksGridSection } from "@/components/sections/works-grid-section";
import { PROJECTS } from "@/lib/work-content";

export const metadata: Metadata = pageMetadata({
  title: "Things we\'ve built",
  description:
    "The first builds from TWS — The Web Studio: a product site with a 3D model viewer, and a multi-tenant commerce platform. Both in progress.",
  path: "/work",
});

/*
 * "What has TWS actually built?" — the page's intro, then the work as the
 * grid after artistudyo.com's "see all works" section: square tiles, then
 * wide ones, each crossfading to a film of the real build on hover, and the
 * open slots marked "Coming soon". The homepage shows the same work as the
 * projects strip; this is where it is laid out in full.
 *
 * Two projects, both in build, described by what is actually in their
 * repositories — no clients claimed, no results quoted. See the rule at the
 * top of work-content.ts.
 */
export default function WorkPage() {
  return (
    <PageShell>
      <PageIntro eyebrow={`Work / ${String(PROJECTS.length).padStart(2, "0")}`} title="Things we’ve built.">
        TWS opened in 2026, so this is a short list and an honest one: what
        we&rsquo;ve built, what it&rsquo;s built with, and where it stands. When
        a project launches and there is a result worth reporting, it will be
        reported here.
      </PageIntro>

      <WorksGridSection heading={false} more={false} />

    </PageShell>
  );
}
