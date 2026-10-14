"use client";

import { useEffect, useRef } from "react";

/*
 * The site's particle field, in two modes.
 *
 * `clouds` banks particles at the left and right edges around an empty middle,
 * so a headline sits on nothing; `dust` spreads a thinner field evenly behind
 * the dark runs of the page. Particles are points, not glows — solid discs
 * with just enough rim falloff to antialias — and depth sets size, brightness
 * and drift, so the field separates without anything being blurred. Colour is
 * the aurora, drawn additively so overlaps bloom.
 *
 * Cost is why this file reads the way it does:
 *
 * - Nothing is built until the field is first scrolled into view.
 * - The loop parks off screen, and rAF parks it again on a hidden tab.
 * - Sprites are pre-rendered per colour; a frame is one drawImage each.
 * - It runs at `FPS`, not the display's rate — the drift does not need more.
 * - A phone gets a lighter field, not a smaller one: fewer particles, no sway
 *   or twinkle, lower pixel ratio.
 * - `prefers-reduced-motion` draws one static frame and never loops.
 */

/*
 * The aurora, shared with the "keep in touch" capsule so the page has one
 * light in it. Cyan and teal carry it, blue supports, olive and amber warm it.
 */
const AURORA = [
  { rgb: "104,196,214", weight: 0.3 },
  { rgb: "63,143,150", weight: 0.26 },
  { rgb: "90,134,214", weight: 0.22 },
  { rgb: "168,154,94", weight: 0.13 },
  { rgb: "192,138,74", weight: 0.09 },
];

function auroraColour(roll: number) {
  let at = 0;
  for (const tone of AURORA) {
    at += tone.weight;
    if (roll <= at) return tone.rgb;
  }
  return AURORA[0].rgb;
}

/** Particles never draw larger than this, so they stay smooth. */
const SPRITE_PX = 96;

/**
 * Frames a second. The field drifts a few pixels a second, so thirty is smooth
 * and costs half of sixty. A phone paints fewer: the difference is invisible,
 * but it is a third off the only work scrolling has to compete with.
 */
const FPS = 30;
const LIGHT_FPS = 20;
const FRAME_MS = 1000 / FPS;
const LIGHT_FRAME_MS = 1000 / LIGHT_FPS;

/** Below this the field switches to its lighter form rather than shrinking. */
const LIGHT_BELOW = 744;

/**
 * Particle count, as `k * sqrt(area)` clamped to a range, and the fraction of
 * it a phone gets. Deliberately low: the field is a soft out-of-focus mass, so
 * a bigger, brighter particle reads the same as several overlapping ones and
 * costs a third of the drawImage calls.
 */
const DENSITY = {
  clouds: { k: 1.45, min: 520, max: 1600, light: 0.46 },
  dust: { k: 0.55, min: 180, max: 620, light: 0.5 },
} as const;

/**
 * Half-width of the clean centre, as a fraction of the section. Callers widen
 * it: a full sentence needs more room than a short headline. Narrow viewports
 * need more again, because the copy there runs the full measure.
 */
const CENTRE_GAP = 0.34;
const CENTRE_GAP_NARROW = 0.56;
/** How far past the gap a particle reaches full brightness. */
const EDGE_FADE = 0.3;

type Cluster = {
  /** 0 is the section's centre line, 1 its outer edge. */
  cx: number;
  cy: number;
  spreadX: number;
  spreadY: number;
};

type Particle = {
  /** -1 or 1 in clouds mode; unused by dust, which fills the whole field. */
  side: -1 | 1;
  cluster: Cluster;
  x: number;
  y: number;
  /** 0 = far, 1 = near. */
  depth: number;
  /** Which aurora tone this one is. */
  rgb: string;
  size: number;
  alpha: number;
  /** Upward drift, px per second. */
  drift: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  twinkleFreq: number;
};

/** Roughly normal, without the cost of a real Box-Muller. */
function bell() {
  return (Math.random() + Math.random() + Math.random()) / 1.5 - 1;
}

function makeSprite(rgb: string) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SPRITE_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const half = SPRITE_PX / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  /* Glitter, not glow: any wider shoulder and a 4px speck reads as a smudge. */
  gradient.addColorStop(0, `rgba(${rgb},1)`);
  gradient.addColorStop(0.44, `rgba(${rgb},1)`);
  gradient.addColorStop(0.58, `rgba(${rgb},0)`);
  gradient.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SPRITE_PX, SPRITE_PX);
  return canvas;
}

function makeClusters(): Cluster[] {
  // Five bands per side at different heights, so density varies down the
  // column instead of reading as an even wash.
  return [0.12, 0.34, 0.56, 0.78, 0.95].map((cy) => ({
    cx: 0.66 + Math.random() * 0.32,
    cy: cy + bell() * 0.07,
    spreadX: 0.15 + Math.random() * 0.1,
    spreadY: 0.12 + Math.random() * 0.12,
  }));
}

/**
 * Places a particle in its cluster and sets the brightness that follows from
 * where it landed. Nothing is sampled inside the centre gap and anything near
 * it is faded, so the clouds dissolve rather than ending at a line.
 */
function place(p: Particle, w: number, h: number, gap: number) {
  const c = Math.min(1.04, Math.max(gap, p.cluster.cx + bell() * p.cluster.spreadX));
  p.x = w / 2 + p.side * c * (w / 2);
  p.y = (p.cluster.cy + bell() * p.cluster.spreadY) * h;

  const edge = Math.min(1, Math.max(0, (c - gap) / EDGE_FADE));
  const softness = edge * edge * (3 - 2 * edge);
  const base = 0.56 + p.depth * 1.3;
  p.alpha = base * softness;
}

export function ParticleField({
  className,
  gap: gapWide = CENTRE_GAP,
  gapNarrow = CENTRE_GAP_NARROW,
  mode = "clouds",
  density = 1,
  pauseOnScroll = false,
}: {
  className?: string;
  /** Clean centre at >=744px, as a fraction of the width. */
  gap?: number;
  /** Clean centre below 744px, where the copy takes more of the frame. */
  gapNarrow?: number;
  /** `clouds` for a section with copy in the middle, `dust` for ambience. */
  mode?: "clouds" | "dust";
  /** Scales the particle count: below 1 thins the field out. */
  density?: number;
  /**
   * Hold the field still while the page is scrolling, and pick it up again
   * once it stops.
   *
   * For a field inside a fixed element — the header — every drawn frame is a
   * repaint of a layer the compositor is already moving, which on a mid-range
   * phone cost more than a second of blocked main thread over three seconds
   * of scrolling. The particles drift a few pixels a second, so nobody is
   * watching them travel while the page is moving underneath.
   */
  pauseOnScroll?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sprites = new Map<string, HTMLCanvasElement>();
    const spriteFor = (rgb: string) => {
      let sprite = sprites.get(rgb);
      if (!sprite) {
        sprite = makeSprite(rgb);
        sprites.set(rgb, sprite);
      }
      return sprite;
    };

    let particles: Particle[] = [];
    let resizeTimer = 0;
    let width = 0;
    let height = 0;
    let gap = gapWide;
    let light = false;
    let frame = 0;
    let last = 0;
    let due = 0;
    let frameMs = FRAME_MS;
    let running = false;
    let built = false;

    function build() {
      const rect = canvas!.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      /*
       * Keyed off the viewport, not the canvas: a phone is a phone even where
       * its section is wide. The ratio caps at 1.5, or a 3x phone rasterises
       * nine device pixels per layout pixel of a deliberately blurry field.
       */
      light = window.innerWidth < LIGHT_BELOW;
      frameMs = light ? LIGHT_FRAME_MS : FRAME_MS;
      const dpr = Math.min(light ? 1.5 : 2, window.devicePixelRatio || 1);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);

      // A narrow viewport needs a wider clean centre: the copy takes
      // proportionally more of it.
      gap = light ? gapNarrow : gapWide;

      const d = DENSITY[mode];
      const count = Math.round(
        Math.min(d.max, Math.max(d.min, d.k * Math.sqrt(width * height))) *
          (light ? d.light : 1) *
          density,
      );
      const clusters: Record<number, Cluster[]> = {
        [-1]: makeClusters(),
        1: makeClusters(),
      };

      particles = Array.from({ length: count }, () => {
        const side: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
        const depth = Math.random() ** 1.35;
        const p: Particle = {
          side,
          cluster: clusters[side][Math.floor(Math.random() * 5)],
          x: 0,
          y: 0,
          depth,
          rgb: auroraColour(Math.random()),
          // Big and bright enough that the low count still reads as mass.
          size: 2 + depth * 6.8,
          alpha: 0,
          drift: 3 + depth * 11,
          swayAmp: 2 + depth * 7,
          swayFreq: 0.05 + Math.random() * 0.12,
          phase: Math.random() * Math.PI * 2,
          twinkleFreq: 0.15 + Math.random() * 0.5,
        };
        if (mode === "dust") {
          // Air rather than composition: it must never compete with what is
          // on top of it.
          p.size = 1.7 + p.depth * 3;
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.alpha = 0.28 + p.depth * 0.62;
          p.drift = 2 + p.depth * 6;
        } else {
          place(p, width, height, gap);
        }
        /* Baked in once on a phone: two sines a particle is the most
         * expensive thing in the loop, and neither is legible at this size. */
        if (light) {
          p.swayAmp = 0;
          p.alpha *= 0.82 + Math.random() * 0.32;
        }
        return p;
      });
      built = true;
    }

    function draw(elapsed: number) {
      const dpr = canvas!.width / width;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.globalCompositeOperation = "source-over";
      ctx!.clearRect(0, 0, width, height);
      ctx!.globalCompositeOperation = "lighter";

      for (const p of particles) {
        let x = p.x;
        let alpha = p.alpha;
        if (!light) {
          x += Math.sin(elapsed * p.swayFreq + p.phase) * p.swayAmp;
          alpha *= 0.78 + 0.22 * Math.sin(elapsed * p.twinkleFreq + p.phase);
        }
        if (alpha < 0.004) continue;
        ctx!.globalAlpha = Math.min(1, alpha);
        ctx!.drawImage(
          spriteFor(p.rgb),
          x - p.size / 2,
          p.y - p.size / 2,
          p.size,
          p.size,
        );
      }
      ctx!.globalAlpha = 1;
    }

    function step(now: number) {
      frame = requestAnimationFrame(step);
      // Hold to FPS rather than the display's rate. rAF is still the clock,
      // so the browser still parks the loop on a hidden tab.
      if (now < due) return;
      due = Math.max(now + frameMs, due + frameMs);

      const dt = Math.min(0.1, (now - last) / 1000 || 0);
      last = now;
      for (const p of particles) {
        p.y -= p.drift * dt;
        if (p.y < -p.size) {
          if (mode === "dust") p.x = Math.random() * width;
          else place(p, width, height, gap);
          p.y = height + p.size;
        }
      }
      draw(now / 1000);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    function start() {
      if (running || reduced.matches) return;
      running = true;
      last = performance.now();
      due = last;
      frame = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    /*
     * Nothing exists until the field is first reached: a reader who never
     * scrolls this far pays for a canvas element and an observer.
     *
     * Two cases cannot wait for the observer — no IntersectionObserver at all,
     * and a document hidden at mount (a background tab, a print), which is
     * never delivered intersections. Both draw one static frame; only the
     * first also starts the loop.
     */
    const noObserver = typeof IntersectionObserver === "undefined";
    if (noObserver || document.hidden) {
      build();
      draw(0);
    }
    if (noObserver) {
      start();
      return () => {
        stop();
        window.clearTimeout(resizeTimer);
        sprites.clear();
      };
    }

    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          visible = false;
          stop();
          return;
        }
        visible = true;
        if (!built) {
          build();
          draw(performance.now() / 1000);
        }
        start();
      },
      { rootMargin: "10% 0px" },
    );
    observer.observe(canvas);

    const onResize = () => {
      if (!built) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        draw(performance.now() / 1000);
      }, 200);
    };
    window.addEventListener("resize", onResize, { passive: true });

    /* Park the loop for the length of a scroll — see `pauseOnScroll`. */
    let scrollIdle = 0;
    const onScroll = () => {
      stop();
      window.clearTimeout(scrollIdle);
      scrollIdle = window.setTimeout(() => {
        if (visible) start();
      }, 200);
    };
    if (pauseOnScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(scrollIdle);
      sprites.clear();
    };
    // Changing the clean centre or the count rebuilds the field around it.
  }, [gapWide, gapNarrow, mode, density, pauseOnScroll]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
