import type { Metadata } from "next";
import { FlowPage } from "@/components/flow/flow-page";
import { FlowPreloader } from "@/components/flow/flow-preloader";
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
 *   job      the hero: the intro's film, full screen, shrinking straight
 *            into the three kinds of job we build for (the service ring);
 *   found    "Beyond ordinary" — people decide online now;
 *   trusted  everything online evolved, most websites didn't, so we
 *            rethought them: websites, web applications and e-commerce
 *            (the manifesto);
 *   how      four stages, no mystery (the bento run);
 *   who      the industries fly past and gather into "beyond ordinary"
 *            again, the refrain;
 *   invite   thewebstudio. Start a project.
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
      <FlowPreloader line="Strategy, design and engineering under one roof." />
      <HeroStage />
      <ParticleDive />
      <Manifesto />
      <StudioScenes />
      <FlowOutro
        cards={INDUSTRY_ITEMS}
        cardsTitle="Made for businesses like yours"
        note="Tell us what your website needs to do. We'll take it from there."
      />
    </FlowPage>
  );
}
