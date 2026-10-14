"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/*
 * A muted, looping film that plays only while it is on screen.
 *
 * Nothing loads until the film is near the viewport (`preload="none"` plus
 * the poster), it pauses again when it leaves, and under reduced motion it
 * never plays: the poster stands in. Every film on the site is decorative or
 * shows work the copy beside it already describes, so it is hidden from
 * assistive technology unless a `label` says otherwise.
 */
export function Film({
  src,
  poster,
  width,
  height,
  label,
  className,
}: {
  src: string;
  poster: string;
  /** The cut's own size, so the box is reserved before anything loads. */
  width: number;
  height: number;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.preload = "auto";
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn("block h-auto w-full object-cover", className)}
    />
  );
}
