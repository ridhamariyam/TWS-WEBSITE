import type { Metadata } from "next";
import { FlowLinks } from "@/components/flow/flow-links";
import { FlowOutro } from "@/components/flow/flow-outro";
import { FlowPage } from "@/components/flow/flow-page";
import { PageHero } from "@/components/flow/page-hero";
import { Statements } from "@/components/flow/statements";
import { SOCIAL_PROFILES } from "@/lib/footer-content";
import { pageMetadata } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_TEL,
  CONTACT_WHATSAPP,
  JOIN_TEAM_MAILTO,
  MESSAGE_MAILTO,
  PARTNER_MAILTO,
  ROUTES,
} from "@/lib/site-links";
import { STUDIO_PLACE } from "@/lib/studio-map";

export const metadata: Metadata = pageMetadata({
  title: "Let's talk",
  description:
    "Start a project, introduce yourself to the TWS team, or explore a partnership. Contact our studio in Calicut by email, phone, or WhatsApp.",
  path: ROUTES.contact,
});

/*
 * "How do I start?" — answered in the hero: one statement and the form. Then,
 * on the homepage's flow, a few lines of kinetic type, every direct line as
 * large rows, the two other conversations the studio has, and where it is.
 * The form itself lives on /contact/start-a-project.
 */
export default function ContactPage() {
  return (
    <FlowPage>
      <PageHero
        eyebrow="Contact"
        title="Let's build something"
        muted="worth remembering."
        lead="Five short questions and we'll take it from there — or skip the form and reach us directly below."
        footRight={`${CONTACT_EMAIL} · ${CONTACT_PHONE}`}
        image="professional-services"
        actions={[
          { label: "WhatsApp us", href: CONTACT_WHATSAPP },
          { label: "Start a project", href: ROUTES.startProject, solid: true },
        ]}
      />
      <Statements
        title="Start with a conversation"
        lines={[
          { parts: ["Every project starts with", { text: "a conversation.", serif: true }] },
          { parts: ["Tell us what the business", { text: "is trying to become.", serif: true }], white: true },
        ]}
      />
      <FlowLinks
        eyebrow="Direct"
        title="Reach us directly"
        rows={[
          { label: "Email", title: CONTACT_EMAIL, href: MESSAGE_MAILTO },
          { label: "Phone", title: CONTACT_PHONE, href: CONTACT_TEL },
          { label: "WhatsApp", title: "Message us on WhatsApp", href: CONTACT_WHATSAPP, external: true },
        ]}
      />
      <FlowLinks
        eyebrow="Other conversations"
        rows={[
          {
            label: "Join the team",
            title: "Introduce yourself",
            note: "Your skills, your work, and how you'd like to contribute to TWS.",
            href: JOIN_TEAM_MAILTO,
          },
          {
            label: "Partnerships",
            title: "Discuss a partnership",
            note: "Your business, and the collaboration you have in mind.",
            href: PARTNER_MAILTO,
          },
        ]}
      />
      <FlowLinks
        eyebrow="Studio"
        rows={[
          { label: "Where we are", title: STUDIO_PLACE.label, href: STUDIO_PLACE.href, external: true },
          ...SOCIAL_PROFILES.map(({ name, href }) => ({ label: "Follow", title: name, href, external: true })),
        ]}
      />
      <FlowOutro />
    </FlowPage>
  );
}
