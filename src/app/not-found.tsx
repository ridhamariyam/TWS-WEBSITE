import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PageShell } from "@/components/layout/page-shell";
import { Cta } from "@/components/ui/cta";
import { ROUTES } from "@/lib/site-links";

export const metadata: Metadata = {
  title: "Page not found",
};

const DESTINATIONS = [
  { label: "Services", href: ROUTES.services },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
];

/**
 * Before launch only the holding page is live, so a missing page says so in
 * the holding page's own look and sends the visitor back to it. See
 * `SITE_LAUNCHED` in next.config.ts.
 */
function HoldingNotFound() {
  return (
    <main className="grid min-h-svh place-items-center bg-[#050507] px-4 text-center text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.08em] text-white/45">404</p>
        <h1 className="mt-4 font-[family-name:var(--font-wordmark)] text-[clamp(2rem,6vw,4.5rem)] leading-none font-extrabold uppercase">
          Nothing here yet
        </h1>
        <p className="mt-5 text-sm text-white/60">Our new website is launching soon.</p>
        <Link
          href={ROUTES.home}
          className="mt-8 inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 text-sm font-medium transition-colors hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-lime)]"
        >
          Back to TWS
        </Link>
      </div>
    </main>
  );
}

/** Any unmatched URL, with a 404 status. */
export default function NotFound() {
  if (process.env.SITE_LAUNCHED !== "true") return <HoldingNotFound />;

  return (
    <PageShell>
      <div className="min-h-[70svh]">
        <PageIntro eyebrow="404" title="This page doesn't exist.">
          <p>
            The link may be out of date, or the address mistyped. Everything
            the studio has is one of these:
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {DESTINATIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="type-body cta cta--inline cta--has-inline-underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Cta variant="primary-subtle" hasArrow href={ROUTES.home}>
              Back to the homepage
            </Cta>
          </div>
        </PageIntro>
      </div>
    </PageShell>
  );
}
