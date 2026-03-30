import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface HeadingAnimationOptions {
  prefix: string;
  charStagger?: number;
  charDuration?: number;
}

/**
 * Section heading + content entrance using GSAP ScrollTrigger.
 * Single timeline: heading animates first, then content follows.
 * ScrollTrigger handles fast scroll, slow scroll, and all edge cases.
 */
export function useHeadingAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: HeadingAnimationOptions,
) {
  const { prefix, charStagger = 0.04, charDuration = 0.45 } = options;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const label = section.querySelector(`[data-${prefix}-label]`);
    const chars = section.querySelectorAll(`[data-${prefix}-char]`);

    if (REDUCED_MOTION()) {
      if (label) gsap.set(label, { opacity: 1, y: 0 });
      if (chars.length) gsap.set(chars, { y: "0%" });
      section.dispatchEvent(new Event("heading-done", { bubbles: false }));
      return;
    }

    if (label) gsap.set(label, { opacity: 0, y: 15 });
    if (chars.length) gsap.set(chars, { y: "110%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        once: true,
      },
      onComplete: () => {
        (section as any).__headingDone = true;
        section.dispatchEvent(new Event("heading-done", { bubbles: false }));
      },
    });

    if (label) {
      tl.to(label, { y: 0, opacity: 1, duration: 0.25, ease: "power4.out" });
    }
    if (chars.length) {
      tl.to(chars, { y: "0%", duration: charDuration, stagger: charStagger, ease: "power4.out" }, "-=0.2");
    }

    return () => {
      tl.kill();
    };
  }, []);
}

export { REDUCED_MOTION };
