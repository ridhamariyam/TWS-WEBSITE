"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/** anime.js `easeOutQuad`, the easing used by every entrance animation on the reference. */
export const EASE_OUT_QUAD = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export type RevealFrom = {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
};

const GroupInView = createContext<boolean | null>(null);

function useInView<T extends Element>(enabled: boolean) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -5% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return { ref, inView };
}

type GroupProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/**
 * Triggers every nested <Reveal> at once when the group scrolls into view,
 * mirroring anime.js `targets` + `staggervalue` on a container. Children set
 * their own `delay` (base delay + index * stagger).
 */
export function RevealGroup({ as: Tag = "div", className, children }: GroupProps) {
  const { ref, inView } = useInView<HTMLElement>(true);
  return (
    <GroupInView.Provider value={inView}>
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    </GroupInView.Provider>
  );
}

type RevealProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  /** Starting state; animates to opacity 1 / no transform. Opacity defaults to 0. */
  from?: RevealFrom;
  /** Milliseconds. */
  duration?: number;
  /** Milliseconds. */
  delay?: number;
  easing?: string;
};

/**
 * Entrance animation: opacity/translate/scale from `from` to rest, once, when
 * the element (or its enclosing <RevealGroup>) enters the viewport.
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  from = {},
  duration = 600,
  delay = 0,
  easing = EASE_OUT_QUAD,
}: RevealProps) {
  const group = useContext(GroupInView);
  const self = useInView<HTMLElement>(group === null);
  const visible = group ?? self.inView;

  const hidden = `translate3d(${from.x ?? 0}px, ${from.y ?? 0}px, 0) scale(${from.scale ?? 1})`;
  const style: CSSProperties = {
    opacity: visible ? 1 : (from.opacity ?? 0),
    transform: visible ? "none" : hidden,
    transition: `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`,
  };

  return (
    <Tag ref={group === null ? self.ref : undefined} className={className} style={style}>
      {children}
    </Tag>
  );
}
