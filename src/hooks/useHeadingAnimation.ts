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
 * Works reliably regardless of pinned sections above.
 */
export function useHeadingAnimation(
  sectionRef: React.RefObject<HTMLElement | null>,
  options: HeadingAnimationOptions,
) {
  const { prefix, charStagger = 0.08, charDuration = 0.7 } = options;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const label = section.querySelector(`[data-${prefix}-label]`);
    const chars = section.querySelectorAll(`[data-${prefix}-char]`);

    if (label) gsap.set(label, { opacity: 0, y: 15 });
    if (chars.length) gsap.set(chars, { y: "110%" });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();

          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

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

    observer.observe(section);
    return () => observer.disconnect();
  }, []);
}

export { REDUCED_MOTION };
