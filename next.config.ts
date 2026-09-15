import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // All imagery is local SVG placeholders for now.
    unoptimized: true,
  },
};

export default nextConfig;
