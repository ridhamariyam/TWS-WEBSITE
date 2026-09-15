import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/content";

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

/**
 * Journal teaser: greyscale image (zooms to 1.07 on card hover), an uppercase
 * "category • date" meta row and a title link that fades to nav-muted on hover.
 */
export function BlogCard({ post, className }: BlogCardProps) {
  const { category, date, title, href, image } = post;

  return (
    <article className={cn("group", className)}>
      <div className="relative aspect-[597/430] overflow-hidden rounded-[6px]">
        {/* Duplicate of the title link: kept out of the tab order and accessibility tree. */}
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block h-full w-full">
          <Image
            src={image.src}
            alt=""
            width={image.width}
            height={image.height}
            sizes="(max-width: 767px) 100vw, (max-width: 991px) 330px, 275px"
            className="block h-full w-full object-cover grayscale transition-transform duration-600 ease-[cubic-bezier(0.37,0,0.63,1)] group-hover:scale-[1.07]"
          />
        </Link>
      </div>

      <div className="py-[30px] max-md:py-[20px]">
        <div className="mb-[10px] flex flex-wrap items-center uppercase">
          <Link
            href={href}
            className="text-[14px] leading-[32px] font-bold text-ink transition-colors duration-300 ease-in-out"
          >
            {category}
          </Link>
          <span
            aria-hidden="true"
            className="mx-[10px] inline-block h-[4px] w-[4px] shrink-0 rounded-full bg-[rgba(111,112,113,0.7)]"
          />
          <span className="text-[14px] leading-[32px] font-medium text-body">{date}</span>
        </div>
        <Link
          href={href}
          className="block max-w-[95%] text-[17px] leading-[28px] font-semibold text-ink transition-colors duration-300 ease-in-out hover:text-nav-muted max-md:max-w-full"
        >
          {title}
        </Link>
      </div>
    </article>
  );
}
