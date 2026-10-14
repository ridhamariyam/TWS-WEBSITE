import Image from "next/image";
import Link from "next/link";
import { FadedLines } from "@/components/ui/faded-lines";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/reveal";
import { ROUTES } from "@/lib/site-links";
import { TEAM, type TeamMember } from "@/lib/team-content";
import { cn } from "@/lib/cn";
import wave from "./wave.module.css";
import styles from "./founder-bio-section.module.css";

/*
 * The founders, after the founder bio on waverunmedia.com/about: the portrait
 * held at the left while the bio scrolls past it; the name and role across
 * the top, links at the top right, the bio beneath in two columns' width.
 * One block per person. A profile link shows only once its URL is filled in.
 */
export function FounderBioSection() {
  return (
    <section className={cn(wave.section, wave.narrow)} aria-labelledby="founders-title">
      <Reveal>
        <h2 id="founders-title" className={cn(wave.label, styles.heading)}>
          Founders
        </h2>
      </Reveal>
      <div className={styles.people}>
        {TEAM.map((member) => (
          <Founder key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}

function Founder({ member }: { member: TeamMember }) {
  const profiles = [
    { label: "LinkedIn", href: member.linkedin, Icon: LinkedInIcon },
    { label: "Instagram", href: member.instagram, Icon: InstagramIcon },
  ].filter((profile) => profile.href);

  return (
    <article className={styles.content}>
      {member.portrait && (
        <Reveal className={styles.image}>
          <Image src={member.portrait} alt={member.name} fill sizes="(min-width: 768px) 30vw, 100vw" />
        </Reveal>
      )}
      <div className={styles.name}>
        <FadedLines as="h3" lines={[member.name]} className={wave.title56} />
        <p className={styles.role}>{member.role}</p>
      </div>
      <Reveal className={styles.socials}>
        {profiles.map(({ label, href, Icon }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={styles.social}>
            <Icon aria-hidden="true" />
            {label}
          </a>
        ))}
        <Link href={ROUTES.contact} className={styles.social}>
          <span className={styles.dot} aria-hidden="true" />
          Contact
        </Link>
      </Reveal>
      <Reveal className={styles.text}>
        {member.bio.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className={wave.text}>
            {paragraph}
          </p>
        ))}
      </Reveal>
    </article>
  );
}
