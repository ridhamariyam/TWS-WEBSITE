"use client";

import {
  AccordionRow,
  AccordionSection,
  RichParagraph,
} from "@/components/sections/accordion-section";
import { FAQ_ENTRIES } from "@/lib/faq-content";
import { HOW_TO_STEPS } from "@/lib/how-to-content";
import styles from "./homepage-accordions.module.css";

/*
 * The three stacked accordion blocks that sit between the showcase wall and the
 * final CTA. All three are collapsed on load and open independently.
 */

const SUPPORT_LINKS = [
  {
    title: "Help Center",
    body: "Get help from our award-winning Customer Care team.",
    href: "https://support.squarespace.com",
  },
  {
    title: "Webinars",
    body: "Free online sessions to learn the basics and refine your skills.",
    href: "https://learning.squarespace.com/",
  },
];

export function HomepageAccordions() {
  return (
    <>
      <AccordionSection id="homepage-how-to" title="How to build a website">
        <ol className="flex flex-col gap-10 pt-4">
          {HOW_TO_STEPS.map((step) => (
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

      <AccordionSection id="homepage-faq" title="Frequently asked questions">
        <div className="pt-4">
          {FAQ_ENTRIES.map((entry) => (
            <AccordionRow
              key={entry.question}
              title={entry.question}
              titleAs="h3"
              titleClassName="type-subtitle3"
            >
              <div className="flex flex-col gap-4">
                {entry.answer.map((para, i) => (
                  <RichParagraph key={i} runs={para} />
                ))}
              </div>
            </AccordionRow>
          ))}
        </div>
      </AccordionSection>

      <AccordionSection id="homepage-support" title="24/7 Support">
        <div className="grid gap-6 pt-4 bp744:grid-cols-2">
          {SUPPORT_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.supportCard} cta cta--inline group rounded-lg bg-surface-card p-8`}
            >
              <h3 className="type-subtitle2">{link.title}</h3>
              <p className="type-body mt-2">{link.body}</p>
              <p className="type-body mt-6" aria-hidden="true">
                <span className={styles.supportArrow}>→</span>
              </p>
            </a>
          ))}
        </div>
      </AccordionSection>
    </>
  );
}
