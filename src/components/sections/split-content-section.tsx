import { FadedLines } from "@/components/ui/faded-lines";
import { Reveal } from "@/components/ui/reveal";
import { fallbackSrc, srcSet } from "@/lib/images";
import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./split-content-section.module.css";

/*
 * A picture beside a label, a headline and a few lines, after the mission and
 * vision rows on waverunmedia.com/about. `reverse` puts the picture on the
 * right; the label sits at the top of the text column, the headline and copy
 * at the bottom.
 */
export function SplitContentSection({
  id,
  label,
  title,
  paragraphs,
  image,
  reverse = false,
}: {
  id: string;
  label: string;
  /** The headline, a line per entry. */
  title: string[];
  paragraphs: string[];
  image: string;
  reverse?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(wave.section, "page-gutter scroll-mt-(--global-nav-height)")}
      aria-labelledby={`${id}-title`}
    >
      <div className={cn(styles.container, reverse && styles.reverse)}>
        <Reveal className={styles.image}>
          <img
            src={fallbackSrc(image)}
            srcSet={srcSet(image)}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </Reveal>
        <Reveal className={styles.wrapper}>
          <h2 id={`${id}-title`} className={cn(wave.label, styles.heading)}>
            {label}
          </h2>
          <FadedLines lines={title} className={cn(wave.title56, styles.subheading)} />
          <div className={styles.body}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className={wave.text}>
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
