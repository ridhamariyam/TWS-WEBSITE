import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon, MagnifyingGlassIcon } from "@/components/icons";

/*
 * Domain search.
 *
 * This section flips theme at 1020px: white with a black-on-translucent field
 * below, black with a white-on-translucent field above. The input's padding is
 * done with a transparent 20px/56px/20px/64px border so the icons can sit inside
 * the field without a wrapper — that is the site's own trick, kept as-is.
 */
export function YourDomainSection() {
  return (
    <section
      id="your-domain"
      className="flex flex-col items-center bg-primitive-white px-4 pb-20 text-primitive-black bp744:px-(--grid-gutter-width) bp1020:bg-primitive-black bp1020:pb-30 bp1020:text-primitive-white"
    >
      <Reveal
        as="h2"
        className="type-subtitle1 mb-14 w-[calc((var(--grid-column-width)*10)+(var(--grid-gutter-width)*9))] text-center bp744:w-[calc((var(--grid-column-width)*6)+(var(--grid-gutter-width)*5))] bp1440:w-[calc((var(--grid-column-width)*4)+(var(--grid-gutter-width)*3))]"
      >
        Find the perfect domain for your website
      </Reveal>

      <Reveal className="relative mb-10 flex h-[62px] w-[calc((var(--grid-column-width)*12)+(var(--grid-gutter-width)*11))] items-center justify-center px-6 py-5 leading-[0] bp744:w-[calc((var(--grid-column-width)*8)+(var(--grid-gutter-width)*7))] bp1020:w-[calc((var(--grid-column-width)*6)+(var(--grid-gutter-width)*5))]">
        <form
          action="https://domains.squarespace.com/domain-search"
          method="get"
          target="_blank"
          className="contents"
        >
          <div className="pointer-events-none absolute left-0 flex h-full items-start justify-center pt-5 pl-6">
            <MagnifyingGlassIcon width={22} height={22} />
          </div>
          <input
            name="query"
            type="text"
            required
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Start your search here"
            className="type-body absolute h-[62px] w-full overflow-hidden rounded-lg border-[20px_56px_20px_64px] border-solid border-transparent bg-black/5 p-0 leading-[140%] text-primitive-black placeholder:text-gray-500 bp1020:bg-white/20 bp1020:text-primitive-white"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-0 flex h-full cursor-pointer items-end justify-center pr-6 pb-5"
          >
            <ArrowRightIcon width={22} height={22} />
          </button>
        </form>
      </Reveal>

      <Reveal
        as="p"
        className="type-footnote flex w-[calc((var(--grid-column-width)*6)+(var(--grid-gutter-width)*5))] flex-wrap justify-center gap-1 text-gray-800 bp744:text-center bp1020:text-primitive-white"
      >
        Already have a domain?{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://domains.squarespace.com/transfer-a-domain"
          className="cta cta--inline cta--has-inline-underline"
        >
          Transfer your domain
        </a>
      </Reveal>
    </section>
  );
}
