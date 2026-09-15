import { Reveal } from "@/components/motion/reveal";
import { hero } from "@/lib/content";

import { HeroParticles } from "./hero-particles";
import { HeroRays } from "./hero-rays";

/**
 * Full-viewport hero: drifting particles, a pulsing lime ray ring, a giant
 * lime background word and the centred headline. The site header overlays
 * this section, so no top padding is reserved for it.
 *
 * Background word offset (measured): its wrapper is shifted -100px (tablet
 * -40px) and then translated -50% of its own widened box, which puts the
 * word's centre 100px (tablet 40px) left of the section centre.
 */
export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-[15px] max-lg:min-h-[600px] max-md:min-h-[450px] max-md:px-0 max-md:py-[60px]">
      <HeroParticles />
      <HeroRays />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 w-full -translate-y-1/2 max-md:hidden"
      >
        <div className="ml-[-100px] -translate-x-1/2 max-lg:ml-[-40px]">
          <Reveal
            from={{ x: 50 }}
            duration={600}
            delay={0}
            className="text-center text-[650px] leading-[32px] font-semibold tracking-[-40px] whitespace-nowrap text-lime max-lg:text-[260px] max-lg:tracking-[-15px]"
          >
            {hero.backgroundWord}
          </Reveal>
        </div>
      </div>

      <h1 className="relative w-full max-w-[1098px] text-center text-[120px] leading-[110px] font-semibold tracking-[-4px] text-ink max-lg:max-w-[720px] max-lg:text-[105px] max-lg:leading-[96.25px] max-md:w-[90%] max-md:text-[75px] max-md:leading-[75px]">
        {hero.lines.map((line, i) => (
          <Reveal
            key={line}
            as="span"
            className="block"
            from={{ y: 30 }}
            duration={600}
            delay={500 + i * 300}
          >
            {line}
          </Reveal>
        ))}
      </h1>
    </section>
  );
}
