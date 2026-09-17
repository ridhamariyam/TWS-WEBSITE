/*
 * Final CTA.
 *
 * The particle sphere behind the copy is a video, not a canvas — two of them in
 * fact, a desktop cut and a mobile cut swapped by breakpoint, each sitting at
 * z-index -1 behind a full-height flex column.
 */

import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";

const DIR = "/images/components/conversion";

export function ConversionCtaSection() {
  return (
    <section
      id="conversion"
      className="relative z-[101] flex min-h-svh w-full flex-col items-center justify-center gap-10 bg-transparent pb-10 text-center"
    >
      <ConversionVideo variant="mobile" />
      <ConversionVideo variant="desktop" />

      <Reveal
        as="h2"
        className="type-title4 m-0 max-w-[calc((var(--grid-column-width)*12)+(var(--grid-gutter-width)*11))] text-primitive-white"
      >
        Start your free website trial today
      </Reveal>
      <Reveal as="p" className="type-body-medium text-primitive-white">
        No credit card required. Cancel anytime.
      </Reveal>
      <Reveal>
        <Cta
          variant="primary-subtle"
          theme="light"
          hasArrow
          href="/templates/get-started"
        >
          Get started
        </Cta>
      </Reveal>
    </section>
  );
}

function ConversionVideo({ variant }: { variant: "desktop" | "mobile" }) {
  const file = variant === "desktop" ? "conversion-centered" : "conversion-centered-mobile";
  return (
    <div
      aria-hidden="true"
      className={
        variant === "desktop"
          ? "absolute inset-0 -z-10 hidden h-full w-full bp1020:block"
          : "absolute inset-0 -z-10 h-full w-full bp1020:hidden"
      }
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        preload="none"
        poster={`${DIR}/${file}-poster.webp`}
      >
        <source src={`${DIR}/${file}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
