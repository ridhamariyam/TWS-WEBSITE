"use client";

import { useEffect, useLayoutEffect } from "react";
import { INTRO_SECONDS } from "@/components/sections/hero-tunnel-data";
import {
  INTRO_FLAG,
  INTRO_SEEN,
} from "@/components/sections/hero-intro-flag";

/**
 * Plays the hero's intro once per tab.
 *
 * The intro is a wall over the whole viewport, so it must not return on a
 * visit the reader did not start — a soft navigation back, a reload, or a back
 * button restoring a scroll position halfway down the page would each drop a
 * black rectangle over content already reached.
 *
 * Two flags cover the two ways the hero can come back: the module-level `seen`
 * within one document, and `sessionStorage` across documents in the same tab.
 * Both end up as `data-intro` on the document element, which is what the CSS
 * keys off. Storage throwing is harmless — the intro simply plays.
 */

/** Per document, so a client-side route change back to `/` does not replay. */
let seen = false;

function mark() {
  seen = true;
  document.documentElement.dataset.intro = INTRO_SEEN;
  try {
    sessionStorage.setItem(INTRO_FLAG, "1");
  } catch {
    // Storage unavailable; the in-document flag still holds for this page.
  }
}

/*
 * Before paint, which is the point on a soft navigation: the flag has to be
 * set before the remounted hero paints, or the reader sees a frame of wall.
 */
const useBeforePaint =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function HeroIntro() {
  useBeforePaint(() => {
    if (seen) {
      mark();
      return;
    }
    const mounted = performance.now();
    const id = window.setTimeout(mark, INTRO_SECONDS * 1000);
    return () => {
      window.clearTimeout(id);
      /*
       * Left the homepage mid-sequence: mark it anyway, so it does not start
       * from the top on return. React's development remount tears down in the
       * same tick, which is not that.
       */
      if (performance.now() - mounted > 100) mark();
    };
  }, []);

  return null;
}
