import { Reveal } from "@/components/ui/reveal";

/* "Small studio. Serious work." — one statement on black, and nothing else. */

export function StudioLineSection() {
  return (
    <section id="studio">
      <Reveal
        as="h2"
        className="type-subtitle1 page-gutter mx-auto max-w-[var(--span-8)] pt-8 pb-10 text-center text-balance text-ink bp744:pt-10 bp744:pb-16 bp1020:pt-12 bp1020:pb-20"
      >
        Small studio. Serious work.
      </Reveal>
    </section>
  );
}
