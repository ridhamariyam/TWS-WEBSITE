import { ArrowUpRightIcon } from "@/components/icons";
import { Reveal } from "@/components/motion/reveal";
import { RotatingBadge } from "@/components/ui/rotating-badge";
import { cta } from "@/lib/content";
import { cn } from "@/lib/utils";

/** Shared type for both giant words; colour is added per word. */
const WORD_CLASS =
  "block text-[350px] leading-[350px] font-semibold tracking-[-20px] whitespace-nowrap max-lg:text-[148.75px] max-lg:leading-[148.75px] max-lg:tracking-[-10px] max-md:text-[75px] max-md:leading-[75px] max-md:tracking-[-4px]";

/** Lime disc with an arrow, sized relative to the 295px reference badge. */
function BadgeCentre({ disc, icon }: { disc: number; icon: number }) {
  return (
    <span className="flex items-center justify-center rounded-full bg-lime" style={{ width: disc, height: disc }}>
      <ArrowUpRightIcon className="text-ink" style={{ width: icon, height: icon }} />
    </span>
  );
}

/**
 * Closing call to action: two giant words side by side, dark then lime, each
 * bleeding out of the section (the dark one to the left, the lime one to the
 * right), with a rotating badge straddling the gap between them.
 *
 * The badge is rendered at two fixed sizes (295px desktop, 200px tablet) and
 * toggled by breakpoint, because RotatingBadge takes its diameter in px.
 * It is hidden below 768px, where the words stack and centre.
 */
export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1220px] pt-[85px] pb-[57.6px] max-xl:max-w-[960px] max-lg:max-w-[720px] max-lg:pt-[70px] max-lg:pb-[40px] max-md:max-w-none max-md:flex-col max-md:pt-[30px]">
        <div className="flex w-5/12 justify-end px-[15px] max-lg:w-[300px] max-md:w-full max-md:justify-center">
          {/* Right offset keeps the reference gap between the words (word box ends 73px / 28px inside the column). */}
          <Reveal from={{}} duration={500} delay={200} className="mr-[73px] shrink-0 max-lg:mr-[28px] max-md:mr-0">
            <span className={cn(WORD_CLASS, "text-ink")}>{cta.darkWord}</span>
          </Reveal>
        </div>

        <div className="relative flex w-7/12 justify-start px-[15px] max-lg:w-auto max-lg:flex-1 max-md:w-full max-md:justify-center">
          <Reveal from={{}} duration={500} delay={200} className="shrink-0">
            <span className={cn(WORD_CLASS, "text-lime")}>{cta.limeWord}</span>
          </Reveal>

          <div className="absolute top-[-80px] left-[-125px] z-[1] max-lg:top-[-90px] max-lg:left-[-95px] max-md:hidden">
            <Reveal from={{ scale: 0.5 }} duration={800} delay={200}>
              <RotatingBadge size={295} tone="light" ringText={cta.badgeText} className="max-lg:hidden">
                <BadgeCentre disc={100} icon={44} />
              </RotatingBadge>
              <RotatingBadge size={200} tone="light" ringText={cta.badgeText} className="hidden max-lg:block">
                <BadgeCentre disc={68} icon={30} />
              </RotatingBadge>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
