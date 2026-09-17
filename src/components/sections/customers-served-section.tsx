import { Reveal } from "@/components/ui/reveal";

/*
 * Five overlapping headshots above a single headline.
 *
 * The overlap is a -16px left margin on every avatar, and the rendered size
 * steps 48px -> 60px at 1020px, matching the source's
 * `sizes="(min-width: 1020px) 60px, 48px"`. Order is the DOM order, which is
 * deliberately not numeric.
 */

const HEADSHOTS = ["headshot-2", "headshot-3", "headshot-5", "headshot-1", "headshot-4"];
const DIR = "/images/pages/homepage-2025/customers-served";

export function CustomersServedSection() {
  return (
    <section id="customers-served" className="bg-primitive-black">
      <div className="flex items-center justify-center px-(--grid-gutter-width) pt-20 pb-10 bp744:pb-14 bp1020:pt-0 bp1020:pb-20">
        {HEADSHOTS.map((name, i) => (
          <Reveal
            key={name}
            as="span"
            delay={i * 80}
            className="-ml-4 block first:ml-0"
          >
            <img
              src={`${DIR}/${name}.webp`}
              alt=""
              width={240}
              height={240}
              loading="lazy"
              decoding="async"
              className="size-12 rounded-full object-cover bp1020:size-15"
            />
          </Reveal>
        ))}
      </div>

      <Reveal
        as="h2"
        className="type-subtitle1 page-gutter mx-auto max-w-[calc((var(--grid-column-width)*8)+(var(--grid-gutter-width)*7))] pb-10 text-center text-balance text-primitive-white bp744:pb-16 bp1020:pb-20"
      >
        Trusted by 14 million entrepreneurs worldwide
      </Reveal>
    </section>
  );
}
