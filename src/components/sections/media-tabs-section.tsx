import Link from "next/link";
import { Reveal } from "@/components/ui/reveal";
import { fallbackSrc, srcSet } from "@/lib/images";
import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./media-tabs-section.module.css";

/*
 * A row of tall picture cards, after the "What we do" cards on
 * waverunmedia.com: from 1280px the one under the pointer widens, its
 * picture zooms, a shade rises from the bottom and its name and line slide
 * up into it. Narrower screens scroll the cards sideways, text showing.
 */
export type MediaTab = {
  key: string;
  image: string;
  name: string;
  body: React.ReactNode;
  href?: string;
};

export function MediaTabsSection({
  id,
  label,
  title,
  items,
}: {
  id: string;
  label: string;
  title: string;
  items: MediaTab[];
}) {
  return (
    <section
      id={id}
      className={cn(styles.section, "scroll-mt-(--global-nav-height)")}
      aria-labelledby={`${id}-title`}
    >
      <Reveal className={wave.narrow}>
        <h2 id={`${id}-title`} className={cn(wave.label, wave.labelCenter, styles.heading)}>
          {label}
        </h2>
        <p className={cn(wave.title68, styles.title)}>{title}</p>
      </Reveal>
      <ul className={styles.slider}>
        {items.map((item) => {
          const inner = (
            <>
              <img
                src={fallbackSrc(item.image)}
                srcSet={srcSet(item.image)}
                sizes="(min-width: 1280px) 50vw, 80vw"
                alt=""
                loading="lazy"
                decoding="async"
                className={styles.image}
              />
              <span className={styles.text}>
                <span className={cn(wave.title56, styles.name)}>{item.name}</span>
                <span className={styles.line}>{item.body}</span>
              </span>
            </>
          );
          return (
            <Reveal as="li" key={item.key} className={styles.slide}>
              {item.href ? (
                <Link href={item.href} className={styles.link}>
                  {inner}
                </Link>
              ) : (
                <div className={styles.link} tabIndex={0}>
                  {inner}
                </div>
              )}
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
