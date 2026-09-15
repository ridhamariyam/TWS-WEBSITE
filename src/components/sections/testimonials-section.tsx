import Image from "next/image";
import { StarIcon } from "@/components/icons";
import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { testimonials } from "@/lib/content";
import { TestimonialCarousel } from "./testimonial-carousel";

/**
 * Dark testimonials band: rating + arrows on the left, one-up quote carousel
 * on the right, then a hairline and a row of client logos.
 * Desktop: two halves · tablet (<992): stacked, logos 3 + 2 · mobile (<768): logos in one column.
 */
export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${testimonials.background})` }}
      />

      <div className="relative mx-auto flex w-full max-w-[1220px] flex-col pt-[110px] pb-[57.6px] max-lg:max-w-[720px] max-lg:pt-[75px] max-lg:pb-[75px] max-md:max-w-none max-md:pt-[50px] max-md:pb-[50px]">
        <Reveal from={{ x: 15 }} duration={800} delay={200} className="px-[15px]">
          <div className="relative flex min-h-[220px] max-lg:min-h-0 max-lg:flex-col">
            <div className="w-1/2 pr-[15px] max-lg:w-full max-lg:pr-0">
              <div className="mb-[10px] flex items-center">
                <div className="mr-[10px] text-[80px] leading-[80px] font-bold text-white max-lg:text-[70px] max-lg:leading-[70px] max-md:text-[60px] max-md:leading-[60px]">
                  {testimonials.rating}
                </div>
                <div className="w-[120px] text-center">
                  <div className="rounded-[30px] bg-lime px-[20px] pt-[6px] pb-[5px]">
                    <div className="flex h-[20px] items-center justify-center text-ink">
                      {Array.from({ length: 5 }, (_, i) => (
                        <StarIcon key={i} className="size-4" />
                      ))}
                    </div>
                  </div>
                  <div className="text-[13px] leading-[32px] font-medium text-white uppercase">
                    {testimonials.ratingLabel}
                  </div>
                </div>
              </div>
            </div>

            <TestimonialCarousel items={testimonials.items} />
          </div>
        </Reveal>

        <div
          aria-hidden="true"
          className="mx-[15px] mt-[107px] mb-[71.4px] h-px bg-white/10 max-lg:mt-[34.5px] max-lg:mb-[41.4px] max-md:mt-[30px] max-md:mb-[30px]"
        />

        <RevealGroup className="grid grid-cols-5 max-lg:flex max-lg:flex-wrap max-lg:justify-center max-lg:gap-y-[40px] max-md:flex-col">
          {testimonials.logos.map((logo, i) => (
            <Reveal
              key={logo.src}
              from={{ scale: 1.1 }}
              duration={800}
              delay={200 + i * 300}
              className="flex justify-center px-[15px] max-lg:w-1/3 max-md:w-full"
            >
              <a href="#" aria-label={logo.alt} className="block">
                <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
              </a>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
