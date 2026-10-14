/**
 * The contact page's map: the window public/images/world-map.svg was drawn
 * for (see scripts/generate-world-map.mjs — keep the two in step), and the
 * studio's place on it.
 */
export const MAP_WINDOW = { lonMin: -50.2, lonSpan: 252, latMax: 80, latSpan: 141.75 };

export const STUDIO_PLACE = {
  label: "Calicut · Kerala · India",
  lat: 11.2588,
  lon: 75.7804,
  href: "https://maps.google.com/?q=Calicut,+Kerala,+India",
};

/** Where a point falls on the map, as percentages of its width and height. */
export function mapPosition(lat: number, lon: number) {
  return {
    left: ((lon - MAP_WINDOW.lonMin) / MAP_WINDOW.lonSpan) * 100,
    top: ((MAP_WINDOW.latMax - lat) / MAP_WINDOW.latSpan) * 100,
  };
}
