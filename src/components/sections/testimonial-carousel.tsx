"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import { createPortal } from "react-dom";
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { RichText } from "@/components/ui/rich-text";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/content";

const AUTOPLAY_MS = 3000;
const SPEED_MS = 500;
/** Space between slides (Swiper `spaceBetween`), only visible mid-transition. */
const SLIDE_GAP = 30;
/** Fraction of the slide width a drag must pass to change slide. */
const DRAG_THRESHOLD = 0.15;
const FLICK_MS = 250;
const FLICK_PX = 20;
const CURSOR_SIZE = 70;

/* ------------------------------------------------------------------ */
/* Environment hooks (external stores keep effects free of setState)   */
/* ------------------------------------------------------------------ */

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

function useDocumentVisible() {
  return useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true,
  );
}

/* ------------------------------------------------------------------ */
/* Carousel state                                                      */
/* ------------------------------------------------------------------ */

/**
 * The track holds [clone of last, ...items, clone of first], so `pos` runs
 * 0..count+1 and real slides live at 1..count. After animating onto a clone
 * the track "settles" onto the clone's real twin without a transition.
 */
type CarouselState = {
  pos: number;
  animate: boolean;
  dragging: boolean;
  /** Extra px translation while dragging. */
  offset: number;
};

type CarouselAction =
  | { type: "step"; delta: 1 | -1; count: number }
  | { type: "settle"; count: number }
  | { type: "dragStart"; pos: number; offset: number; count: number }
  | { type: "dragMove"; offset: number }
  | { type: "dragEnd"; delta: -1 | 0 | 1 };

function twin(pos: number, count: number) {
  if (pos <= 0) return count;
  if (pos >= count + 1) return 1;
  return pos;
}

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  switch (action.type) {
    case "step": {
      const next = state.pos + action.delta;
      // Ignore while dragging, or while still sitting on a clone (the settle is imminent).
      if (state.dragging || next < 0 || next > action.count + 1) return state;
      return { ...state, pos: next, animate: true };
    }
    case "settle": {
      const pos = twin(state.pos, action.count);
      if (pos === state.pos || state.dragging) return state;
      return { ...state, pos, animate: false };
    }
    case "dragStart":
      return { pos: twin(action.pos, action.count), animate: false, dragging: true, offset: action.offset };
    case "dragMove":
      return state.dragging ? { ...state, offset: action.offset } : state;
    case "dragEnd":
      return { pos: state.pos + action.delta, animate: true, dragging: false, offset: 0 };
  }
}

type DragSession = {
  pointerId: number;
  startX: number;
  startTime: number;
  /** Offset at pointerdown (non-zero when grabbing mid-transition). */
  baseOffset: number;
  width: number;
  step: number;
};

type TestimonialCarouselProps = {
  items: Testimonial[];
  className?: string;
};

export function TestimonialCarousel({ items, className }: TestimonialCarouselProps) {
  const count = items.length;
  const looping = count > 1;
  const slides = looping ? [items[count - 1], ...items, items[0]] : items;

  const [state, dispatch] = useReducer(carouselReducer, {
    pos: looping ? 1 : 0,
    animate: false,
    dragging: false,
    offset: 0,
  });

  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const documentVisible = useDocumentVisible();

  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragSession | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPoint = useRef({ x: 0, y: 0 });
  const cursorFrame = useRef(0);

  const activeIndex = looping ? twin(state.pos, count) - 1 : 0;
  const onClone = looping && (state.pos === 0 || state.pos === count + 1);
  const autoplaying =
    looping && !reducedMotion && documentVisible && !hovered && !keyboardFocus && !state.dragging;

  // After a non-animated jump, flush styles so the next animated move starts from the jumped position.
  useLayoutEffect(() => {
    if (!state.animate) trackRef.current?.getBoundingClientRect();
  }, [state.pos, state.animate]);

  // Settle off a clone; backs up `transitionend`, which may not fire (hidden tab, interrupted transition).
  useEffect(() => {
    if (!onClone || state.dragging) return;
    const timer = window.setTimeout(() => dispatch({ type: "settle", count }), SPEED_MS + 50);
    return () => window.clearTimeout(timer);
  }, [onClone, state.pos, state.dragging, count]);

  // Autoplay: restart the countdown after every slide change.
  useEffect(() => {
    if (!autoplaying) return;
    const timer = window.setTimeout(() => dispatch({ type: "step", delta: 1, count }), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplaying, state.pos, count]);

  const step = (delta: 1 | -1) => dispatch({ type: "step", delta, count });

  const handleTransitionEnd = (event: ReactTransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === "transform") {
      dispatch({ type: "settle", count });
    }
  };

  /* ---------------------------- magic cursor ---------------------------- */

  const paintCursor = () => {
    cursorFrame.current = 0;
    const el = cursorRef.current;
    if (!el) return;
    const { x, y } = cursorPoint.current;
    el.style.transform = `translate3d(${x - CURSOR_SIZE / 2}px, ${y - CURSOR_SIZE / 2}px, 0)`;
  };

  const trackCursor = (event: ReactPointerEvent<HTMLDivElement>, immediate = false) => {
    if (!finePointer || event.pointerType !== "mouse") return;
    cursorPoint.current = { x: event.clientX, y: event.clientY };
    if (immediate) {
      if (cursorFrame.current) cancelAnimationFrame(cursorFrame.current);
      paintCursor();
    } else if (!cursorFrame.current) {
      cursorFrame.current = requestAnimationFrame(paintCursor);
    }
  };

  /* ------------------------------- dragging ------------------------------ */

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;

    const dx = event.clientX - drag.startX;
    const total = drag.baseOffset + dx;
    const flick = event.timeStamp - drag.startTime < FLICK_MS && Math.abs(dx) > FLICK_PX;
    const past = Math.abs(total) > drag.width * DRAG_THRESHOLD;
    const direction = flick ? dx : total;
    const delta = cancelled || !(flick || past) ? 0 : direction < 0 ? 1 : -1;
    dispatch({ type: "dragEnd", delta });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!looping || !track || !event.isPrimary) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.pointerType === "mouse") event.preventDefault(); // no text selection while dragging

    // Grab the track where it currently is, even mid-transition.
    const width = track.offsetWidth;
    const slideStep = width + SLIDE_GAP;
    const current = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    const nearest = Math.min(count + 1, Math.max(0, Math.round(-current / slideStep)));
    const baseOffset = current + nearest * slideStep;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTime: event.timeStamp,
      baseOffset,
      width,
      step: slideStep,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    dispatch({ type: "dragStart", pos: nearest, offset: baseOffset, count });
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    trackCursor(event);
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const offset = drag.baseOffset + event.clientX - drag.startX;
    dispatch({ type: "dragMove", offset: Math.max(-drag.step, Math.min(drag.step, offset)) });
  };

  /* ------------------------------- focus -------------------------------- */

  const handleFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (event.target.matches(":focus-visible")) setKeyboardFocus(true);
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setKeyboardFocus(false);
  };

  const transform = `translate3d(calc(${-state.pos * 100}% - ${state.pos * SLIDE_GAP}px + ${state.offset}px), 0, 0)`;

  const arrowClass =
    "absolute top-[150px] z-[9] flex size-[60px] cursor-pointer items-center justify-center rounded-full bg-charcoal text-white transition-[color,opacity] duration-300 hover:text-white/50 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime max-lg:top-[10px]";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      className={cn("w-1/2 pl-[15px] max-lg:relative max-lg:w-full max-lg:pt-[90px] max-lg:pl-0", className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {looping && (
        <>
          <button type="button" aria-label="Previous slide" className={cn(arrowClass, "left-0")} onClick={() => step(-1)}>
            <ArrowLeftIcon className="h-[17px] w-[15px]" />
          </button>
          <button type="button" aria-label="Next slide" className={cn(arrowClass, "left-[70px]")} onClick={() => step(1)}>
            <ArrowRightIcon className="h-[17px] w-[15px]" />
          </button>
        </>
      )}

      <div
        className={cn("touch-pan-y overflow-hidden", finePointer && "cursor-none")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(event) => endDrag(event, false)}
        onPointerCancel={(event) => endDrag(event, true)}
        onLostPointerCapture={(event) => endDrag(event, false)}
        onPointerEnter={(event) => {
          if (!finePointer || event.pointerType !== "mouse") return;
          trackCursor(event, true);
          setCursorVisible(true);
        }}
        onPointerLeave={() => setCursorVisible(false)}
      >
        <div
          ref={trackRef}
          aria-live={autoplaying ? "off" : "polite"}
          className="flex gap-[30px]"
          style={{
            transform,
            transition: state.animate && !state.dragging ? `transform ${SPEED_MS}ms ease` : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((item, i) => {
            const isClone = looping && (i === 0 || i === slides.length - 1);
            const realIndex = looping ? twin(i, count) - 1 : i;
            const hidden = isClone || realIndex !== activeIndex;
            return (
              <div
                key={isClone ? `clone-${i}` : `slide-${realIndex}`}
                role={isClone ? undefined : "group"}
                aria-roledescription={isClone ? undefined : "slide"}
                aria-label={isClone ? undefined : `${realIndex + 1} of ${count}`}
                aria-hidden={hidden || undefined}
                className="w-full shrink-0"
              >
                <figure>
                  <blockquote className="mb-[20px] w-[90%] text-[32px] leading-[42px] font-normal tracking-[-0.5px] text-white max-lg:w-full max-lg:text-[28px] max-lg:leading-[36.75px] max-md:text-[24px] max-md:leading-[31.5px]">
                    <RichText value={item.quote} emphasisClassName="font-medium text-white border-b-2 border-white" />
                  </blockquote>
                  <figcaption>
                    <span className="inline-block text-[15px] leading-[22px] font-semibold tracking-[2px] text-lime uppercase">
                      {item.author}
                    </span>
                  </figcaption>
                </figure>
              </div>
            );
          })}
        </div>
      </div>

      {finePointer &&
        createPortal(
          <div
            ref={cursorRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-[10000] size-[70px] rounded-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.25)] transition-opacity delay-100 duration-300 ease-in-out"
            style={{ opacity: cursorVisible ? 1 : 0 }}
          >
            <span className="absolute inset-0 flex items-center justify-between px-[10.5px] text-ink">
              <ChevronDownIcon className="size-5 rotate-90" />
              <ChevronDownIcon className="size-5 -rotate-90" />
            </span>
          </div>,
          document.body,
        )}
    </div>
  );
}
