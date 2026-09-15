import Image from "next/image";
import Link from "next/link";
import type { ParallaxFrame } from "@/components/motion/parallax";
import type { Project } from "@/types/content";
import { ProjectCardParallax } from "./project-card-parallax";

type ProjectCardProps = {
  project: Project;
  /** Parallax offset when the card enters from the viewport bottom. */
  from: ParallaxFrame;
  /** Parallax offset when the card leaves through the viewport top. */
  to: ParallaxFrame;
  className?: string;
};

/**
 * Portfolio tile: greyscale image that zooms and regains colour on hover, with a
 * centred "title — category" caption. The whole card is one link and the hover target.
 */
export function ProjectCard({ project, from, to, className }: ProjectCardProps) {
  const { title, category, href, image } = project;

  return (
    <ProjectCardParallax from={from} to={to} className={className}>
      <Link
        href={href}
        className="group block rounded-[6px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
      >
        <div className="relative aspect-[800/635] overflow-hidden rounded-[6px] bg-[rgb(130,130,130)]">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 25vw"
            className="block h-auto w-full saturate-0 transition-[transform,scale,filter] duration-400 ease-[cubic-bezier(0.37,0,0.63,1)] group-hover:scale-110 group-hover:saturate-100"
          />
        </div>
        <div className="flex items-center justify-center py-[30px] text-center max-md:py-[20px]">
          <span className="text-[17px] leading-[32px] font-semibold text-ink">{title}</span>
          <span aria-hidden="true" className="mx-[10px] inline-block h-px w-[10px] shrink-0 bg-[#a8a8a8]" />
          <span className="text-[17px] leading-[32px] text-body">{category}</span>
        </div>
      </Link>
    </ProjectCardParallax>
  );
}
