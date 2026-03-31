import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useAboutAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "about" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const sceneWrap = section.querySelector<HTMLElement>("[data-about-scene-wrap]");
    const content = section.querySelector<HTMLElement>("[data-about-content]");
    const lines = section.querySelectorAll("[data-about-line]");
    const divider = section.querySelector("[data-about-divider]");
    const pills = section.querySelectorAll("[data-about-pill]");

    if (REDUCED_MOTION()) {
      gsap.set([...lines, ...pills], { opacity: 1, y: 0, scale: 1 });
      if (divider) gsap.set(divider, { scaleX: 1, opacity: 1 });
      if (sceneWrap) gsap.set(sceneWrap, { opacity: 1 });
      if (content) gsap.set(content, { opacity: 1 });
      window.dispatchEvent(new Event("about-scene-enter"));
      return;
    }

    // Hide individual elements for staggered reveal
    gsap.set(lines, { y: 20, opacity: 0 });
    if (divider) gsap.set(divider, { scaleX: 0, transformOrigin: "left" });
    gsap.set(pills, { y: 15, opacity: 0, scale: 0.9 });

    const onHeadingDone = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Sphere fades in
      if (sceneWrap) {
        tl.to(sceneWrap, {
          opacity: 1, y: 0, duration: 0.5,
          onStart: () => { window.dispatchEvent(new Event("about-scene-enter")); },
        });
      }

      // 2. Content wrapper visible (needed for children to show)
      if (content) {
        tl.to(content, { opacity: 1, y: 0, duration: 0.3 }, "<");
      }

      // 3. Paragraphs stagger in
      if (lines.length) {
        tl.to(lines, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.2");
      }

      // 4. Divider grows from left
      if (divider) {
        tl.to(divider, { scaleX: 1, duration: 0.4 }, "-=0.2");
      }

      // 5. Skill pills pop in
      if (pills.length) {
        tl.to(pills, { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.06, ease: "back.out(1.7)" }, "-=0.2");
      }
    };

    if ((section as any).__headingDone) { onHeadingDone(); return; }
    section.addEventListener("heading-done", onHeadingDone, { once: true });

    return () => section.removeEventListener("heading-done", onHeadingDone);
  }, []);

  return sectionRef;
}
