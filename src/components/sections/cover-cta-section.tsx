import { Cta } from "@/components/ui/cta";
import { Film } from "@/components/ui/film";
import { Reveal } from "@/components/ui/reveal";
import { ROUTES } from "@/lib/site-links";
import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./cover-cta-section.module.css";

/*
 * A full-screen film with the studio's thinking set over it, after the
 * "The vision behind the flow" cover on waverunmedia.com: the film fills a
 * rounded panel, a 30% black wash keeps the copy legible, and the title, a
 * line and the button sit in the middle.
 */
export function CoverCtaSection() {
  return (
    <section className={styles.section} aria-labelledby="cover-title">
      <div className={styles.panel}>
        <Film
          src="/videos/studio-film.mp4"
          poster="/videos/studio-film-poster.webp"
          width={1280}
          height={720}
          className={styles.film}
        />
        <Reveal className={styles.content}>
          <div>
            <h2 id="cover-title" className={cn(wave.title68, styles.title)}>
              The thinking behind the work
            </h2>
            <p className={styles.text}>
              We believe a website has to earn its place in the business. From the
              first question to the last line of code, strategy, story and
              engineering stay in the same room.
            </p>
          </div>
          <Cta href={ROUTES.about} variant="primary-subtle" className="cta--lime">
            About TWS
          </Cta>
        </Reveal>
      </div>
    </section>
  );
}
