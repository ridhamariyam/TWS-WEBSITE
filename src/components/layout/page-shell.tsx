import { StudioNav } from "@/components/layout/studio-nav";
import { StudioFooter } from "@/components/layout/studio-footer";
import { RevealFooter } from "@/components/layout/reveal-footer";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

/*
 * The frame and the two blocks every inner page is made of. Nothing here is
 * new design: it reuses the homepage's header, footer, title step and hairline.
 */

/**
 * Header, a `#content` main (the skip link's target), and the footer revealed
 * from under it as the page ends (see RevealFooter).
 */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StudioNav />
      <RevealFooter footer={<StudioFooter />}>{children}</RevealFooter>
    </>
  );
}

/**
 * The top of an inner page, on the homepage's section pattern: the label in
 * the first three columns, the h1 at the display step and its lead in the
 * other nine, over a hairline.
 */
export function PageIntro({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** A call to action under the lead, when the page has one obvious next step. */
  actions?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Reveal className="page-gutter grid gap-6 pt-[calc(var(--global-nav-height)+72px)] pb-16 bp1020:grid-cols-12 bp1020:gap-x-(--grid-gutter-width) bp1020:pt-[calc(var(--global-nav-height)+128px)] bp1020:pb-28">
        <p className="type-eyebrow pt-[0.6em] text-gray-500 bp1020:col-span-3">{eyebrow}</p>
        <div className="bp1020:col-span-9">
          <h1 className="type-display max-w-[16ch]">{title}</h1>
          {children ? (
            <div className="type-body-medium mt-10 max-w-[46ch] text-gray-500 bp1020:mt-14">
              {children}
            </div>
          ) : null}
          {actions ? <div className="mt-10 flex flex-wrap items-center gap-6 bp1020:mt-12">{actions}</div> : null}
        </div>
      </Reveal>
    </div>
  );
}

/**
 * One titled section, on the 12 columns: the title in the first four, the
 * content in the other eight. `id` is the navigation's anchor, so it carries
 * `scroll-mt` to clear the fixed header.
 */
export function PageSection({
  id,
  eyebrow,
  title,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "page-gutter scroll-mt-(--global-nav-height) border-t border-black/10 py-16 bp1020:py-24",
        className,
      )}
    >
      <div className="grid gap-10 bp1020:grid-cols-12 bp1020:gap-x-(--grid-gutter-width)">
        <Reveal className="bp1020:col-span-4">
          {eyebrow ? (
            <p className="type-eyebrow mb-5 text-gray-500">{eyebrow}</p>
          ) : null}
          <h2 className="type-subtitle1 max-w-[14ch] text-balance">{title}</h2>
        </Reveal>
        <div className="bp1020:col-span-8">{children}</div>
      </div>
    </section>
  );
}
