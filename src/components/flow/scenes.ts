/*
 * The shape of a bento run for StudioScenes, kept apart from the component so
 * server pages can build scenes before handing them over.
 */

export type Tile = {
  /** Grid area within the scene's template. */
  area: string;
  /** How far behind the scene's first column this tile moves, 0–0.3. */
  delay: number;
  /** A stable name that determines the slot's brand swatch colour. */
  media?: { image: string };
  /**
   * violet: a card in the brand gradient; statement: big type centred over
   * the media; stat: a large figure over the typed line; plain: type on the
   * black stage.
   */
  look?: "violet" | "statement" | "stat" | "plain";
  /** Text typed in as the scene settles. */
  type?: string;
  /** A large figure, for the stat look. */
  stat?: string;
  /** A short paragraph under the typed line, always there. */
  body?: string;
  /** Makes the whole tile a link, with this label at its foot. */
  link?: { href: string; label: string };
};

export type Scene = { layout: "A" | "B" | "C" | "D" | "E" | "F"; tiles: Tile[] };

/**
 * Scenes for a list of titled items: one layout per item, alternating a wide
 * violet card beside brand swatches, then a violet column between two
 * swatches. Slot names are used in order and repeat.
 */
export function scenesFromItems(
  items: Array<{ title: string; body: string; link?: Tile["link"] }>,
  images: string[],
): Scene[] {
  let next = 0;
  const image = () => ({ image: images[next++ % images.length] });
  return items.map((item, i) => {
    const card: Tile = { area: "", delay: 0, look: "violet", type: item.title, body: item.body, link: item.link };
    return i % 2 === 0
      ? {
          layout: "D",
          tiles: [
            { ...card, area: "a", delay: 0 },
            { area: "b", delay: 0.1, media: image() },
            { area: "c", delay: 0.2, media: image() },
          ],
        }
      : {
          layout: "E",
          tiles: [
            { area: "a", delay: 0, media: image() },
            { ...card, area: "b", delay: 0.12 },
            { area: "c", delay: 0.24, media: image() },
          ],
        };
  });
}
