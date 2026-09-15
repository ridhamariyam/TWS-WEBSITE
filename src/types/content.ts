export type LinkItem = {
  label: string;
  href: string;
};

export type NavItem = LinkItem & {
  children?: LinkItem[];
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Plain strings interleaved with emphasised fragments (ink, semibold, underlined). */
export type RichText = Array<string | { emphasis: string }>;

export type HeaderContent = {
  logo: ImageAsset;
  nav: NavItem[];
  cta: LinkItem;
};

export type HeroContent = {
  backgroundWord: string;
  lines: string[];
};

export type FeatureItem = {
  icon: "badge" | "pin" | "heart";
  label: string;
};

export type AboutContent = {
  heading: string;
  body: RichText;
  link: LinkItem;
  backgroundWord: string;
  image: ImageAsset;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type Project = {
  title: string;
  category: string;
  href: string;
  image: ImageAsset;
};

export type ProjectsContent = {
  backgroundWord: string;
  badgeText: string;
  link: LinkItem;
  items: Project[];
};

export type AwardRow = {
  count: string;
  label: string;
  source: string;
  year: string;
};

export type AwardsContent = {
  heading: string;
  tag: string;
  backgroundWord: string;
  intro: string;
  rows: AwardRow[];
  logos: ImageAsset[];
};

export type Testimonial = {
  quote: RichText;
  author: string;
};

export type TestimonialsContent = {
  rating: string;
  ratingLabel: string;
  background: string;
  items: Testimonial[];
  logos: ImageAsset[];
};

export type BlogPost = {
  category: string;
  date: string;
  title: string;
  href: string;
  image: ImageAsset;
};

export type BlogContent = {
  heading: string;
  link: LinkItem;
  posts: BlogPost[];
};

export type CtaContent = {
  darkWord: string;
  limeWord: string;
  badgeText: string;
};

export type Office = {
  name: string;
  lines: string[];
};

export type FooterContent = {
  tagline: RichText;
  logo: ImageAsset;
  offices: Office[];
  phone: string;
  email: string;
  nav: LinkItem[];
  copyright: RichText;
};
