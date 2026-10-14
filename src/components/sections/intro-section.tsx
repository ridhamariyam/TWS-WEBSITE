"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/use-reveal";
import { ROUTES } from "@/lib/site-links";
import { STUDIO_INTRO } from "@/lib/studio-content";
import { cn } from "@/lib/cn";
import styles from "./intro-section.module.css";

/*
 * "Studio." — a short introduction between the hero and the services stack.
 *
 * An oversized word, then a tag on the left and the statement on the right,
 * two notes under hairlines, and the way in. Each block rises out of a blur
 * the first time it reaches the viewport; the hairlines draw left to right.
 */

/*
 * The statement is the studio's own intro, shared with /about. Its opening
 * name takes the first-line indent.
 */
const LEAD_END = STUDIO_INTRO.indexOf(" is ");
const INTRO_LEAD = STUDIO_INTRO.slice(0, LEAD_END);
const INTRO_REST = STUDIO_INTRO.slice(LEAD_END);

const NOTES = [
  {
    title: "Built around the business",
    body: "We start with what the business is trying to become, then design a site that is clear, usable and easy to act on.",
  },
  {
    title: "Work with us",
    body: "Whether it's a new website, an online store or a web app, tell us what it needs to do and we'll shape it from there.",
  },
] as const;

/**
 * One block of the intro's reveal. `useReveal` holds it back only if it
 * starts below the fold; the stylesheet owns the blur-and-rise it plays.
 */
function Fade({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { ref } = useReveal("0px");
  return (
    <div ref={ref} className={cn(styles.fade, className)}>
      {children}
    </div>
  );
}

function Divider() {
  const { ref } = useReveal("0px 0px -5% 0px");
  return <div ref={ref} className={styles.divider} aria-hidden="true" />;
}

export function IntroSection() {
  return (
    <section className={styles.section} aria-labelledby="intro-heading">
      <div className={styles.container}>
        <Fade>
          <p className={styles.display} aria-hidden="true">
            Studio<span className={styles.mark}>.</span>
          </p>
        </Fade>

        <div className={styles.main}>
          <Fade>
            <p className={styles.badge}>
              A quick intro
            </p>
          </Fade>

          <div className={styles.details}>
            <Fade>
              <h2 id="intro-heading" className={styles.heading}>
                <span className={styles.indent}>{INTRO_LEAD}</span>
                {INTRO_REST}
              </h2>
            </Fade>

            <div className={styles.notes}>
              {NOTES.map((note) => (
                <div key={note.title} className={styles.note}>
                  <Divider />
                  <Fade className={styles.noteText}>
                    <h3 className={styles.noteTitle}>{note.title}</h3>
                    <p className={styles.noteBody}>{note.body}</p>
                  </Fade>
                </div>
              ))}
            </div>

            <Fade className={styles.action}>
              <Link href={ROUTES.contact} className={styles.button}>
                <span className={styles.dots} aria-hidden="true">
                  <span className={styles.dot} />
                  <span className={styles.fill} />
                </span>
                <span className={styles.labelWindow}>
                  <span className={styles.labelTrack}>
                    <span className={styles.label}>Get in Touch</span>
                    <span className={styles.label} aria-hidden="true">
                      Get in Touch
                    </span>
                  </span>
                </span>
              </Link>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
