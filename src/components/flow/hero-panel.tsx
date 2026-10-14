import Link from "next/link";
import type { ReactNode } from "react";
import { SERVICES } from "@/lib/services-content";
import { isInternalHref } from "@/lib/site-links";
import { STUDIO_LOCATION } from "@/lib/studio-content";
import { Swatch, toneAt } from "./swatch";
import styles from "./flow.module.css";

/*
 * The black hero panel every page opens on: the title top left, its second
 * line muted, the lead and buttons bottom left (either can be left out), and
 * a hairline over the studio badge and a line of copy. The portrait card that
 * stands in its middle belongs to the stage around it (HeroStage on the
 * homepage, PageHero on the others), since each moves it differently.
 *
 * Its copy fades with the stage's --hero-copy.
 */

export type HeroAction = { label: string; href: string; solid?: boolean };

export function HeroPanel({
  titleId,
  eyebrow,
  title,
  muted,
  lead,
  actions,
  footRight,
}: {
  titleId: string;
  eyebrow?: string;
  title: ReactNode;
  muted?: ReactNode;
  lead?: ReactNode;
  actions?: HeroAction[];
  footRight: ReactNode;
}) {
  const hasActions = actions !== undefined && actions.length > 0;
  return (
    <div className={styles.heroPanel}>
      <div className={styles.heroFace} style={{ opacity: "var(--hero-copy)" }}>
        <div className={styles.heroHead}>
          {eyebrow && <p className={styles.heroEyebrow}>{eyebrow}</p>}
          <h1 id={titleId} className={styles.heroTitle}>
            {title}
            {muted && <span className={styles.heroTitleMuted}> {muted}</span>}
          </h1>
        </div>
        {(lead || hasActions) && (
          <div className={styles.heroCopy}>
            {lead && <p className={styles.heroLead}>{lead}</p>}
            {hasActions && (
              <div className={styles.heroActions}>
                {actions.map((action) => {
                  const className = action.solid ? styles.btnSolid : styles.btnGhost;
                  return isInternalHref(action.href) ? (
                    <Link key={action.label} href={action.href} className={className}>
                      {action.label}
                    </Link>
                  ) : (
                    <a
                      key={action.label}
                      href={action.href}
                      className={className}
                      {...(action.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {action.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}
        <div className={styles.heroFoot}>
          <span className={styles.heroBadge}>
            <span className={styles.heroBadgeThumbs} aria-hidden="true">
              {SERVICES.map((service, i) => (
                <Swatch key={service.id} tone={toneAt(i)} />
              ))}
            </span>
            {STUDIO_LOCATION}
          </span>
          <span className={styles.heroFootRight}>{footRight}</span>
        </div>
      </div>
    </div>
  );
}
