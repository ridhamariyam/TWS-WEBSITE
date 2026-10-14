"use client";

import Link from "next/link";
import {
  AccordionSection,
  RichParagraph,
} from "@/components/sections/accordion-section";
import { PROCESS_STEPS } from "@/lib/process-content";
import { ROUTES } from "@/lib/site-links";
import { STUDIO_PRINCIPLES } from "@/lib/studio-content";
import styles from "./homepage-accordions.module.css";

/*
 * The stacked accordion blocks before the questions and the writing: the
 * process and the studio's position. Both collapsed on load, independent.
 * The questions and the writing have sections of their own — see
 * FaqSection and BlogSection.
 */

/* The first card leads to the studio's story, the second to a conversation. */
const STUDIO_CARD_HREFS = {
  brief: ROUTES.about,
  answers: ROUTES.contact,
} as const;

const STUDIO_CARDS = STUDIO_PRINCIPLES.map((principle) => ({
  ...principle,
  href: STUDIO_CARD_HREFS[principle.id],
}));

export function HomepageAccordions() {
  return (
    <>
      <AccordionSection id="homepage-process" title="No mystery. Just good work.">
        <ol className="flex flex-col gap-10 pt-4">
          {PROCESS_STEPS.map((step) => (
            <li
              key={step.heading}
              className="grid gap-2 bp1020:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] bp1020:gap-10"
            >
              <h3 className="type-subtitle3">{step.heading}</h3>
              <RichParagraph runs={step.body} />
            </li>
          ))}
        </ol>
      </AccordionSection>

      <AccordionSection
        id="homepage-studio"
        title="We start with the business. Not the brief."
      >
        <div className="grid gap-6 pt-4 bp744:grid-cols-2">
          {STUDIO_CARDS.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className={`${styles.supportCard} cta cta--inline group rounded-lg bg-surface-card p-8`}
            >
              <h3 className="type-subtitle2">{card.title}</h3>
              <p className="type-body mt-2">{card.body}</p>
              <p className="type-body mt-6" aria-hidden="true">
                <span className={styles.supportArrow}>→</span>
              </p>
            </Link>
          ))}
        </div>
      </AccordionSection>

    </>
  );
}
