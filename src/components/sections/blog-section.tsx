import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { DotLink } from "@/components/ui/dot-link";
import { blog } from "@/lib/content";
import { BlogCard } from "./blog-card";

/**
 * Latest journal posts: heading + DotLink row over a card grid.
 * Desktop: 4 columns · tablet (<992): 2 columns · mobile (<768): 1 column with a centred header.
 * Cards fade/slide in from -15px, staggered 300ms, once the list enters the viewport.
 */
export function BlogSection() {
  return (
    <section id="blog">
      <div className="mx-auto flex w-full max-w-[1220px] flex-col pt-[110px] max-lg:max-w-[720px] max-lg:pt-[75px] max-md:max-w-none max-md:pt-[50px]">
        <div className="mb-[61px] flex items-center max-lg:mb-[36px] max-md:mb-[19.5px] max-md:flex-col">
          <div className="w-1/2 px-[15px] max-md:mb-[20px] max-md:w-full max-md:text-center">
            <h2 className="text-[60px] leading-[60px] font-semibold tracking-[-3px] text-ink max-lg:text-[52.5px] max-lg:leading-[52.5px] max-md:text-[41.26px] max-md:leading-[41.26px]">
              {blog.heading}
            </h2>
          </div>
          <div className="flex w-1/2 justify-end px-[15px] max-md:w-full max-md:justify-center">
            <DotLink href={blog.link.href} label={blog.link.label} />
          </div>
        </div>

        <RevealGroup as="ul" className="grid grid-cols-4 max-lg:grid-cols-2 max-md:grid-cols-1">
          {blog.posts.map((post, i) => (
            <li key={post.title} className="mb-[15px] px-[15px] max-lg:mb-[30px]">
              <Reveal from={{ y: -15 }} duration={800} delay={200 + i * 300}>
                <BlogCard post={post} />
              </Reveal>
            </li>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
