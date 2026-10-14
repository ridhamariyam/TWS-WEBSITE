import { FadedLines } from "@/components/ui/faded-lines";
import { Reveal } from "@/components/ui/reveal";
import { fallbackSrc, srcSet } from "@/lib/images";
import { STUDIO_INTRO } from "@/lib/studio-content";
import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./brand-intro-section.module.css";

/*
 * The studio in a line, three pictures and a paragraph, after the brand intro
 * on waverunmedia.com/about: the middle picture takes twice the width of the
 * others; each rises into place as it comes on screen.
 */
const IMAGES = [
  { name: "studio-footer", position: "50% 30%" },
  { name: "zeen", position: "50% 50%" },
  { name: "web-applications", position: "30% 50%" },
];

export function BrandIntroSection() {
  return (
    <section className={cn(wave.section, "page-gutter")} aria-labelledby="studio-title">
      <Reveal>
        <h2 id="studio-title" className={cn(wave.label, styles.heading)}>
          Who we are
        </h2>
        <FadedLines
          lines={["Crafting websites", "that move businesses forward."]}
          className={cn(wave.title68, styles.subheading)}
        />
      </Reveal>
      <div className={styles.images}>
        {IMAGES.map((image, i) => (
          <Reveal key={image.name} delay={i * 120} className={styles.image}>
            <img
              src={fallbackSrc(image.name)}
              srcSet={srcSet(image.name)}
              sizes="(min-width: 768px) 50vw, 100vw"
              alt=""
              loading="lazy"
              decoding="async"
              style={{ objectPosition: image.position }}
            />
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className={cn(wave.text, styles.text)}>{STUDIO_INTRO}</p>
      </Reveal>
    </section>
  );
}
