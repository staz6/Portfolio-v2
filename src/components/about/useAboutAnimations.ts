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

    if (REDUCED_MOTION()) {
      gsap.set(
        section.querySelectorAll(
          "[data-about-line], [data-about-pill], [data-about-divider], [data-v2-skill-word], [data-v2-dot]",
        ),
        { opacity: 1, y: 0, x: 0, scale: 1, scaleX: 1 },
      );
      if (sceneWrap) gsap.set(sceneWrap, { opacity: 1 });
      if (content) gsap.set(content, { opacity: 1 });
      window.dispatchEvent(new Event("about-scene-enter"));
      return;
    }

    const onHeadingDone = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (sceneWrap) {
        tl.to(sceneWrap, {
          opacity: 1, y: 0, duration: 0.5,
          onStart: () => { window.dispatchEvent(new Event("about-scene-enter")); },
        });
      }

      if (content) {
        tl.to(content, { opacity: 1, y: 0, duration: 0.5 }, "<");
      }
    };

    if ((section as any).__headingDone) { onHeadingDone(); return; }
    section.addEventListener("heading-done", onHeadingDone, { once: true });

    return () => section.removeEventListener("heading-done", onHeadingDone);
  }, []);

  return sectionRef;
}
