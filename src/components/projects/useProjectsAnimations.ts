import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

export function useProjectsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "projects" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll<HTMLElement>("[data-project-item]");
    if (!items.length) return;

    items.forEach((item) => item.classList.remove("opacity-0"));
    gsap.set(items, { opacity: 0, y: 50, scale: 0.95 });

    const onHeadingDone = () => {
      const triggers: ScrollTrigger[] = [];
      items.forEach((item) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(item, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
            },
          }),
        );
      });
    };

    if ((section as any).__headingDone) { onHeadingDone(); return; }
    section.addEventListener("heading-done", onHeadingDone, { once: true });

    return () => section.removeEventListener("heading-done", onHeadingDone);
  }, []);

  return sectionRef;
}
