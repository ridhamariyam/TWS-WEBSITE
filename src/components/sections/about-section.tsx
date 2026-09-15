import Image from "next/image";

import { Parallax } from "@/components/motion/parallax";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { DotLink } from "@/components/ui/dot-link";
import { RichText } from "@/components/ui/rich-text";
import { about } from "@/lib/content";

const IMAGE_SIZES = "(max-width: 991px) 100vw, 60vw";

/**
 * Image bleeding off the left edge with a 1.1 → 1 scroll scale, an overlapping
 * heading + copy + dot link on the right, and a giant lime word drifting left
 * behind the content.
 *
 * Parallax is desktop-only (≥992px), matching the reference where skrollr is
 * disabled on touch/tablet widths. Because <Parallax> writes an inline
 * transform, the desktop and <992px variants are rendered separately and
 * toggled with display utilities instead of overriding the transform.
 */
export function AboutSection() {
  const image = (
    <Image
      src={about.image.src}
      alt={about.image.alt}
      width={about.image.width}
      height={about.image.height}
      sizes={IMAGE_SIZES}
      className="block h-auto w-full"
    />
  );

  return (
    <section id="about" className="relative isolate overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1220px] items-center py-[110px] max-xl:max-w-[960px] max-lg:max-w-[720px] max-lg:flex-col max-lg:py-[75px] max-md:max-w-[540px] max-md:py-[50px] max-sm:max-w-none">
        <div className="relative flex w-1/2 flex-col px-[15px] max-lg:w-full">
          <Parallax from={{ scale: 1.1 }} to={{ scale: 1 }} className="max-lg:hidden">
            <div className="-ml-[288px] w-[calc(100%+288px)]">{image}</div>
          </Parallax>
          <div className="hidden max-lg:block">{image}</div>
        </div>

        <RevealGroup className="relative ml-[8.3333%] flex w-5/12 flex-col px-[15px] max-lg:mt-[35px] max-lg:ml-0 max-lg:w-full">
          <Reveal from={{ x: 15 }} duration={800} delay={200} className="w-[478px] max-xl:w-full">
            <h2 className="mb-[40px] -ml-[216px] w-[calc(100%+216px)] text-[80px] leading-[80px] font-semibold tracking-[-3px] text-ink max-xl:-ml-[120px] max-xl:w-[calc(100%+120px)] max-xl:text-[70px] max-xl:leading-[70px] max-lg:mb-[25px] max-lg:ml-0 max-lg:w-full max-md:text-[52.5px] max-md:leading-[52.5px]">
              {about.heading}
            </h2>
          </Reveal>
          <Reveal
            as="p"
            from={{ x: 15 }}
            duration={800}
            delay={500}
            className="w-[454px] text-[17px] leading-[34px] font-normal text-body max-xl:w-full"
          >
            <RichText value={about.body} />
          </Reveal>
          <Reveal from={{ x: 15 }} duration={800} delay={800} className="mt-[30px] flex">
            <DotLink href={about.link.href} label={about.link.label} />
          </Reveal>
        </RevealGroup>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[60px] left-[61.18%] z-[-1] text-[300px] leading-[300px] font-semibold tracking-[-20px] whitespace-nowrap text-lime select-none max-lg:right-[25px] max-lg:bottom-0 max-lg:left-auto max-lg:text-[175px] max-lg:leading-[175px] max-lg:tracking-[-10px] max-md:hidden"
      >
        <Parallax from={{ x: 0 }} to={{ x: -100 }} className="max-lg:hidden">
          <Reveal from={{ y: 1 }} duration={600} delay={300}>
            <span>{about.backgroundWord}</span>
          </Reveal>
        </Parallax>
        <Reveal from={{ y: 1 }} duration={600} delay={300} className="hidden max-lg:block">
          <span>{about.backgroundWord}</span>
        </Reveal>
      </div>
    </section>
  );
}
