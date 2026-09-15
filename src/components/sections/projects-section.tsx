import { Parallax, type ParallaxFrame } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { HeartIcon } from "@/components/icons";
import { DotLink } from "@/components/ui/dot-link";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { projects } from "@/lib/content";
import { ProjectCard } from "./project-card";

/**
 * Staggered vertical parallax per card: rows alternate ±40px (first row of four)
 * and ±20px (second row), with neighbouring cards moving in opposite directions.
 */
function cardOffsets(index: number): { from: ParallaxFrame; to: ParallaxFrame } {
  const amplitude = index % 8 < 4 ? 40 : 20;
  const y = index % 2 === 0 ? amplitude : -amplitude;
  return { from: { y }, to: { y: -y } };
}

/**
 * Projects grid under a giant lime word with a rotating badge.
 * Desktop: 4 columns · tablet (<992): 2 columns · mobile (<768): 1 column, no word/badge, no card parallax.
 */
export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative px-[2%] max-lg:px-[4%] max-lg:pt-[7%] max-md:px-[15px] max-md:pt-0"
    >
      <div className="mb-[6%] px-[15px] max-md:mb-[30px] max-md:px-0">
        <div className="mx-auto flex w-full max-w-[1220px] items-end max-lg:max-w-[720px] max-md:max-w-none">
          <div className="relative w-3/4 px-[15px] max-lg:w-2/3 max-md:hidden">
            <Parallax className="relative -ml-[360px] px-[15px] max-lg:-ml-[384px]" from={{ x: 0 }} to={{ x: -100 }}>
              <h2 className="text-[350px] leading-[350px] font-semibold tracking-[-20px] whitespace-nowrap text-lime max-lg:text-[218.75px] max-lg:leading-[218.75px] max-lg:tracking-[-15px]">
                {projects.backgroundWord}
              </h2>
              <Reveal
                from={{ scale: 0.7 }}
                duration={600}
                className="absolute top-[-10px] right-[-85px] max-lg:top-[-75px] max-lg:right-[-100px]"
              >
                <RotatingBadge size={190} tone="dark" ringText={projects.badgeText}>
                  <HeartIcon className="h-[34px] w-[34px] text-lime" />
                </RotatingBadge>
              </Reveal>
            </Parallax>
          </div>
          <div className="relative w-1/4 px-[15px] text-right max-lg:w-1/3 max-md:w-full max-md:px-0 max-md:text-left">
            <div className="mt-[30px] max-lg:mt-0 max-lg:mb-[30px] max-md:mb-0">
              <DotLink href={projects.link.href} label={projects.link.label} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-[15px] max-lg:px-0">
        <ul className="grid grid-cols-4 max-lg:-mx-[15px] max-lg:grid-cols-2 max-md:grid-cols-1">
          {projects.items.map((project, i) => {
            const { from, to } = cardOffsets(i);
            return (
              <li key={project.title} className="mb-[30px] px-[15px]">
                <ProjectCard project={project} from={from} to={to} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
