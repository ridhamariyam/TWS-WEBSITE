import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./about-hero.module.css";

/*
 * The top of /about, after the centred hero on waverunmedia.com/about: a
 * full-screen picture under a dark wash, the headline in the middle with its
 * words rising out of a blur one after another, and a line beneath.
 */
const TITLE = "Small studio. Serious work.";

export function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-title">
      <img
        src="/videos/studio-film-poster.webp"
        alt=""
        className={styles.image}
        fetchPriority="high"
        decoding="async"
      />
      <div className={styles.content}>
        <h1 id="about-title" className={cn(wave.title82, styles.title)} aria-label={TITLE}>
          <span className={styles.line} aria-hidden="true">
            {TITLE.split(" ").map((word, i) => (
              <span key={word} className={styles.word} style={{ "--i": i } as React.CSSProperties}>
                {word}
              </span>
            ))}
          </span>
        </h1>
        <p className={styles.text}>
          TWS — The Web Studio — is built on strategy, story and engineering:
          designing and building websites that move businesses forward.
        </p>
      </div>
    </section>
  );
}
