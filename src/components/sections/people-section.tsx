import Image from "next/image";
import { Reveal } from "@/components/ui/reveal";
import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";
import { TEAM, type TeamMember } from "@/lib/team-content";
import styles from "./people-section.module.css";

/*
 * The people on /about, after the opened person rows on artistudyo.com/about:
 * the portrait at the left, then name, role and links, then the bio running
 * to the right edge. Stacks on small screens.
 */

export function PeopleSection() {
  return (
    <section className="page-gutter pb-24 bp1020:pb-40" aria-labelledby="people-title">
      <Reveal className="grid gap-6 bp1020:grid-cols-12 bp1020:gap-x-(--grid-gutter-width)">
        <p className="type-eyebrow text-gray-500 bp1020:col-span-3 bp1020:pt-[0.6em]">The people</p>
        <h2 id="people-title" className="type-subtitle1 max-w-[16ch] text-balance bp1020:col-span-9">
          The people behind the work.
        </h2>
      </Reveal>
      <div className={styles.persons}>
        {TEAM.map((member) => (
          <Person key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}

function Person({ member }: { member: TeamMember }) {
  const initials = member.name
    .split(/\s+/)
    .filter((part) => part.length > 1)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  // An icon shows only once its URL is filled in.
  const links = [
    { label: "LinkedIn", href: member.linkedin, Icon: LinkedInIcon },
    { label: "Instagram", href: member.instagram, Icon: InstagramIcon },
  ].filter((link) => link.href);

  return (
    <Reveal as="article" className={styles.person}>
      <div className={styles.portrait}>
        {member.portrait ? (
          <Image src={member.portrait} alt={member.name} fill sizes="316px" className={styles.photo} />
        ) : (
          <span className={styles.initials} aria-hidden="true">
            {initials}
          </span>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.role}>{member.role}</p>
        {links.length > 0 && (
          <ul className={styles.links}>
            {links.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${member.name} on ${label}`}>
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {member.bio.length > 0 && (
        <div className={styles.bio}>
          {member.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      )}
    </Reveal>
  );
}
