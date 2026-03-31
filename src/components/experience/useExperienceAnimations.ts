import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useExperienceAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "experience" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const content = section.querySelector<HTMLElement>("[data-exp-content]");
    if (!content) return;

    const onHeadingDone = () => {
      gsap.to(content, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    };

    if ((section as any).__headingDone) { onHeadingDone(); return; }
    section.addEventListener("heading-done", onHeadingDone, { once: true });

    return () => section.removeEventListener("heading-done", onHeadingDone);
  }, []);

  return sectionRef;
}
