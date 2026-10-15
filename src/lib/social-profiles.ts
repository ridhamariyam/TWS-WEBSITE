/** Shared studio profiles. Add a profile only once its URL is confirmed. */
type SocialProfile = { name: "Instagram" | "LinkedIn"; href: string };

export const SOCIAL_PROFILES: SocialProfile[] = [
  { name: "Instagram", href: "https://www.instagram.com/thewebstudio.agency" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/thewebstudioagency" },
];
