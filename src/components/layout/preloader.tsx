"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./preloader.module.css";

/*
 * The homepage preloader.
 *
 * "THEWEBSTUDIO." rises in, letter by letter, over a black screen. Its final
 * O splits into a pair of brackets and opens, and what sets the studio apart
 * cycles through the opening a second at a time. The O closes again, and
 * every letter but the T, the W, the S and the full stop folds away: the name
 * becomes the mark, "TWS.". The mark flies up to the header's logo as the
 * black lifts off the page, and is swapped for it where it lands.
 *
 * The T, W, S and full stop are not type. They are slices of the logo artwork
 * itself, sized so the logo's cap height matches Inter's, so once the letters
 * between them fold away they close up into the exact mark.
 *
 * The stage is drawn with `mix-blend-mode: difference`, like the header at the
 * top of the page, so the mark is white on the black and black on the page,
 * and matches the header's logo pixel for pixel when they swap.
 *
 * It plays once per visitor: after the first visit (remembered in
 * localStorage) the page opens straight away, reloads included.
 * Reduced motion gets none of it. A gesture once the letters are up skips
 * straight to the close.
 *
 * The overlay is in the server markup, so the page's own entrance is held from
 * the first frame. <noscript> removes it for a reader without JavaScript.
 * While it is up, `html:has([data-preloader])` holds the hero's entrance and
 * the header, and `tws:preloader-done` tells the hero it can start.
 */

export const PRELOADER_DONE = "tws:preloader-done";
const SEEN = "tws:preloader-seen";

type Phase = "pre" | "letters" | "open" | "close" | "collapse" | "fly" | "arrive" | "done";

const ORDER: Phase[] = ["pre", "letters", "open", "close", "collapse", "fly", "arrive", "done"];

/*
 * The logo artwork, 404 x 160, white on transparent. Its capitals run from
 * y 13 to 132, and these are the x positions between its T, W, S and stop.
 */
const LOGO = { src: "/icons/tws-logo.png", w: 404, h: 160, capTop: 13, capBottom: 132 };
const CUTS = { T: [0, 109], W: [109, 267], S: [267, 372], dot: [372, 404] } as const;

type Piece = { type: "slice"; part: keyof typeof CUTS } | { type: "letter"; char: string };

/* "THEWEBSTUDI", then the O, which is built separately so it can split, then the stop. */
const PIECES: Piece[] = [
  { type: "slice", part: "T" },
  { type: "letter", char: "H" },
  { type: "letter", char: "E" },
  { type: "slice", part: "W" },
  { type: "letter", char: "E" },
  { type: "letter", char: "B" },
  { type: "slice", part: "S" },
  { type: "letter", char: "T" },
  { type: "letter", char: "U" },
  { type: "letter", char: "D" },
  { type: "letter", char: "I" },
];

/*
 * What makes TWS different, not what it sells: strategy, storytelling and
 * engineering under one roof (see STUDIO_INTRO). Twelve characters at most,
 * so each fits the opening on a phone.
 */
const CAPTIONS = ["Strategy-led", "Story-driven", "Engineered"];

const LONG = {
  holdBeforeStart: 0.25,
  letterStagger: 0.035,
  letterDuration: 0.7,
  openDuration: 0.6,
  caption: 1,
  closeDuration: 0.55,
  collapse: 0.75,
  hold: 0.3,
  fly: 0.95,
};

/** Inter's cap height and cap top in a 1em line box, as fractions of the size. */
const CAP_HEIGHT = 0.727;
const CAP_TOP = 0.136;
/* The artwork scaled so its capitals are Inter's height, placed on Inter's caps. */
const LOGO_H = (CAP_HEIGHT * LOGO.h) / (LOGO.capBottom - LOGO.capTop);
const LOGO_TOP = CAP_TOP - (LOGO.capTop / LOGO.h) * LOGO_H;
const LOGO_W = (LOGO.w / LOGO.h) * LOGO_H;

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("pre");
  const [timing] = useState(LONG);
  const [caption, setCaption] = useState(-1);
  const curtainRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const flightRef = useRef<Animation | null>(null);

  /* Which run this is, decided before the first frame is painted. */
  useBeforePaint(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN) === "1";
      localStorage.setItem(SEEN, "1");
    } catch {
      // Storage unavailable: every visit is a first one.
    }
    // Only ever once: a visitor who has seen it goes straight to the page.
    if (seen) {
      setPhase("done");
      return;
    }
    document.documentElement.style.overflow = "hidden";
  }, []);

  /* The O's width, as a fraction of the type size, so the split lines up. */
  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;
    const measure = () => {
      const o = word.querySelector<HTMLElement>("[data-o-left]");
      if (!o) return;
      const size = parseFloat(getComputedStyle(word).fontSize);
      word.style.setProperty("--ow", `${o.getBoundingClientRect().width / size}em`);
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);

  /* The letters fold away, from measured widths. */
  useBeforePaint(() => {
    if (phase !== "collapse" || !wordRef.current) return;
    collapse(wordRef.current, timing.collapse);
  }, [phase, timing]);

  /* The mark flies to the header logo as the black lifts. */
  useBeforePaint(() => {
    if (phase !== "fly" || !wordRef.current || !curtainRef.current) return;
    flightRef.current = flyToLogo(wordRef.current, curtainRef.current, timing.fly);
  }, [phase, timing]);

  /* The sequence, one phase to the next. */
  useEffect(() => {
    if (phase === "done") return;
    const t = timing;
    const after = (s: number, next: Phase) => {
      const id = window.setTimeout(() => setPhase(next), Math.ceil(s * 1000));
      return () => window.clearTimeout(id);
    };
    switch (phase) {
      case "pre":
        return after(t.holdBeforeStart, "letters");
      case "letters":
        return after((PIECES.length + 2) * t.letterStagger + t.letterDuration, "open");
      case "open":
        return after(t.openDuration * 0.6 + CAPTIONS.length * t.caption, "close");
      case "close":
        return after(t.closeDuration, "collapse");
      case "collapse":
        return after(t.collapse + t.hold, "fly");
      case "fly": {
        /*
         * The swap waits for the flight itself to finish, so the mark is on
         * the logo exactly; the timer only covers a flight that never ran.
         */
        let live = true;
        flightRef.current?.finished.then(() => live && setPhase("arrive"), () => {});
        const stop = after(t.fly + 0.2, "arrive");
        return () => {
          live = false;
          stop();
        };
      }
      case "arrive":
        return after(0.35, "done");
    }
  }, [phase, timing]);

  /* The captions, a second apart, from just after the O starts to open. */
  useEffect(() => {
    if (phase !== "open") return;
    const ids = CAPTIONS.map((_, i) =>
      window.setTimeout(() => setCaption(i), (timing.openDuration * 0.6 + i * timing.caption) * 1000),
    );
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [phase, timing]);

  /* Done: give the page back. */
  useEffect(() => {
    if (phase !== "done") return;
    document.documentElement.style.overflow = "";
    window.dispatchEvent(new Event(PRELOADER_DONE));
  }, [phase]);

  /* A gesture once the letters are up skips to the close. */
  useEffect(() => {
    if (phase !== "letters" && phase !== "open") return;
    const go = () => setPhase("close");
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 12) go();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", "End", " ", "Enter", "Escape"].includes(e.key)) go();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", go, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", go);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", go);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", go);
    };
  }, [phase]);

  if (phase === "done") return null;

  const past = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p);
  /* Closing: the last caption goes with the O. */
  const shown = past("close") ? CAPTIONS.length : caption;

  return (
    <div
      data-preloader=""
      aria-hidden="true"
      className={styles.root}
      data-letters={past("letters") || undefined}
      data-open={past("open") || undefined}
      data-close={past("close") || undefined}
      data-arrived={past("arrive") || undefined}
      style={
        {
          "--letter-stagger": `${timing.letterStagger}s`,
          "--letter-duration": `${timing.letterDuration}s`,
          "--open-duration": `${timing.openDuration}s`,
          "--close-duration": `${timing.closeDuration}s`,
          "--logo-w": `${LOGO_W}em`,
          "--logo-h": `${LOGO_H}em`,
          "--logo-top": `${LOGO_TOP}em`,
        } as React.CSSProperties
      }
    >
      <noscript>
        <style>{"[data-preloader]{display:none!important}"}</style>
      </noscript>

      <div ref={curtainRef} className={styles.curtain} />

      <div className={styles.stage}>
        <span ref={wordRef} className={styles.word}>
          {PIECES.map((piece, i) =>
            piece.type === "slice" ? (
              <Slice key={i} part={piece.part} index={i} />
            ) : (
              <span
                key={i}
                className={`${styles.letter} ${styles.char}`}
                data-drop=""
                style={{ "--i": i } as React.CSSProperties}
              >
                {piece.char}
              </span>
            ),
          )}

          <span
            className={`${styles.letter} ${styles.char} ${styles.o}`}
            data-drop=""
            style={{ "--i": PIECES.length } as React.CSSProperties}
          >
            <span data-o-left="" className={styles.oLeft}>
              O
            </span>
            <span className={styles.gap} />
            <span className={styles.oRight}>O</span>
            <span className={styles.captions}>
              {CAPTIONS.map((text, i) => (
                <span
                  key={text}
                  className={styles.caption}
                  data-state={i === shown ? "on" : i < shown ? "off" : undefined}
                >
                  {text}
                </span>
              ))}
            </span>
          </span>

          <Slice part="dot" index={PIECES.length + 1} />
        </span>
      </div>
    </div>
  );
}

/** One letter of the logo: a window onto the artwork, exactly its width. */
function Slice({ part, index }: { part: keyof typeof CUTS; index: number }) {
  const [from, to] = CUTS[part];
  return (
    <span
      data-slice={part}
      className={`${styles.letter} ${styles.slice}`}
      style={
        {
          "--i": index,
          width: `calc(var(--logo-w) * ${(to - from) / LOGO.w})`,
        } as React.CSSProperties
      }
    >
      <img
        src={LOGO.src}
        alt=""
        style={{ marginLeft: `calc(var(--logo-w) * ${-from / LOGO.w})` }}
      />
    </span>
  );
}

/*
 * Everything but the logo's slices folds to nothing, and the slices' own room
 * goes with it, so they close up into the mark. Widths and margins are
 * animated from what is measured now.
 */
function collapse(word: HTMLElement, seconds: number) {
  const timing = { duration: seconds * 1000, easing: EASE, fill: "forwards" as const };
  for (const el of word.querySelectorAll<HTMLElement>("[data-slice]")) {
    const { marginLeft, marginRight } = getComputedStyle(el);
    el.animate(
      [
        { marginLeft, marginRight },
        { marginLeft: "0px", marginRight: "0px" },
      ],
      timing,
    );
  }
  for (const el of word.querySelectorAll<HTMLElement>("[data-drop]")) {
    const { width } = el.getBoundingClientRect();
    const margin = getComputedStyle(el).marginRight;
    el.style.overflow = "hidden";
    el.animate(
      [
        { width: `${width}px`, marginRight: margin, opacity: 1 },
        { width: "0px", marginRight: "0px", opacity: 0 },
      ],
      timing,
    );
  }
}

/*
 * The mark travels to the header logo and scales to its size; the black lifts
 * away behind it a beat later. The header's logo is hidden, not removed, so
 * it can be measured. The mark is moved by its artwork's own box, so it lands
 * on the logo exactly. Returns the flight, or null if there is no logo.
 */
function flyToLogo(word: HTMLElement, curtain: HTMLElement, seconds: number) {
  const ms = seconds * 1000;
  curtain.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], {
    duration: ms,
    delay: ms * 0.15,
    easing: EASE,
    fill: "forwards",
  });

  const logo = [...document.querySelectorAll<HTMLElement>("#site-header img")].find(
    (img) => img.getClientRects().length > 0,
  );
  const first = word.querySelector<HTMLElement>("[data-slice] img");
  if (!logo || !first) return null;

  const box = word.getBoundingClientRect();
  const from = first.getBoundingClientRect();
  const to = logo.getBoundingClientRect();
  const scale = to.height / from.height;
  const originY = from.top - box.top;

  word.style.transformOrigin = `${from.left - box.left}px ${originY}px`;
  return word.animate(
    [
      { transform: "translate(0, 0) scale(1)" },
      { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${scale})` },
    ],
    { duration: ms, easing: EASE, fill: "forwards" },
  );
}
