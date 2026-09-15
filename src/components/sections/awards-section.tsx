import Image from "next/image";

import { Parallax } from "@/components/motion/parallax";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { awards } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Heading + tag with a giant lime background word (scroll parallax) on the left,
 * intro copy, a bordered recognition table and a logo row on the right.
 * Desktop: two columns (5/12 + offset 1/12 + 6/12) · tablet (<992): stacked and
 * centred · mobile (<768): background word hidden, two-line table labels.
 */
export function AwardsSection() {
  return (
    <section id="awards" aria-labelledby="awards-heading">
      <div className="mx-auto flex w-full max-w-[1220px] py-[110px] max-xl:max-w-[960px] max-lg:max-w-[720px] max-lg:flex-col max-lg:py-[75px] max-md:max-w-[540px] max-md:py-[50px] max-sm:max-w-none">
        {/* Left column */}
        <div className="relative flex w-5/12 min-w-0 flex-col px-[15px] max-lg:w-full max-lg:items-center">
          <Reveal from={{ y: 30 }} duration={600} delay={100}>
            <h2
              id="awards-heading"
              className="mb-[25px] text-[60px] leading-[60px] font-semibold tracking-[-3px] text-ink max-lg:text-center max-lg:text-[52.5px] max-lg:leading-[52.5px] max-md:text-[41.26px] max-md:leading-[41.26px]"
            >
              {awards.heading}
            </h2>
          </Reveal>

          <Reveal from={{ y: 30 }} duration={600} delay={200}>
            <div className="mb-[49px] max-lg:mb-[30px]">
              <span className="inline-block rounded-[100px] bg-ink px-[25px] text-[12px] leading-[32px] font-medium tracking-[0.5px] text-white uppercase">
                {awards.tag}
              </span>
            </div>
          </Reveal>

          <div className="relative h-[350px] w-full max-lg:mb-[41.4px] max-lg:h-[219px] max-md:hidden">
            <Parallax from={{ x: 0 }} to={{ x: -100 }} className="absolute inset-0">
              <Reveal from={{}} duration={600} delay={300} className="absolute inset-0">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 right-[-135px] text-[350px] leading-[350px] font-semibold tracking-[-20px] whitespace-nowrap text-lime select-none max-lg:right-auto max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:text-[218.75px] max-lg:leading-[218.75px] max-lg:tracking-[-10px]"
                >
                  {awards.backgroundWord}
                </span>
              </Reveal>
            </Parallax>
          </div>
        </div>

        {/* Right column */}
        <RevealGroup className="flex w-1/2 min-w-0 flex-col px-[15px] ml-[8.3333%] max-lg:ml-0 max-lg:w-full">
          <Reveal from={{ y: 30 }} duration={600} delay={0}>
            <div className="mt-[49.3px] mb-[40px] max-lg:mt-0 max-lg:mb-[25px] max-lg:text-center">
              <p className="mb-[25px] max-w-[493px] text-[17px] leading-[32px] text-body max-lg:max-w-none">
                {awards.intro}
              </p>
            </div>
          </Reveal>

          <Reveal as="ul" from={{ y: 30 }} duration={600} delay={300}>
            {awards.rows.map((row) => (
              <li
                key={`${row.label}-${row.source}-${row.year}`}
                className="flex border-t border-ink last:border-b"
              >
                <div className="flex w-[97px] shrink-0 items-center justify-center text-[14px] leading-[32px] font-semibold text-ink max-lg:w-[115px] max-md:w-[60px]">
                  {row.count}
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center border-l border-ink px-[30px] py-[15px] text-[17px] leading-[32px] tracking-[-0.5px] text-body max-md:text-center">
                  <p>
                    {row.label} - <span className="font-semibold text-ink max-md:block">{row.source}</span>
                  </p>
                </div>
                <div className="flex w-[97px] shrink-0 items-center justify-center px-[15px] text-[14px] leading-[32px] font-semibold text-ink max-lg:w-[115px] max-md:w-[60px]">
                  {row.year}
                </div>
              </li>
            ))}
          </Reveal>

          <Reveal
            from={{ y: 30 }}
            duration={600}
            delay={600}
            className="mt-[50px] grid grid-cols-3 items-center max-md:mt-[40px] max-md:grid-cols-2 max-md:gap-y-[30px]"
          >
            {awards.logos.map((logo, i) => (
              <a
                key={logo.src}
                href="#"
                aria-label={logo.alt}
                className={cn(
                  "flex h-[32px] min-w-0 items-center justify-self-center max-md:odd:last:col-span-2",
                  i === 0 && "justify-self-start max-lg:justify-self-center",
                )}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="h-auto max-w-full"
                />
              </a>
            ))}
          </Reveal>
        </RevealGroup>
      </div>
    </section>
  );
}
