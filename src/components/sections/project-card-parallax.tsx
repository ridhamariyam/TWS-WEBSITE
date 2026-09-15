"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Parallax, type ParallaxFrame } from "@/components/motion/parallax";

/** Card parallax runs from 768px up; below that the reference keeps cards static. */
const QUERY = "(min-width: 768px)";
const REST: ParallaxFrame = { y: 0 };

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// Server render and hydration start static, so mobile never flashes an offset.
const getServerSnapshot = () => false;

type ProjectCardParallaxProps = {
  from: ParallaxFrame;
  to: ParallaxFrame;
  className?: string;
  children: ReactNode;
};

export function ProjectCardParallax({ from, to, className, children }: ProjectCardParallaxProps) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Parallax className={className} from={enabled ? from : REST} to={enabled ? to : REST}>
      {children}
    </Parallax>
  );
}
