import type { Metadata } from "next";
import { ComingSoonIntro } from "@/components/coming-soon/coming-soon-intro";
import { TwsLogo } from "@/components/ui/tws-logo";
import { ArrowRightIcon, InstagramIcon, LinkedInIcon, WhatsAppIcon } from "@/components/ui/icons";
import { SOCIAL_PROFILES } from "@/lib/footer-content";
import { CONTACT_EMAIL, CONTACT_MAILTO, CONTACT_WHATSAPP } from "@/lib/site-links";
import { STUDIO_LOCATION } from "@/lib/studio-content";
import { organizationJsonLd, pageMetadata } from "@/lib/seo";
import styles from "./coming-soon.module.css";

/**
 * The holding page, served at `/` until launch (see `SITE_LAUNCHED` in
 * next.config.ts). One screen, set as a poster on black, carrying the last
 * two scenes of the launch script (ComingSoonIntro plays the first seven
 * over it):
 *
 *   top      the mark, and where the studio is;
 *   centre   "Launching soon" across the width, over a ring of
 *            blue light;
 *   bottom   the email on the left, the two ways in and the copyright in
 *            the middle, the social profiles on the right.
 *
 * No launch date and no countdown: there is no date to promise yet. The
 * page's own entrance waits for the intro.
 */
const TITLE = "TWS — The Web Studio · Launching soon";

export const metadata: Metadata = {
  ...pageMetadata({
    title: TITLE,
    documentTitle: TITLE,
    description:
      "TWS — The Web Studio. Designed Beyond Ordinary. Our new digital home is launching soon; have a project in mind? Get in touch today.",
    path: "/",
  }),
  // This route sits under the root layout, so skip its " — TWS" template.
  title: { absolute: TITLE },
};

const SOCIAL_ICONS: Record<string, typeof InstagramIcon> = {
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
};

export default function ComingSoon() {
  return (
    <>
      <ComingSoonIntro />
      <main className={styles.page}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />

        <header className={styles.top}>
          <TwsLogo height={22} alt="TWS — The Web Studio" />
          <p className={styles.location}>{STUDIO_LOCATION}</p>
        </header>

        <section className={styles.centre} aria-labelledby="coming-soon-title">
          {/* A ring of blue light behind the headline. Decorative. */}
          <div className={styles.halo} aria-hidden="true">
            <span className={styles.ringGlow} />
            <span className={styles.ring} />
          </div>

          <h1 id="coming-soon-title" className={styles.title}>
            <span className={styles.titleLine}>Launching</span>{" "}
            <span className={styles.titleLine}>soon</span>
          </h1>
        </section>

        <footer className={styles.bottom}>
          <dl className={styles.email}>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </dd>
          </dl>

          <div className={styles.middle}>
            <div className={styles.actions}>
              <a href={CONTACT_MAILTO} className={styles.primary}>
                Get in touch
                <ArrowRightIcon width={16} height={16} aria-hidden="true" />
              </a>
              <a
                href={CONTACT_WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondary}
              >
                <WhatsAppIcon width={18} height={18} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            </div>
            <p className={styles.copyright}>&copy; 2026 The Web Studio. All rights reserved.</p>
          </div>

          <ul className={styles.social}>
            {SOCIAL_PROFILES.map(({ name, href }) => {
              const Icon = SOCIAL_ICONS[name];
              return (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`TWS on ${name} (opens in a new tab)`}
                  >
                    {Icon ? <Icon width={16} height={16} aria-hidden="true" /> : name}
                  </a>
                </li>
              );
            })}
          </ul>
        </footer>
      </main>
    </>
  );
}
