import { Cta } from "@/components/ui/cta";
import { HeroTunnel } from "@/components/sections/hero-tunnel";
import { HeroTunnelLoop } from "@/components/sections/hero-tunnel-loop";
import { HeroIntro } from "@/components/sections/hero-intro";
import { beat, EASE } from "@/components/sections/hero-beat";
import styles from "./hero-section.module.css";
import { ROUTES } from "@/lib/site-links";

/*
 * Hero: the tunnel, the headline, then the line that carries into the page.
 *
 * One viewport of black. `HeroTunnel` covers the page and opens, then
 * `HeroTunnelLoop` carries the same tunnel on behind the type. The copy is not
 * retimed for the intro — `--beat-offset` on `.copy` pushes every beat back by
 * the same amount, so it arrives through the opening wall rather than behind
 * it, and is zero on a visit that skips the intro.
 *
 * The whole sequence is over in two seconds. See hero-tunnel-data.ts.
 */

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative"
      translate="yes"
    >
      <HeroTunnel />
      <HeroIntro />

      <div className="relative grid min-h-[100svh] place-items-center overflow-hidden">
        <HeroTunnelLoop />

        <div
          className={`${styles.copy} page-gutter mx-auto flex w-[min(100%,var(--span-11))] flex-col items-center text-center bp744:w-full`}
        >
          <h1 className="type-title3 w-full text-primitive-white">
            <span
              className={`tws-beat ${styles.line}`}
              style={beat(0.3, 0.9, EASE.reveal)}
            >
              {/*
                * The first span carries a trailing space: without it the two
                * text nodes abut and the accessible name reads
                * "presencehit different."
                */}
              <span className="flex flex-col text-center bp744:text-nowrap">
                <span>Make your digital presence </span>
                <span>hit different.</span>
              </span>
            </span>
          </h1>

          <span
            className={`tws-beat ${styles.line}`}
            style={beat(0.44, 0.9, EASE.reveal)}
          >
            <Cta
              variant="primary-subtle"
              theme="light"
              hasArrow
              href={ROUTES.startProject}
              className="my-6 mb-4"
            >
              Start a project
            </Cta>
          </span>

          <p
            className={`tws-beat type-body ${styles.line} text-lime`}
            style={beat(0.54, 0.9, EASE.reveal)}
          >
            Strategy &middot; Design &middot; Technology &middot; Experience
          </p>
        </div>
      </div>

      <div className="page-gutter flex items-center justify-center pt-16 pb-16 bp744:pt-20 bp744:pb-20">
        <p className="type-body measure w-[min(100%,var(--span-8))] text-center text-gray-200 bp744:w-[var(--span-8)] bp1280:w-[var(--span-10)]">
          Your website is where most people meet your business. We make that
          first impression count.
        </p>
      </div>
    </section>
  );
}
