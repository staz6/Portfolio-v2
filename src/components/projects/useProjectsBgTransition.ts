import { useEffect, type RefObject } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbed circle spread from top-left corner.
 * The more you scroll down, the more the color spreads.
 * Fully tied to scroll position — no snap animations.
 */
export function useProjectsBgTransition(
  sectionRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Create the overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 1;
      pointer-events: none;
      background-color: var(--section-alt);
      clip-path: circle(0% at 0% 0%);
    `;
    section.insertBefore(overlay, section.firstChild);

    // Scrub-linked tween: scroll controls the clip-path progress
    const tween = gsap.fromTo(
      overlay,
      { clipPath: "circle(0% at 0% 0%)" },
      { clipPath: "circle(175% at 0% 0%)", ease: "none" }
    );

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "top 10%",
      scrub: 0.5,
      animation: tween,
    });

    return () => {
      trigger.kill();
      tween.kill();
      overlay.remove();
    };
  }, [sectionRef]);
}
