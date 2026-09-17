"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The hero's three odometer counters.
 *
 * Each digit is a vertical reel of 0-9 that spins up and settles on its final
 * value, which is how the live page renders these — the DOM ships ten
 * `.stats__number` spans per digit, offset in whole slot-heights, and animates
 * the offset. Reading the numbers off a screenshot gives you a mid-spin frame
 * (17M+, $10B+, 173+), so the real values below come from each counter's
 * `aria-label`.
 *
 * `.stats__counter--static` in the source is the no-JS fallback; here that role
 * is played by rendering the plain value until the reel is armed, which also
 * covers `prefers-reduced-motion`.
 */

type Stat = { value: string; label: string; mobileHide?: boolean };

const STATS: Stat[] = [
  { value: "14M+", label: "Entrepreneurs Served" },
  { value: "$36B+", label: "Earned by Entrepreneurs" },
  { value: "200+", label: "Countries & Territories", mobileHide: true },
];

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

function DigitReel({ digit, spin }: { digit: string; spin: boolean }) {
  const target = Number(digit);
  // Before arming, park two full turns above so the settle reads as a count-up.
  const offset = spin ? target : target - DIGITS.length * 2;

  return (
    <span className="relative mx-[0.28em] inline-block" aria-hidden="true">
      {/* Reserves the slot: one digit tall and wide, never rendered. */}
      <span className="invisible">{digit}</span>
      <span
        className="absolute inset-0 flex flex-col transition-transform duration-[1600ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={{ transform: `translateY(${-offset * 100}%)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="flex shrink-0 basis-full justify-center">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

function Counter({ value, spin }: { value: string; spin: boolean }) {
  return (
    <p
      className="text-title3 flex justify-center overflow-y-clip font-light [line-height:normal]"
      aria-label={value}
    >
      {[...value].map((char, i) =>
        /\d/.test(char) ? (
          <DigitReel key={i} digit={char} spin={spin} />
        ) : (
          <span key={i} aria-hidden="true">
            {char}
          </span>
        ),
      )}
    </p>
  );
}

export function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  // Reduced motion skips the spin entirely and renders the settled value.
  const [spin, setSpin] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || spin) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setSpin(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [spin]);

  return (
    <div className="bg-primitive-black">
      <div className="flex items-center justify-center bg-primitive-black pt-20 pb-10">
        <p className="text-body w-[calc((var(--grid-column-width)*8)+(var(--grid-gutter-width)*7))] text-center text-gray-200 bp744:w-[calc((var(--grid-column-width)*6)+(var(--grid-gutter-width)*5))] bp1280:w-[calc((var(--grid-column-width)*10)+(var(--grid-gutter-width)*9))]">
          Join millions of entrepreneurs who run their business on Squarespace.
        </p>
      </div>
      <div
        ref={ref}
        className="flex items-start justify-center gap-4 pb-20 bp744:gap-16"
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "flex flex-col gap-3 text-center opacity-0 bp744:gap-4",
              stat.mobileHide && "hidden bp744:flex",
              spin && "animate-[fadeIn_1.2s_cubic-bezier(0.23,1,0.32,1)_forwards]",
            )}
            style={{ animationDelay: `${0.2 * (i + 1)}s` }}
          >
            <Counter value={stat.value} spin={spin} />
            <p className="text-footnote">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
