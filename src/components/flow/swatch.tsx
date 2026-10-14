import styles from "./flow.module.css";

/*
 * A solid block of the brand's purple or navy, standing where a photograph
 * would. Lists alternate the two by index; anything else picks one from its
 * name, so the same slot keeps the same colour.
 */

export type Tone = "violet" | "navy";

export const toneAt = (index: number): Tone => (index % 2 === 0 ? "violet" : "navy");

const toneOf = (name: string): Tone =>
  toneAt([...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0));

export function Swatch({ name, tone, className }: { name?: string; tone?: Tone; className?: string }) {
  return (
    <span
      className={className ? `${styles.swatch} ${className}` : styles.swatch}
      data-tone={tone ?? toneOf(name ?? "")}
      aria-hidden="true"
    />
  );
}
