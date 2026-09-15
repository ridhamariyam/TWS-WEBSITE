import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import styles from "./hero-section.module.css";

const RAY_COUNT = 100;
const RAY_STAGGER_MS = 60;

type RayStyle = CSSProperties & { "--ray-angle": string };

// (i * 36) / 10 keeps the angles free of float noise (3.6 * 3 = 10.799999…).
const rays = Array.from({ length: RAY_COUNT }, (_, i) => ({
  angle: `${(i * 36) / 10}deg`,
  delay: `${i * RAY_STAGGER_MS}ms`,
}));

type HeroRaysProps = {
  className?: string;
};

/**
 * Ring of 100 lime bars (3.6deg apart) around the hero's centre, sized in vh.
 * A CSS keyframe pulse (rotate +10deg, translateY -40%, scale 1.25) travels
 * around the ring: 6s loop, 60ms stagger per bar.
 */
export function HeroRays({ className }: HeroRaysProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 flex h-screen w-px -translate-y-1/2 items-center",
        className,
      )}
    >
      {rays.map((ray) => {
        const style: RayStyle = { "--ray-angle": ray.angle, animationDelay: ray.delay };
        return <span key={ray.angle} className={styles.ray} style={style} />;
      })}
    </div>
  );
}
