import { readFile } from "node:fs/promises";
import path from "node:path";

/*
 * Serves the layout placeholders in `assets/placeholders/` to the dev server,
 * and nothing in production.
 *
 * They are third-party material, kept only to see how the page looks with
 * them in place: other studios' work in the work rail, and a borrowed film in
 * the hero. `assets/` is not served, so they cannot ship by accident; this
 * route is the one way in, and it is closed in a build.
 */

const DIR = path.join(process.cwd(), "assets", "placeholders");

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  webp: "image/webp",
  mp4: "video/mp4",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }
  const { file } = await params;
  // A bare file name only: nothing that could walk out of the folder.
  const match = /^[\w-]+\.(jpg|webp|mp4)$/.exec(file);
  if (!match) {
    return new Response(null, { status: 404 });
  }

  let body: Buffer;
  try {
    body = await readFile(path.join(DIR, file));
  } catch {
    return new Response(null, { status: 404 });
  }
  const headers = {
    "content-type": TYPES[match[1]],
    "accept-ranges": "bytes",
    "cache-control": "no-store",
  };

  /* Video asks for byte ranges to stream and loop; answer them. */
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range") ?? "");
  if (range) {
    const size = body.length;
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start > end || start >= size) {
      return new Response(null, {
        status: 416,
        headers: { "content-range": `bytes */${size}` },
      });
    }
    return new Response(new Uint8Array(body.subarray(start, end + 1)), {
      status: 206,
      headers: {
        ...headers,
        "content-range": `bytes ${start}-${end}/${size}`,
        "content-length": String(end - start + 1),
      },
    });
  }

  return new Response(new Uint8Array(body), {
    headers: { ...headers, "content-length": String(body.length) },
  });
}
