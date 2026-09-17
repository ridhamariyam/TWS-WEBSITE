/**
 * Content shapes for the squarespace.com homepage clone.
 *
 * Every field here mirrors something that actually exists in the live page's
 * DOM — copy is verbatim and asset paths point at files pulled down by
 * `scripts/download-assets.mjs`.
 */

export type Link = {
  label: string;
  href: string;
};

/** A call-to-action button. The site's `.cta` classes map onto these variants. */
export type Cta = Link & {
  variant?: "primary" | "secondary" | "inline";
  theme?: "light" | "dark";
  hasArrow?: boolean;
};

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type VideoAsset = {
  /** Preferred source; the site serves webm first with an mp4 fallback. */
  webm?: string;
  mp4: string;
  poster?: string;
  width: number;
  height: number;
};

/* ---------------------------------------------------------------- navigation */

export type NavSubmenuItem = Link & {
  description?: string;
  icon?: string;
};

export type NavItem = {
  label: string;
  /** Present when the item opens a mega-menu instead of navigating. */
  submenu?: NavSubmenuItem[];
  href?: string;
};

export type HeaderContent = {
  nav: NavItem[];
  logIn: Link;
  getStarted: Cta;
};

/* -------------------------------------------------------------------- hero */

export type HeroSlide = {
  id: string;
  /** Business vertical shown in the slide, e.g. "barber", "plants". */
  name: string;
  desktop: VideoAsset;
  mobile: VideoAsset;
};

export type HeroContent = {
  headingLines: string[];
  cta: Cta;
  disclaimer: string;
  slides: HeroSlide[];
};

/* --------------------------------------------------- pill-filtered carousel */

/** One card inside a `grow-your-business` style carousel. */
export type FeatureCard = {
  id: string;
  title: string;
  body: string;
  image?: ImageAsset;
  video?: VideoAsset;
  cta?: Cta;
};

/** A pill that filters which cards the carousel shows. */
export type FilterPill = {
  id: string;
  label: string;
  cards: FeatureCard[];
};

export type PillCarouselContent = {
  title: string;
  body: string;
  pills: FilterPill[];
};

/* --------------------------------------------------------- card carousel */

export type PlatformCard = {
  id: string;
  title: string;
  body: string;
  image?: ImageAsset;
  video?: VideoAsset;
  href: string;
};

export type CardCarouselContent = {
  title: string;
  body: string;
  cards: PlatformCard[];
};

/* --------------------------------------------------------------- stats */

export type Stat = {
  value: string;
  label: string;
};

export type StatsContent = {
  intro: string;
  stats: Stat[];
};

/* ------------------------------------------------------------- accordion */

export type AccordionEntry = {
  id: string;
  question: string;
  answer: string;
};

export type AccordionSectionContent = {
  title: string;
  entries: AccordionEntry[];
};

/* ---------------------------------------------------------------- footer */

export type FooterColumn = {
  heading: string;
  links: Link[];
};

export type FooterContent = {
  columns: FooterColumn[];
  social: Array<{ name: "facebook" | "instagram" | "pinterest"; href: string }>;
  legal: Link[];
  copyright: string;
  locale: { language: string; region: string };
};

/* ------------------------------------------------------------------ rich text */

/** A run of body copy: plain strings interleaved with inline links. */
export type RichRun = string | { label: string; href: string };

export type FaqEntry = {
  question: string;
  /** Paragraphs, each a run of strings and inline links. */
  answer: RichRun[][];
};
