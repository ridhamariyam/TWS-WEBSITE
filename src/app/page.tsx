import type { Metadata } from "next";
import { FlowPage } from "@/components/flow/flow-page";
import { HeroStage } from "@/components/flow/hero-stage";
import { ParticleDive } from "@/components/flow/particle-dive";
import { StudioScenes } from "@/components/flow/studio-scenes";
import { Manifesto } from "@/components/flow/manifesto";
import { INDUSTRY_ITEMS } from "@/components/flow/depth-gallery";
import { FlowOutro } from "@/components/flow/flow-outro";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";

/**
 * The homepage, told as the visitor's journey in pinned stages, each leading
 * into the next:
 *
 *   job      the hero: the studio film, drawn in code;
 *   found    "Beyond ordinary" — people decide online now;
 *   trusted  everything online evolved, most websites didn't, so we
 *            rethought them: websites, web applications and e-commerce
 *            (the manifesto);
 *   how      four stages, no mystery (the bento run);
 *   who      the industries fly past and gather into "beyond ordinary"
 *            again, the refrain, and the footer follows.
 *
 * Native scrolling throughout; each stage reads its own scroll progress.
 */
export const metadata: Metadata = pageMetadata({
  title: "Web Design, Development & Digital Experiences",
  documentTitle: "TWS — Web Design, Development & Digital Experiences",
  description:
    "TWS is a digital studio in Calicut building websites, e-commerce stores and web applications for businesses that need their site to do a job.",
  path: "/",
});

export default function Home() {
  return (
    <FlowPage>
      {/* The studio and the site, for search engines. See organizationJsonLd. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
      />
      <HeroStage />
      <ParticleDive />
      <Manifesto />
      <StudioScenes />
      <FlowOutro
        cards={INDUSTRY_ITEMS}
        cardsTitle="Made for businesses like yours"
        cta={null}
      />
    </FlowPage>
  );
}
