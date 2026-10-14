import { PageIntro } from "@/components/layout/page-shell";
import { Reveal } from "@/components/ui/reveal";

/*
 * The top of /about, on the same pattern as /services: the shared page intro
 * (label, display headline, one line), then who the studio is — label on the
 * left, the studio in one line and two short paragraphs on the right.
 */
export function AboutOpening() {
  return (
    <>
      <PageIntro eyebrow="About" title="Small studio. Serious work.">
        The studio, the people in it, and the way we work.
      </PageIntro>

      <section className="page-gutter border-t border-white/10 py-14 bp1020:py-24">
        <Reveal className="bp1020:grid bp1020:grid-cols-12 bp1020:gap-x-(--grid-gutter-width)">
          <p className="type-eyebrow mb-6 text-gray-500 bp1020:col-span-3 bp1020:pt-[0.6em]">
            Who we are
          </p>
          <div className="bp1020:col-span-9">
            <p className="type-subtitle2 max-w-[28ch] text-balance">
              A digital product studio for websites that have a job to do.
            </p>
            <div className="mt-8 grid max-w-[880px] gap-6 bp744:grid-cols-2 bp744:gap-x-(--grid-gutter-width)">
              <p className="type-body text-gray-200">
                Strategy, storytelling, UI/UX, motion and engineering, under one
                roof — so the thinking and the building never drift apart.
              </p>
              <p className="type-body text-gray-200">
                We start with why: what the business wants to become, and where
                people drop off. Then we design and build around the answers.
              </p>
            </div>
            <p className="type-body mt-8 text-gray-500">Have something in mind? Let&rsquo;s talk.</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
