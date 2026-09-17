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
    // Assets are downloaded originals served straight from public/.
    unoptimized: true,
  },
};

export default nextConfig;
