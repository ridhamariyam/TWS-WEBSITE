import path from "node:path";
import type { NextConfig } from "next";

// Pin the workspace root to this project: a stray lockfile in a parent
// directory otherwise makes Next infer the wrong root for tracing/standalone.
const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  images: {
    // All imagery is local SVG placeholders for now.
    unoptimized: true,
  },
};

export default nextConfig;
