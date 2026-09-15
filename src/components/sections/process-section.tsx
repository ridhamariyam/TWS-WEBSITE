import { Reveal, RevealGroup } from "@/components/motion/reveal";
import { processSteps } from "@/lib/content";

/**
 * Three numbered process steps directly below the About section.
 * Desktop: 3 columns · tablet (<992): 2-column wrap · mobile (<768): stacked.
 */
export function ProcessSection() {
  return (
    <section id="expertise">
      <div className="mx-auto w-full max-w-[1220px] pb-[80px] max-lg:max-w-[720px] max-md:max-w-none max-md:pb-[50px]">
        <RevealGroup
          as="ol"
          className="flex max-lg:flex-wrap max-lg:gap-y-[50px] max-md:flex-col max-md:gap-y-[60px]"
        >
          {processSteps.map((step, i) => (
            <Reveal
              key={step.number}
              as="li"
              from={{ y: 40 }}
              duration={800}
              delay={200 + i * 300}
              className="group relative flex w-1/3 flex-col px-[61px] pt-[48.8px] max-lg:w-1/2 max-lg:px-[36px] max-lg:pt-[28.8px] max-md:w-full max-md:px-[30px] max-md:pt-[35px]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-[-15px] left-[25px] text-[90px] leading-[90px] font-bold text-transparent transition-transform duration-500 ease-[cubic-bezier(0.5,1,0.89,1)] [-webkit-text-stroke:1px_#e4e4e4] group-hover:translate-x-[20px] group-hover:scale-110 max-lg:top-[-5px] max-lg:left-[15px] max-lg:text-[78.75px] max-lg:leading-[78.75px] max-md:text-[67.5px] max-md:leading-[67.5px]"
              >
                {step.number}
              </span>
              <h3 className="relative mb-[5px] text-[19px] leading-[32px] font-semibold tracking-normal text-ink">
                {step.title}
              </h3>
              <p className="relative w-[90%] text-[17px] leading-[30px] text-body max-lg:w-full">
                {step.description}
              </p>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
