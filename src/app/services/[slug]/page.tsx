import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { FlowChapter } from "@/components/flow/flow-chapter";
import { FlowFaq } from "@/components/flow/flow-faq";
import { FlowOutro } from "@/components/flow/flow-outro";
import { FlowPage } from "@/components/flow/flow-page";
import { FlowWork } from "@/components/flow/flow-work";
import { PageHero } from "@/components/flow/page-hero";
import { Statements } from "@/components/flow/statements";
import { scenesFromItems } from "@/components/flow/scenes";
import { StudioScenes } from "@/components/flow/studio-scenes";
import { breadcrumbJsonLd, pageFaqJsonLd, pageMetadata } from "@/lib/seo";
import { SERVICE_PAGES, servicePage, type ServicePage as ServicePageCopy } from "@/lib/service-pages";
import { ROUTES, serviceHref } from "@/lib/site-links";

/*
 * One service's page, from its copy in service-pages.ts, on the homepage's
 * flow: the hero card opening out, the copy's short lines as kinetic type,
 * what the service covers as bento scenes, the reading as chapters with the
 * selected work before the process, the questions, and a closing line gathered out of scattered letters.
 */

export function generateStaticParams() {
  return SERVICE_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = servicePage((await params).slug);
  if (!page) return {};
  return pageMetadata({
    title: page.name,
    documentTitle: page.meta.documentTitle,
    description: page.meta.description,
    ogTitle: page.meta.ogTitle,
    ogDescription: page.meta.ogDescription,
    path: serviceHref(page.id),
  });
}

/* The other services' names, where a line of copy mentions them, become links to them. */
const MENTIONS: Array<[string, ServicePageCopy["id"]]> = [
  ["e-commerce development", "ecommerce"],
  ["web application development", "web-applications"],
];

function linkMentions(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let rest = text;
  for (const [phrase, id] of MENTIONS) {
    const at = rest.indexOf(phrase);
    if (at < 0) continue;
    parts.push(rest.slice(0, at), <Link key={id} href={serviceHref(id)}>{phrase}</Link>);
    rest = rest.slice(at + phrase.length);
  }
  return parts.length ? [...parts, rest] : text;
}

/* The other services, for the closing fly-through. */
const otherServices = (slug: string) =>
  SERVICE_PAGES.filter((page) => page.slug !== slug).map((page) => ({
    key: page.slug,
    image: page.hero.image,
    title: page.name,
    body: page.hero.lead.split(". ")[0] + ".",
    href: serviceHref(page.id),
  }));

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const page = servicePage((await params).slug);
  if (!page) notFound();
  const path = serviceHref(page.id);
  const before = page.chapters.filter((chapter) => chapter.beforeBuild);
  const after = page.chapters.filter((chapter) => !chapter.beforeBuild);

  return (
    <FlowPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Home", path: ROUTES.home },
              { name: "Services", path: ROUTES.services },
              { name: page.name, path },
            ]),
            pageFaqJsonLd(path, page.faqs),
          ]),
        }}
      />
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        muted={page.hero.muted}
        lead={page.hero.lead}
        footRight={page.hero.footRight}
        image={page.hero.image}
        actions={[
          { label: "View the work", href: ROUTES.work },
          { label: "Start a project", href: ROUTES.startProject, solid: true },
        ]}
      />
      <Statements title={page.hero.title + " " + page.hero.muted} lines={page.statements} />
      {before.map((chapter) => (
        <FlowChapter key={chapter.title} {...chapter} note={chapter.note && linkMentions(chapter.note)} />
      ))}
      <StudioScenes
        scenes={scenesFromItems(page.build.items, page.build.images)}
        label={page.build.label}
        text={page.build.text}
        button={{ label: "Start a project", href: ROUTES.startProject }}
      />
      {after.map((chapter) => (
        <Fragment key={chapter.title}>
          {chapter.id === "process" && <FlowWork {...page.work} />}
          <FlowChapter {...chapter} note={chapter.note && linkMentions(chapter.note)} />
        </Fragment>
      ))}
      <FlowFaq eyebrow="Questions" title={page.faqTitle} faqs={page.faqs} />
      <FlowOutro
        lead={page.closing.lead}
        accent={page.closing.accent}
        note={page.closing.note}
        cards={otherServices(page.slug)}
        cardsTitle="Our other services"
      />
    </FlowPage>
  );
}
