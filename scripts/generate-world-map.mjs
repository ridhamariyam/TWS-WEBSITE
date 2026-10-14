#!/usr/bin/env node
/*
 * Draws the world map the contact page sits its studio marker on.
 *
 * Source: Natural Earth 110m land (public domain), kept in assets/data/.
 * Projection: plain equirectangular, cropped to a 16:9 window centred on the
 * studio, so the marker sits in the middle third. Land is drawn twice, a turn
 * apart, so a window that crosses the antimeridian is still filled.
 *
 * The window is exported as MAP_WINDOW in src/lib/studio-map.ts; the marker
 * is placed from the same numbers, so the two cannot drift apart.
 *
 * Run with: node scripts/generate-world-map.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";

const W = 1600;
const H = 900;
// Keep in step with MAP_WINDOW in src/lib/studio-map.ts.
const LON_MIN = -50.2;
const LON_SPAN = 252;
const LAT_MAX = 80;
const LAT_SPAN = 141.75;

const land = JSON.parse(readFileSync("assets/data/ne_110m_land.geojson", "utf8"));

const x = (lon) => ((lon - LON_MIN) / LON_SPAN) * W;
const y = (lat) => ((LAT_MAX - lat) / LAT_SPAN) * H;

function ring(points, shift) {
  return (
    points
      .map(([lon, lat], i) => `${i ? "L" : "M"}${x(lon + shift).toFixed(0)} ${y(lat).toFixed(0)}`)
      .join("") + "Z"
  );
}

let d = "";
for (const shift of [0, 360]) {
  for (const feature of land.features) {
    const { type, coordinates } = feature.geometry;
    const polygons = type === "Polygon" ? [coordinates] : coordinates;
    for (const polygon of polygons) for (const r of polygon) d += ring(r, shift);
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><path fill="#262626" d="${d}"/></svg>\n`;
writeFileSync("public/images/world-map.svg", svg);
console.log(`public/images/world-map.svg  ${Math.round(svg.length / 1024)} KB`);
