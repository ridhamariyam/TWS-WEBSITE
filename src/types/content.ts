/** Content shapes shared by the site's data modules. */

/** A run of body copy: plain strings interleaved with inline links. */
export type RichRun = string | { label: string; href: string };
