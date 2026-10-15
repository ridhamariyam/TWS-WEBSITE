import path from "node:path";
import type { NextConfig } from "next";

// Pin the workspace root to this project: a stray lockfile in a parent
// directory otherwise makes Next infer the wrong root for tracing/standalone.
const projectRoot = path.resolve(__dirname);

/*
 * Until launch, `/` serves the holding page at /coming-soon and every other
 * page redirects to it. SITE_LAUNCHED=true enables the main site's routes;
 * see README.md for the deployment steps.
 */
const SITE_LAUNCHED = process.env.SITE_LAUNCHED === "true";

/** Pages that are hidden whatever the launch state. */
const HIDDEN_PAGES = ["/work", "/work/:slug*", "/portfolio", "/blogs", "/faq"];

/** The live site's pages, hidden behind the holding page before launch. */
const PRE_LAUNCH_PAGES = ["/about", "/services/:path*", "/contact/:path*"];

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  // No on-screen dev badge; build and runtime errors still show in dev.
  devIndicators: false,
  // Hidden for now: only the homepage, services, about, contact and the
  // enquiry form are live. The pages stay in the codebase; delete an entry
  // here (and restore its links) to bring it back.
  async redirects() {
    const hidden = SITE_LAUNCHED
      ? HIDDEN_PAGES
      : [...HIDDEN_PAGES, ...PRE_LAUNCH_PAGES, "/coming-soon"];
    return [
      // One address: www goes to the bare domain, keeping the path.
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.thewebstudio.agency" }],
        destination: "https://thewebstudio.agency/:path*",
        permanent: true,
      },
      ...hidden.map((source) => ({
        source,
        destination: "/",
        permanent: false,
      })),
    ];
  },
  async rewrites() {
    // beforeFiles, so it wins over src/app/page.tsx.
    return {
      beforeFiles: SITE_LAUNCHED ? [] : [{ source: "/", destination: "/coming-soon" }],
      afterFiles: [],
      fallback: [],
    };
  },
  experimental: {
    serverActions: {
      // The contact form's optional attachment. Server Actions default to 1MB;
      // the file itself is capped at MAX_FILE_BYTES (10MB) in
      // `contact-schema.ts`, and this leaves room for the fields beside it.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
