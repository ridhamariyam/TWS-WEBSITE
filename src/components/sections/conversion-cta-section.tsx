/* The final CTA, on every page, on plain black. */

import { Cta } from "@/components/ui/cta";
import { Reveal } from "@/components/ui/reveal";
import { ROUTES } from "@/lib/site-links";

export function ConversionCtaSection() {
  return (
    <section
      id="start-a-project"
      className="page-gutter relative z-[101] flex min-h-[52svh] w-full flex-col items-center justify-center gap-8 bg-transparent py-16 text-center bp744:min-h-svh bp744:gap-10 bp744:py-10"
    >
      <Reveal
        as="h2"
        className="type-title4 m-0 max-w-[var(--span-12)] text-balance text-primitive-white"
      >
        Let&rsquo;s build what&rsquo;s next
      </Reveal>
      <Reveal as="p" className="type-body-medium measure text-primitive-white">
        New business, rethinking your current site, or not completely sure what
        you need yet? Start with a conversation.
      </Reveal>
      <Reveal>
        <Cta
          variant="primary-subtle"
          theme="light"
          hasArrow
          href={ROUTES.startProject}
        >
          Start a project
        </Cta>
      </Reveal>
    </section>
  );
}
