#!/usr/bin/env node
/**
 * Downloads every image/video asset used by the squarespace.com homepage
 * into `public/`, preserving the CDN's directory structure.
 *
 * Source list: docs/research/asset-urls.txt (one CDN-relative path per line,
 * mined from the live page's rendered `currentSrc`/`<source>`/background-image
 * values plus the raw HTML srcsets).
 *
 * For responsive images the CDN exposes many `-<N>w` variants of the same
 * basename. We keep the largest variant of each and drop the rest, then write
 * it back out without the width suffix so components reference a stable name.
 *
 * Usage: node scripts/download-assets.mjs [--force]
 */

import { mkdir, writeFile, access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CDN = "https://media-www.sqspcdn.com/";
const LIST = join(ROOT, "docs/research/asset-urls.txt");
const OUT = join(ROOT, "public");
const CONCURRENCY = 4;
const FORCE = process.argv.includes("--force");

/** `foo-1500w.webp` -> `{ key: "dir/foo.webp", width: 1500 }` */
function parseVariant(path) {
  const m = path.match(/^(.*?)-(\d{2,4})w(\.[a-z0-9]+)$/i);
  if (!m) return { key: path, width: Infinity };
  return { key: m[1] + m[3], width: Number(m[2]) };
}

/** Keep only the widest variant of each logical asset. */
function pickLargest(paths) {
  const best = new Map();
  for (const p of paths) {
    const { key, width } = parseVariant(p);
    const cur = best.get(key);
    if (!cur || width > cur.width) best.set(key, { width, src: p });
  }
  return [...best.entries()].map(([key, v]) => ({ src: v.src, dest: key }));
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function download({ src, dest }) {
  const destPath = join(OUT, dest);
  if (!FORCE && (await exists(destPath))) return { dest, status: "skipped" };

  const res = await fetch(CDN + src, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
      referer: "https://www.squarespace.com/",
    },
  });
  if (!res.ok) return { dest, status: `HTTP ${res.status}` };

  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, buf);
  return { dest, status: "ok", bytes: buf.length };
}

async function main() {
  const paths = (await readFile(LIST, "utf8"))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const jobs = pickLargest(paths);
  console.log(`${paths.length} variants -> ${jobs.length} assets to fetch`);

  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      try {
        const r = await download(job);
        results.push(r);
        if (r.status !== "ok" && r.status !== "skipped") {
          console.warn(`  ! ${r.dest}: ${r.status}`);
        }
      } catch (err) {
        results.push({ dest: job.dest, status: String(err) });
        console.warn(`  ! ${job.dest}: ${err}`);
      }
    }
  });
  await Promise.all(workers);

  const ok = results.filter((r) => r.status === "ok");
  const skipped = results.filter((r) => r.status === "skipped");
  const failed = results.filter(
    (r) => r.status !== "ok" && r.status !== "skipped",
  );
  const mb = (ok.reduce((n, r) => n + (r.bytes ?? 0), 0) / 1e6).toFixed(1);
  console.log(
    `done: ${ok.length} downloaded (${mb} MB), ${skipped.length} cached, ${failed.length} failed`,
  );
  if (failed.length) process.exitCode = 1;
}

main();
