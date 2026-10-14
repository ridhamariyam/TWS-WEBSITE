import type { Metadata } from "next";
import { FlowChapter } from "@/components/flow/flow-chapter";
import { FlowOutro } from "@/components/flow/flow-outro";
import { FlowPage } from "@/components/flow/flow-page";
import { PageHero } from "@/components/flow/page-hero";
import type { Scene } from "@/components/flow/scenes";
import { StudioScenes } from "@/components/flow/studio-scenes";
import { PROCESS_STEPS } from "@/lib/process-content";
import { pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/site-links";
import { STUDIO_POV, STUDIO_VALUES } from "@/lib/studio-content";
import { TEAM } from "@/lib/team-content";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "TWS — The Web Studio is a digital product studio in Calicut, Kerala: who we are, what we stand for, how we work, and the people behind it.",
  path: ROUTES.about,
});

/*
 * /about on the homepage's flow: who we are in the hero,
 * the mission and vision, the four stages as bento scenes,
 * what we stand for, and the people.
 *
 * "How We Work" and "Our POV" in the header and footer are anchors into this
 * page: #process is the stages, #pov the mission.
 */

const plain = (body: (typeof PROCESS_STEPS)[number]["body"]) =>
  body.map((run) => (typeof run === "string" ? run : run.label)).join("");

/* The four stages: a violet card each, between the studio's photographs. */
const STAGE_IMAGES = ["web-design", "studio-footer", "professional-services", "web-applications", "real-estate", "startups-technology", "hospitality", "ecommerce"];
const PROCESS_SCENES: Scene[] = PROCESS_STEPS.map((step, i) => {
  const [number, name] = step.heading.split(" — ");
  const card = { look: "violet" as const, type: name, body: plain(step.body) };
  const image = (n: number) => ({ image: STAGE_IMAGES[(i * 2 + n) % STAGE_IMAGES.length] });
  return i % 2 === 0
    ? {
        layout: "D",
        tiles: [
          { ...card, area: "a", delay: 0 },
          { area: "b", delay: 0.1, media: image(0) },
          { area: "c", delay: 0.2, media: image(1) },
        ],
      }
    : {
        layout: "E",
        tiles: [
          { area: "a", delay: 0, media: image(0) },
          { ...card, look: "stat" as const, stat: number, area: "b", delay: 0.12 },
          { area: "c", delay: 0.24, media: image(1) },
        ],
      };
});

export default function AboutPage() {
  return (
    <FlowPage>
      <PageHero
        eyebrow="About"
        title="A digital studio"
        muted="in Calicut, Kerala."
        lead="We design and build interactive, story-driven websites and custom digital experiences — strategy, storytelling, UI/UX, motion and engineering under one roof."
        footRight="TWS — The Web Studio. A digital product studio."
        image="studio-footer"
        actions={[
          { label: "How we work", href: "#process" },
          { label: "Start a project", href: ROUTES.startProject, solid: true },
        ]}
      />
      <FlowChapter
        id="pov"
        eyebrow="Our mission"
        title="Help businesses stand out, and turn visitors"
        accent="into customers."
        intro={[STUDIO_POV.points[1].body, "Every site we build has a job to do, and we design it around that job."]}
      />
      <FlowChapter
        id="vision"
        eyebrow="Our vision"
        title="World-class websites,"
        accent="made in India."
        intro={[STUDIO_POV.points[0].body, "We want a site made in Calicut to stand beside the best anywhere."]}
      />
      <StudioScenes
        id="process"
        label="How we work"
        text="No mystery. Just good work, in four stages."
        button={{ label: "Start a project", href: ROUTES.startProject }}
        scenes={PROCESS_SCENES}
      />
      <FlowChapter eyebrow="Values" title="What we" accent="stand for." items={STUDIO_VALUES} />
      <FlowChapter
        eyebrow="The people"
        title="Founders"
        variant="rows"
        items={TEAM.map((person) => ({ title: `${person.name} — ${person.role}`, body: person.bio[0] }))}
      />
      <FlowOutro />
    </FlowPage>
  );
}
