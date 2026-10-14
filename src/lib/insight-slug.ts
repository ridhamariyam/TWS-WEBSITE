import type { InsightEntry } from "@/lib/insights-content";

/** A post's anchor on /blogs, from its title: "Good UX doesn't…" -> "good-ux-doesnt-feel-like-ux". */
export const insightSlug = (entry: Pick<InsightEntry, "title">) =>
  entry.title
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Reading time from the word count, rounded up to whole minutes. */
export const readingMinutes = (entry: InsightEntry) => {
  const words = entry.body
    .flat()
    .map((run) => (typeof run === "string" ? run : run.label))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
};
