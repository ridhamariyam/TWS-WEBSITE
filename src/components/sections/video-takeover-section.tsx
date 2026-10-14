"use client";

import { useEffect, useRef, useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/ui/icons";
import styles from "./video-takeover-section.module.css";

/*
 * "Inside the studio": a contained film that takes over the viewport as you
 * scroll past it.
 *
 * The video is a full-viewport cover layer the whole time; what animates is
 * the window `clip-path` cuts out of it. Nothing crossfades and nothing is
 * swapped — the frame simply stops hiding it.
 *
 * Scroll drives one custom property, `--p`, and the stylesheet derives every
 * dimension from it, so the scrub cannot get out of step with itself. The
 * listener is rAF-throttled and only runs while the section is on screen.
 *
 * LICENCE: `studio-film.mp4` arrived as a motion reference, not as licensed
 * footage, and its provenance is unestablished. It needs a licence on file or
 * replacing with the studio's own before launch. See AGENTS.md.
 */

/** Fraction of the pinned scroll spent opening, before the full-bleed hold. */
const OPEN_AT = 0.62;

/** Attached by script once the section is near; never in the HTML. */
const SOURCE = "/videos/studio-film.mp4";
/** What stands in until then, and for anyone who never gets the film. */
const POSTER = "/videos/studio-film-poster.webp";

export function VideoTakeoverSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  /*
   * Whether the reader asked the film to stop — separate from the observer's
   * own pausing, which must not restart a deliberately stopped film.
   */
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);

  /*
   * The film is 1.5MB and sits eight screens down, so neither it nor its
   * poster is in the markup: a `poster` attribute is fetched eagerly whatever
   * `preload` says. Both are attached a viewport before the section arrives,
   * and playback follows visibility from there. Until they land the stage
   * carries the aurora, so it is never an empty rectangle.
   *
   * The still is painted as the stage's own background rather than set as the
   * video's `poster`. WebKit does not apply `object-fit` to a poster, so on
   * iOS the attribute renders it letterboxed inside a full-bleed frame — with
   * the aurora showing above and below it — and that is exactly what a reader
   * sees whenever autoplay is refused, which Low Power Mode does by default.
   * A background honours `cover` everywhere.
   *
   * Under `prefers-reduced-motion` the film is never attached: the still is
   * the section, and the takeover runs as a static frame.
   */
  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let attached = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (attached && !reduced) video.pause();
          return;
        }
        if (!attached) {
          attached = true;
          stage.style.backgroundImage = `url(${POSTER})`;
          if (reduced) {
            observer.disconnect();
            return;
          }
          video.src = SOURCE;
          video.load();
        }
        if (pausedRef.current) return;
        void video.play().catch(() => {
          /*
           * Refused — Low Power Mode, a data saver, a strict autoplay policy.
           * The still stands in, and the control has to say so: left alone it
           * offers "Pause" for a film that is not running.
           */
          pausedRef.current = true;
          setPaused(true);
        });
      },
      { rootMargin: "120% 0px" },
    );
    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const runway = runwayRef.current;
    const viewport = viewportRef.current;
    if (!section || !runway || !viewport) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) section.classList.add(styles.static);

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = runway.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const travelled = Math.min(Math.max(-rect.top, 0), total);
      const p = Math.min(1, travelled / total / OPEN_AT);
      // Smoothstep, so the frame eases off its marks at both ends.
      viewport.style.setProperty("--p", (p * p * (3 - 2 * p)).toFixed(4));
    };

    const onScroll = () => {
      if (frame || !visible || reduced) return;
      frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) return;
        if (!reduced) update();
      },
      // Enough warning for the clip to be ready when the frame arrives.
      { rootMargin: "150% 0px" },
    );
    observer.observe(section);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={sectionRef} id="studio-in-motion" className={styles.section}>
      <div ref={runwayRef} className={styles.runway}>
        <div ref={viewportRef} className={styles.viewport}>
          <div ref={stageRef} className={styles.stage}>
            <video
              ref={videoRef}
              className={styles.video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
            />
            <div className={styles.scrim} aria-hidden="true" />

            <button
              type="button"
              className={styles.pause}
              aria-pressed={paused}
              aria-label={paused ? "Play the studio film" : "Pause the studio film"}
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;
                const next = !paused;
                pausedRef.current = next;
                setPaused(next);
                if (next) {
                  video.pause();
                } else {
                  void video.play().catch(() => {});
                }
              }}
            >
              {paused ? (
                <PlayIcon width={10} height={14} />
              ) : (
                <PauseIcon width={10} height={14} />
              )}
            </button>
          </div>

          <div className={styles.frame} aria-hidden="true" />

          <div className={styles.caption}>
            <p className={`type-eyebrow ${styles.eyebrow}`}>Inside the studio</p>
            <p className={`type-subtitle3 ${styles.line}`}>
              Every project starts with a conversation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
