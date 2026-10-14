import type { Metadata } from "next";
import { FlowChapter } from "@/components/flow/flow-chapter";
import { FlowOutro } from "@/components/flow/flow-outro";
import { FlowPage } from "@/components/flow/flow-page";
import { PageHero } from "@/components/flow/page-hero";
import { scenesFromItems } from "@/components/flow/scenes";
import { StudioScenes } from "@/components/flow/studio-scenes";
import { PROCESS_STEPS } from "@/lib/process-content";
import { pageMetadata } from "@/lib/seo";
import { SERVICE_PAGES } from "@/lib/service-pages";
import { INDUSTRIES } from "@/lib/services-content";
import { ROUTES, serviceHref } from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Web design and development, e-commerce and web applications — strategy, design and engineering under one studio — and the industries TWS builds them for.",
  path: ROUTES.services,
});

/*
 * "What exactly can TWS do for my business?" On the homepage's flow: the three services as bento scenes that lead into
 * their own pages, what the client is left holding, how the work runs, and
 * the sectors flying past in depth.
 */

/* Every line here is a promise the FAQ and the process already make. */
const WHAT_YOU_GET = [
  {
    title: "Yours, outright",
    body: "The code, the content, the domain and the accounts — in your name, not ours, on final payment.",
  },
  { title: "Work you can see", body: "You see the work as it goes, not at a single reveal at the end." },
  {
    title: "Built properly",
    body: "Performance, responsiveness and accessibility treated as part of the design.",
  },
  {
    title: "Someone after launch",
    body: "We measure what people do and improve from there — and stay on for updates if you want.",
  },
];

/* The four stages, as /about tells them. */
const STAGES = PROCESS_STEPS.map((step) => ({
  title: step.heading.split(" — ")[1] ?? step.heading,
  body: step.body.map((run) => (typeof run === "string" ? run : run.label)).join(""),
}));

export default function ServicesPage() {
  return (
    <FlowPage>
      <PageHero
        eyebrow="Services"
        title="We make the internet"
        muted="work for your business."
        lead="Strategy, design and engineering in the same room — from the first question to long after launch."
        footRight="Websites, online stores and web applications, under one studio."
        image="web-design"
        actions={[
          { label: "Talk to us", href: ROUTES.contact },
          { label: "Start a project", href: ROUTES.startProject, solid: true },
        ]}
      />
      <StudioScenes
        id="capabilities"
        label="Three services, one studio"
        text="Each one starts with the business: what it needs the website, the store or the software to do."
        button={{ label: "Start a project", href: ROUTES.startProject }}
        scenes={scenesFromItems(
          SERVICE_PAGES.map((page) => ({
            title: page.name,
            body: page.hero.lead,
            link: { href: serviceHref(page.id), label: `Explore ${page.name.toLowerCase()}` },
          })),
          ["web-design", "real-estate", "ecommerce", "hospitality", "web-applications", "startups-technology"],
        )}
      />
      <FlowChapter eyebrow="What you get" title="What you're left" accent="holding." items={WHAT_YOU_GET} />
      <FlowChapter
        eyebrow="How we work"
        title="Four stages."
        accent="The same on every project."
        variant="steps"
        items={STAGES}
      />
      <FlowChapter
        id="industries"
        eyebrow="Industries"
        title="Digital matters more"
        accent="when the decision matters."
        intro={[
          "We work with businesses where the website isn't just another channel. It's where people decide.",
        ]}
      />
      <FlowOutro
        lead="Let's build"
        accent="what's next."
        cardsTitle="The industries we build for"
        cards={INDUSTRIES.map((industry) => ({
          key: industry.id,
          image: industry.id,
          title: industry.name,
          body: industry.blurb,
        }))}
      />
    </FlowPage>
  );
}
