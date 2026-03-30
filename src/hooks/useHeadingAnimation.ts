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
 * Section heading entrance via IntersectionObserver.
 * Observes the heading label element (not the section) so it triggers
 * when the heading is actually visible, not when the tall section barely enters.
 * Dispatches "heading-done" on the section when the animation completes.
 * If the user scrolls past fast, skips animation and fires immediately.
 */
export function useHeadingAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: HeadingAnimationOptions,
) {
  const { prefix, charStagger = 0.04, charDuration = 0.45 } = options;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) {
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

    // Observe the label element — triggers when heading is actually on screen
    const target = label || section;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          tl = gsap.timeline({
            defaults: { ease: "power4.out" },
            onComplete: fireHeadingDone,
          });

          if (label) {
            tl.to(label, { y: 0, opacity: 1, duration: 0.25 });
          }
          if (chars.length) {
            tl.to(chars, { y: "0%", duration: charDuration, stagger: charStagger }, "-=0.2");
          }
        }
      },
      { threshold: 0.1, rootMargin: "-15% 0px" },
    );

    // If user scrolls past the section before heading finishes, skip instantly
    const leaveObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && tl && !fired) {
          tl.progress(1);
          fireHeadingDone();
          leaveObserver.disconnect();
        }
      },
      { threshold: 0 },
    );

    observer.observe(target);
    leaveObserver.observe(section);

    return () => {
      observer.disconnect();
      leaveObserver.disconnect();
    };
  }, []);
}

export { REDUCED_MOTION };
