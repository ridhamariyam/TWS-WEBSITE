import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    /*
     * The studio's artwork is sized ahead of time by
     * scripts/generate-home-page-media.py, which writes a ladder of widths
     * per source and a manifest the pages build `srcset` from. `next/image`
     * would put a second, paid optimiser in front of files that are already
     * exactly the widths asked for, so these stay plain `<img>` with real
     * `srcset` and `sizes`. Nothing here is the LCP element; the hero is
     * type on a canvas.
     */
    files: ["src/**/*.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
