/** Content shapes shared by the site's data modules. */

export type Link = {
  label: string;
  href: string;
};

export type FooterColumn = {
  heading: string;
  links: Link[];
};

/** A run of body copy: plain strings interleaved with inline links. */
export type RichRun = string | { label: string; href: string };
