import type { Metadata } from "next";
import { WhatsAppIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/app/contact/start-a-project/contact-form";
import { PageIntro, PageSection, PageShell } from "@/components/layout/page-shell";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  CONTACT_PHONE,
  CONTACT_TEL,
  CONTACT_WHATSAPP,
  ROUTES,
} from "@/lib/site-links";

export const metadata: Metadata = pageMetadata({
  title: "Start a project",
  description:
    "Tell TWS what you're building, improving or trying to solve. A short brief — what you need, where you're starting from, budget and timing — or reach us directly on +91 73567 58078.",
  path: ROUTES.startProject,
});

/*
 * The enquiry, on its own page so /contact stays a hub.
 *
 * A short intro, then the guided form in the right-hand columns with a quiet
 * note beside it saying what happens after you send. The number and the
 * address are on the page in full regardless, so nobody has to fill in a
 * form to reach us.
 */

const NEXT_STEPS = [
  "We read it ourselves — no bots, no sales queue.",
  "We reply to the email you give us, with questions or a first view.",
  "If it fits, a short call to shape it. Nothing is a commitment until then.",
];

export default function StartAProjectPage() {
  return (
    <PageShell>
      <PageIntro eyebrow="Start a project" title="Tell us what you’re building.">
        A new business, a site that isn&rsquo;t doing its job, an idea you
        haven&rsquo;t shaped yet — all of it is a fine place to start. Five
        short steps.
      </PageIntro>

      <section
        aria-label="The brief"
        className="page-gutter border-t border-white/10 pt-14 pb-24 bp1020:grid bp1020:grid-cols-12 bp1020:gap-x-(--grid-gutter-width) bp1020:pt-20 bp1020:pb-36"
      >
        <aside className="hidden bp1020:col-span-3 bp1020:block">
          <div className="sticky top-[calc(var(--global-nav-height)+48px)]">
            <p className="type-eyebrow text-white/55">What happens next</p>
            <ol className="mt-6 grid gap-5">
              {NEXT_STEPS.map((line, i) => (
                <li key={line} className="type-footnote grid grid-cols-[2rem_1fr] text-white/55">
                  <span className="text-white/85">0{i + 1}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
        <div className="bp1020:col-span-8 bp1020:col-start-5">
          <ContactForm />
        </div>
      </section>

      <PageSection eyebrow="Rather not fill in a form?" title="Reach us directly.">
        <dl className="grid gap-x-(--grid-gutter-width) bp744:grid-cols-2">
          <div className="border-t border-white/10 py-6">
            <dt className="type-eyebrow text-white/55">Phone / WhatsApp</dt>
            <dd className="type-subtitle2 mt-4">
              <a href={CONTACT_TEL} className="cta cta--inline cta--has-inline-underline">
                {CONTACT_PHONE}
              </a>
            </dd>
            <dd className="type-footnote mt-4 text-white/55">
              <a
                href={CONTACT_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="cta cta--inline cta--has-inline-underline"
              >
                <span className="inline-flex items-center gap-2">
                  <WhatsAppIcon className="shrink-0" width={16} height={16} />
                  Message us on WhatsApp
                </span>
              </a>
            </dd>
          </div>
          <div className="border-t border-white/10 py-6">
            <dt className="type-eyebrow text-white/55">Email</dt>
            <dd className="type-subtitle2 mt-4">
              <a href={CONTACT_MAILTO} className="cta cta--inline cta--has-inline-underline break-words">
                {CONTACT_EMAIL}
              </a>
            </dd>
            <dd className="type-footnote mt-4 text-white/55">A few lines is plenty.</dd>
          </div>
        </dl>
      </PageSection>
    </PageShell>
  );
}
