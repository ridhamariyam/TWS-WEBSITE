"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

const PARTICLE_COUNT = 3;
const PARTICLE_COLORS = ["#000000", "#BEFF01"] as const;
const MAX_RADIUS = 4;
const MIN_RADIUS = 0.6;
/** Reference particles.js `move.speed: 6`, applied per frame as speed / 2. */
const SPEED = 3;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createParticle(width: number, height: number): Particle {
  const radius = Math.max(Math.random() * MAX_RADIUS, MIN_RADIUS);
  return {
    x: clamp(Math.random() * width, radius, width - radius),
    y: clamp(Math.random() * height, radius, height - radius),
    vx: Math.random() - 0.5,
    vy: Math.random() - 0.5,
    radius,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  };
}

type HeroParticlesProps = {
  className?: string;
};

/**
 * Canvas filling the parent section with a few drifting dots that bounce off
 * the edges. Paused while off-screen; drawn once (static) under reduced motion.
 */
export function HeroParticles({ className }: HeroParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const container = canvas.parentElement ?? canvas;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId = 0;
    let inView = false;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    };

    const move = () => {
      for (const p of particles) {
        p.x += p.vx * SPEED;
        p.y += p.vy * SPEED;

        if (p.x + p.radius > width) p.vx = -Math.abs(p.vx);
        else if (p.x - p.radius < 0) p.vx = Math.abs(p.vx);

        if (p.y + p.radius > height) p.vy = -Math.abs(p.vy);
        else if (p.y - p.radius < 0) p.vy = Math.abs(p.vy);
      }
    };

    const tick = () => {
      move();
      draw();
      frameId = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const sync = () => {
      const shouldRun = inView && !motionQuery.matches && width > 0 && height > 0;
      if (shouldRun && !frameId) frameId = requestAnimationFrame(tick);
      else if (!shouldRun) stop();
    };

    const resize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;
      if (!nextWidth || !nextHeight) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(nextWidth * dpr);
      canvas.height = Math.round(nextHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = nextWidth;
      height = nextHeight;

      if (particles.length === 0) {
        particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(width, height));
      } else {
        for (const p of particles) {
          p.x = clamp(p.x, p.radius, width - p.radius);
          p.y = clamp(p.y, p.radius, height - p.radius);
        }
      }

      draw();
      sync();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(canvas);

    const onMotionChange = () => {
      draw();
      sync();
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 block size-full", className)}
    />
  );
}
