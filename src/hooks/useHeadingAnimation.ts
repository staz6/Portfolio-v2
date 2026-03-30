import { useEffect } from "react";
import gsap from "gsap";

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface HeadingAnimationOptions {
  prefix: string;
  charStagger?: number;
  charDuration?: number;
}

/**
 * Section heading entrance via IntersectionObserver (not ScrollTrigger).
 * Dispatches "heading-done" on the section when the animation completes.
 * If the user scrolls past fast, skips animation and fires immediately.
 */
export function useHeadingAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: HeadingAnimationOptions,
) {
  const { prefix, charStagger = 0.08, charDuration = 0.7 } = options;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) {
      // Fire immediately for reduced-motion so content hooks can reveal
      section?.dispatchEvent(new Event("heading-done", { bubbles: false }));
      return;
    }

    const label = section.querySelector(`[data-${prefix}-label]`);
    const chars = section.querySelectorAll(`[data-${prefix}-char]`);

    if (label) gsap.set(label, { opacity: 0, y: 15 });
    if (chars.length) gsap.set(chars, { y: "110%" });

    let fired = false;
    const fireHeadingDone = () => {
      if (fired) return;
      fired = true;
      section.dispatchEvent(new Event("heading-done", { bubbles: false }));
    };

    let tl: gsap.core.Timeline | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          tl = gsap.timeline({
            defaults: { ease: "power4.out" },
            onComplete: fireHeadingDone,
          });

          if (label) {
            tl.to(label, { y: 0, opacity: 1, duration: 0.4 });
          }
          if (chars.length) {
            tl.to(chars, { y: "0%", duration: charDuration, stagger: charStagger }, "-=0.2");
          }
        }
      },
      { threshold: 0.1 },
    );

    // Second observer: if section leaves viewport before heading finishes,
    // skip the animation and show everything immediately
    const leaveObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && tl && !fired) {
          // User scrolled past — complete instantly
          tl.progress(1);
          fireHeadingDone();
          leaveObserver.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(section);
    leaveObserver.observe(section);

    return () => {
      observer.disconnect();
      leaveObserver.disconnect();
    };
  }, []);
}

export { REDUCED_MOTION };
