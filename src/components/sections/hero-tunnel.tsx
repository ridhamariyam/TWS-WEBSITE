import { beat, EASE } from "@/components/sections/hero-beat";
import {
  CYCLE,
  FRAMES,
  OPEN,
  OPEN_AT,
  OPEN_FOR,
  PUSH,
  frameBeat,
  frameVars,
} from "@/components/sections/hero-tunnel-data";
import styles from "./hero-tunnel.module.css";

/*
 * The hero's load transition: the wall, and the first pass of the tunnel.
 *
 * A wall covers the viewport, outlines travel out through it, then its own
 * aperture opens and carries the darkness away — the same forward motion that
 * drives the tunnel, rather than a cut or a fade. It hands over to
 * `HeroTunnelLoop`, which runs identical frames on identical beats, so this
 * layer can fade out over the top without the swap being visible.
 *
 * Entirely CSS and no timer, so the wall covers the screen in the first
 * painted frame, already populated. Both animations end on
 * `visibility: hidden`. CSS removes the whole overlay on visits that have
 * already seen it — see `HeroIntro`.
 */

export function HeroTunnel() {
  return (
    <div className={styles.overlay} aria-hidden="true">
      <div
        className={`tws-beat ${styles.tunnel}`}
        style={beat(OPEN_AT + 0.07, 0.55, EASE.out)}
      >
        {FRAMES.map((frame, i) => (
          <div
            key={i}
            className={`tws-beat ${styles.frame} ${frame.lime ? styles.glow : ""}`}
            style={{ ...beat(frameBeat(i), CYCLE, PUSH), ...frameVars(frame) }}
          />
        ))}
      </div>

      <div
        className={`tws-beat ${styles.aperture}`}
        style={beat(OPEN_AT, OPEN_FOR, OPEN)}
      />
    </div>
  );
}
