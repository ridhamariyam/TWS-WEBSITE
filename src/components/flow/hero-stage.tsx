"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { easeInOut, lerp, range, useScrollStage } from "./use-scroll-stage";
import styles from "./hero-stage.module.css";

/*
 * The opening stage: an 18-second film drawn in code, pinned while scrolling
 * plays it through from start to end (the times below are film seconds):
 *
 *    0.0– 2.2  "Every website has a job," word by word, each arriving blue;
 *    2.2– 5.3  the words give way to rows of design tools around "website";
 *    5.3– 7.9  "so we build websites that work." — then only "that work." stays;
 *    7.75–11.95 a ring of cards rises and turns;
 *   11.7–12.3  the screen dips to black, and the particle dive takes over.
 *
 * Everything is set from scroll through refs, so React renders once.
 */

/** The film second the end of the stage's scroll lands on. */
const END = 12.3;

const LINE_A = ["Every", "website", "has", "a", "job,"];
const A_IN = [0.05, 0.45, 0.75, 0.95, 1.35];
/** "website" stays on into the tool rows; it has its own exit. */
const A_OUT = [2.25, Infinity, 2.9, 3.4, 2.9];
const ANCHOR = 1;

const LINE_C = ["so", "we", "build", "websites", "that", "work"];
const C_IN = [5.35, 5.5, 5.65, 5.3, 5.8, 5.95];
const C_OUT = [6.55, 6.6, 6.65, 6.85, 7.6, 7.6];

const CARD_IMAGES = ["web-design", "ecommerce", "web-applications", "pen-foundation", "zeen"];
const CARDS = [...CARD_IMAGES, ...CARD_IMAGES];
const CARD_STEP = 360 / CARDS.length;

/** A card's width on the ring: as large as the screen allows, so the ring fills it. */
const cardWidth = (w: number, h: number) => Math.min(w * 0.8, h * 0.68);

/** In over `d` seconds from `start`, out over `d` from `end`. */
const fade = (t: number, start: number, end: number, d = 0.3) =>
  range(t, start, start + d) * (1 - range(t, end, end + d));

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** White, warmed towards the highlight blue by `amount`. */
const highlight = (amount: number) =>
  `rgb(${lerp(255, 120, amount).toFixed(0)} ${lerp(255, 184, amount).toFixed(0)} 255)`;

/* ---------- The tool icons ---------- */

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ICONS: Record<string, ReactNode> = {
  square: <path d="M5 5h14v14H5z" />,
  triangle: <path d="M12 4l9 16H3z" />,
  search: (
    <g {...stroke}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </g>
  ),
  type: <path d="M5 4h14v4h-1.6V5.8h-4.4v12.6h2.2V20H8.8v-1.6H11V5.8H6.6V8H5z" />,
  move: (
    <path
      {...stroke}
      d="M12 3v18M3 12h18M12 3l-2.5 2.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"
    />
  ),
  pen: <path d="M3 21l2.4-7.6L14.5 4.3l5.2 5.2-9.1 9.1z" />,
  cursor: <path d="M5 3l14 9.2-6.2 1.4L9.7 20z" />,
  rotate: <path {...stroke} d="M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" />,
  pin: <path d="M15 2.5l6.5 6.5-2.6.9-4 4 .7 5-1.8 1.8-4-4-5.3 5.3-1.4-1.4 5.3-5.3-4-4 1.8-1.8 5 .7 4-4z" />,
  eraser: <path d="M14.5 3.5l6 6-9 9H7l-3.5-3.5z" />,
  crop: <path {...stroke} d="M6 2v16h16M2 6h16v16" />,
  home: <path d="M3 11l9-8 9 8v10h-6.5v-6h-5v6H3z" />,
  select: <path {...stroke} strokeDasharray="3 3" d="M4 4h16v16H4z" />,
};

/** The icon sets each row steps through, one every ICON_STEP seconds. */
const ROW_ABOVE = [
  ["pen", "move", "cursor"],
  ["eraser", "select", "pin", "home"],
  ["square", "move", "cursor", "pen"],
  ["square", "triangle", "search", "type"],
  ["pen", "search", "type"],
];
const ROW_BELOW = [
  ["crop", "eraser"],
  ["select", "pen", "rotate", "pin"],
  ["move", "pen", "rotate", "cursor"],
  ["move", "crop", "eraser"],
];
const ICON_STEP = 0.6;
const ABOVE_FROM = 2.35;
const BELOW_FROM = 2.95;

function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
      {ICONS[name]}
    </svg>
  );
}

/* ---------- The stage ---------- */

export function HeroStage() {
  const sectionRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<(t: number) => void>(() => {});
  const timeRef = useRef(0);
  const lineARef = useRef<HTMLParagraphElement>(null);
  const lineCRef = useRef<HTMLParagraphElement>(null);
  const wordsA = useRef<Array<HTMLSpanElement | null>>([]);
  const wordsC = useRef<Array<HTMLSpanElement | null>>([]);
  const dotRef = useRef<HTMLSpanElement>(null);
  const selectRef = useRef<HTMLSpanElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const aboveSets = useRef<Array<HTMLSpanElement | null>>([]);
  const belowSets = useRef<Array<HTMLSpanElement | null>>([]);
  const cardsSceneRef = useRef<HTMLDivElement>(null);
  const cardsRingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const blackoutRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Layout read once per resize: the stage, the type size and where each
    // word sits in its line, so the lines can slide to centre on a word.
    let w = 0, h = 0, anchorX = 0, toPlay = 0;
    const centreOf = (el: HTMLElement | null, line: HTMLElement | null) =>
      el && line ? el.offsetLeft + el.offsetWidth / 2 - line.offsetWidth / 2 : 0;
    const measure = () => {
      w = root.clientWidth;
      h = root.clientHeight;
      anchorX = centreOf(wordsA.current[ANCHOR], lineARef.current);
      // "work" holds the full stop, so its box runs to the end of the line.
      const [to, play] = [wordsC.current[4], wordsC.current[5]];
      const line = lineCRef.current;
      toPlay = to && play && line
        ? (to.offsetLeft + play.offsetLeft + play.offsetWidth) / 2 - line.offsetWidth / 2
        : 0;
      root.style.setProperty("--cw", `${cardWidth(w, h).toFixed(1)}px`);
    };

    const render = (t: number) => {
      /* The light sweeps round as the film plays, on top of its own drift. */
      if (lightRef.current) {
        lightRef.current.style.transform =
          `rotate(${(t * 2.4).toFixed(2)}deg) translate(${(Math.sin(t * 0.45) * 9).toFixed(2)}vw, ${(Math.sin(t * 0.3) * 6).toFixed(2)}svh) ` +
          `scale(${(1 + 0.12 * Math.sin(t * 0.35)).toFixed(3)})`;
      }

      /* Line one, and the tool rows round "website". */
      const slide = easeInOut(range(t, 2.4, 3.9));
      const lineAX = -anchorX * slide;
      if (lineARef.current) lineARef.current.style.transform = `translate(calc(-50% + ${lineAX.toFixed(1)}px), -50%)`;
      wordsA.current.forEach((word, i) => {
        if (!word) return;
        const arrive = range(t, A_IN[i], A_IN[i] + 0.3);
        const out = i === ANCHOR ? 5.3 : A_OUT[i];
        word.style.opacity = (arrive * (1 - range(t, out, out + 0.25))).toFixed(3);
        word.style.transform = `translateY(${((1 - easeOut(arrive)) * 0.35).toFixed(3)}em)`;
        word.style.filter = `blur(${((1 - arrive) * 6).toFixed(1)}px)`;
        word.style.color = highlight(range(t, A_IN[i], A_IN[i] + 0.15) * (1 - range(t, A_IN[i] + 0.7, A_IN[i] + 1.1)));
      });
      // The selection box "job," lands in.
      if (selectRef.current) selectRef.current.style.opacity = fade(t, 0.8, 1.3, 0.12).toFixed(3);

      const rowsX = anchorX + lineAX;
      if (rowsRef.current) rowsRef.current.style.transform = `translate(${rowsX.toFixed(1)}px, 0)`;
      const steps = (sets: Array<HTMLSpanElement | null>, from: number, until: number) =>
        sets.forEach((set, k) => {
          if (!set) return;
          const start = from + k * ICON_STEP;
          const end = k === sets.length - 1 ? until : start + ICON_STEP;
          const on = t >= start && t < end;
          set.style.visibility = on ? "visible" : "hidden";
          if (!on) return;
          Array.from(set.children).forEach((icon, i) => {
            const pop = easeOut(range(t, start + i * 0.05, start + i * 0.05 + 0.18));
            (icon as HTMLElement).style.transform = `scale(${(0.4 + 0.6 * pop).toFixed(3)})`;
            (icon as HTMLElement).style.opacity = pop.toFixed(3);
          });
        });
      steps(aboveSets.current, ABOVE_FROM, 5.55);
      steps(belowSets.current, BELOW_FROM, 5.3);

      /* Line two, then "that work." alone at the centre. */
      const toCentre = easeInOut(range(t, 6.7, 7.15));
      const lineCX = -toPlay * toCentre;
      if (lineCRef.current) lineCRef.current.style.transform = `translate(calc(-50% + ${lineCX.toFixed(1)}px), -50%)`;
      wordsC.current.forEach((word, i) => {
        if (!word) return;
        const arrive = range(t, C_IN[i], C_IN[i] + 0.3);
        word.style.opacity = (arrive * (1 - range(t, C_OUT[i], C_OUT[i] + 0.3))).toFixed(3);
        word.style.transform = `translateY(${((1 - easeOut(arrive)) * 0.35).toFixed(3)}em)`;
        word.style.filter = `blur(${((1 - arrive) * 6).toFixed(1)}px)`;
      });
      if (dotRef.current) dotRef.current.style.opacity = fade(t, 5.95, 7.6, 0.3).toFixed(3);

      /* The ring of cards. */
      const cardsIn = easeOut(range(t, 7.75, 8.5));
      const cardsOut = easeInOut(range(t, 11.5, 11.95));
      const cards = cardsSceneRef.current;
      const cardsOn = cardsIn * (1 - cardsOut);
      if (cards) {
        cards.style.visibility = cardsOn > 0 ? "visible" : "hidden";
        cards.style.opacity = cardsOn.toFixed(3);
        cards.style.transform =
          `translateY(${((1 - cardsIn) * h * 0.5).toFixed(1)}px) rotateZ(${((1 - cardsIn) * -18).toFixed(2)}deg) ` +
          `scale(${(0.85 + 0.15 * cardsIn - 0.5 * cardsOut).toFixed(3)})`;
      }
      if (cardsOn > 0) {
        const cw = cardWidth(w, h);
        const radius = cw * 1.8;
        if (cards) cards.style.perspective = `${(radius * 2.6).toFixed(0)}px`;
        if (cardsRingRef.current) cardsRingRef.current.style.transform = `translateZ(${(-radius).toFixed(1)}px)`;
        const turn = -(t - 7.75) * (CARD_STEP / 0.65);
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const angle = i * CARD_STEP + turn;
          const facing = Math.cos((angle * Math.PI) / 180);
          card.style.visibility = facing > -0.1 ? "visible" : "hidden";
          card.style.filter = `brightness(${(0.45 + 0.55 * Math.max(0, facing)).toFixed(3)})`;
          card.style.transform =
            `translate(-50%, -50%) rotateY(${angle.toFixed(2)}deg) translateZ(${radius.toFixed(1)}px)`;
        });
      }

      /* The dip to black. */
      if (blackoutRef.current) blackoutRef.current.style.opacity = range(t, 11.7, 12.1).toFixed(3);
    };

    renderRef.current = render;
    const redraw = () => {
      measure();
      render(timeRef.current);
    };
    redraw();
    window.addEventListener("resize", redraw);
    // Webfont swaps change the words' widths.
    document.fonts?.ready.then(redraw);
    return () => window.removeEventListener("resize", redraw);
  }, []);

  useScrollStage(sectionRef, (p) => {
    timeRef.current = p * END;
    renderRef.current(timeRef.current);
  });

  return (
    <section ref={sectionRef} className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        Websites with a job to do. Every website has a job, so we build websites that work.
      </h1>

      <div ref={rootRef} className={styles.stage}>
        <div className={styles.film} aria-hidden="true">
          <div ref={lightRef} className={styles.light}>
            <span className={`${styles.streak} ${styles.streakTop}`} />
            <span className={`${styles.streak} ${styles.streakBottom}`} />
          </div>

          <p ref={lineARef} className={styles.line}>
            {LINE_A.map((word, i) => (
              <span
                key={word}
                ref={(node) => {
                  wordsA.current[i] = node;
                }}
                className={styles.word}
              >
                {word}
                {i === LINE_A.length - 1 && <span ref={selectRef} className={styles.select} />}
              </span>
            ))}
          </p>

          <div ref={rowsRef} className={styles.rows}>
            <div className={styles.rowAbove}>
              {ROW_ABOVE.map((set, k) => (
                <span
                  key={k}
                  ref={(node) => {
                    aboveSets.current[k] = node;
                  }}
                  className={styles.iconSet}
                >
                  {set.map((name) => <Icon key={name} name={name} />)}
                </span>
              ))}
            </div>
            <div className={styles.rowBelow}>
              {ROW_BELOW.map((set, k) => (
                <span
                  key={k}
                  ref={(node) => {
                    belowSets.current[k] = node;
                  }}
                  className={styles.iconSet}
                >
                  {set.map((name) => <Icon key={name} name={name} />)}
                </span>
              ))}
            </div>
          </div>

          <p ref={lineCRef} className={styles.line}>
            {LINE_C.map((word, i) => (
              <span
                key={word}
                ref={(node) => {
                  wordsC.current[i] = node;
                }}
                className={styles.word}
              >
                {word}
                {i === LINE_C.length - 1 && (
                  <span ref={dotRef} className={styles.dot}>
                    .
                  </span>
                )}
              </span>
            ))}
          </p>

          <div ref={cardsSceneRef} className={styles.cardsScene}>
            <div ref={cardsRingRef} className={styles.cardsRing}>
              {CARDS.map((id, i) => (
                <div
                  key={i}
                  ref={(node) => {
                    cardRefs.current[i] = node;
                  }}
                  className={styles.card}
                >
                  <img src={`/images/${id}-720.webp`} alt="" loading="lazy" decoding="async" />
                </div>
              ))}
            </div>
          </div>

          <div ref={blackoutRef} className={styles.blackout} />
        </div>
      </div>
    </section>
  );
}
