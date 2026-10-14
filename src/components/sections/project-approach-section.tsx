import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/sections/section-header";
import sectionStyles from "./studio-sections.module.css";
import { Cta } from "@/components/ui/cta";
import { aboutHref } from "@/lib/site-links";

const PRINCIPLES = [
  {
    title: "Clear direction",
    body: "Start with the people using your site and the job it needs to do. Give every page a purpose and every journey a clear next step.",
  },
  {
    title: "Thoughtful interactions",
    body: "Bring character to the details. Use typography, movement and interaction to make the experience feel like your business.",
  },
  {
    title: "Solid foundations",
    body: "Build for real devices and real people. Treat performance, accessibility and maintainability as part of the design.",
  },
] as const;

/*
 * "Every detail should do a job": the studio's three principles, set as
 * chapters on hairlines under the shared section header, so this headline
 * sits on the same columns and at the same size as every other one.
 */
export function ProjectApproachSection() {
  return (
    <section
      id="project-approach"
      aria-labelledby="project-approach-heading"
      className={sectionStyles.section}
    >
      <div className={sectionStyles.inner}>
        <SectionHeader
          id="project-approach-heading"
          badge="Our approach"
          title="Every detail should do a job"
        />
        <Reveal className="mt-16 grid gap-12 bp1020:mt-24 bp1020:grid-cols-3 bp1020:gap-(--grid-gutter-width)">
          {PRINCIPLES.map((principle, index) => (
            <article key={principle.title} className="border-t border-black/15 pt-6">
              <p className="type-eyebrow text-gray-500">0{index + 1}</p>
              <h3 className="type-subtitle2 mt-10 bp1020:mt-16">{principle.title}</h3>
              <p className="type-body mt-5 max-w-[36ch] text-gray-500">{principle.body}</p>
            </article>
          ))}
        </Reveal>
        <div className="mt-16 bp1020:mt-20">
          <Cta variant="secondary" hasArrow href={aboutHref("process")}>
            How we work
          </Cta>
        </div>
      </div>
    </section>
  );
}
