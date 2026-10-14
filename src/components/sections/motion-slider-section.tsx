import Link from "next/link";
import { Film } from "@/components/ui/film";
import { Reveal } from "@/components/ui/reveal";
import { ROUTES, workHref } from "@/lib/site-links";
import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./motion-slider-section.module.css";

/*
 * "Work in motion", after the "Stories in Motion" slider on waverunmedia.com:
 * a row of film cards that share the width; the one under the pointer takes
 * twice its share, its film grows to fill the card behind the text, and a
 * dark wash and a lime glow come up over it. Scrolls sideways on phones.
 */
const FILMS = [
  {
    film: "pen-mobile",
    width: 408,
    height: 810,
    title: "PEN Foundation",
    text: "The product site, on a phone",
    href: workHref("pen-foundation"),
  },
  {
    film: "zeen-store",
    width: 1440,
    height: 662,
    title: "ZEEN",
    text: "Storefront and commerce platform",
    href: workHref("zeen"),
  },
  {
    film: "pen-desktop",
    width: 1440,
    height: 716,
    title: "PEN Foundation",
    text: "A 3D model viewer, not a brochure",
    href: workHref("pen-foundation"),
  },
  {
    film: "brand-collage",
    width: 640,
    height: 360,
    title: "TWS",
    text: "The studio, in motion",
    href: ROUTES.about,
  },
];

export function MotionSliderSection() {
  return (
    <section className={cn(wave.section, styles.block)} aria-labelledby="motion-title">
      <Reveal className="page-gutter">
        <h2 id="motion-title" className={cn(wave.title68, styles.heading)}>
          Work in motion
        </h2>
      </Reveal>
      <ul className={styles.slider}>
        {FILMS.map((item) => (
          <Reveal as="li" key={item.film} className={styles.slide}>
            <Link href={item.href} className={styles.link}>
              <Film
                src={`/videos/${item.film}.mp4`}
                poster={`/videos/${item.film}-poster.webp`}
                width={item.width}
                height={item.height}
                className={styles.media}
              />
              <span className={cn(wave.title46, styles.title)}>{item.title}</span>
              <span className={styles.text}>{item.text}</span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
