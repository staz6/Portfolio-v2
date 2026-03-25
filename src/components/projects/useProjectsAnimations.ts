import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

gsap.registerPlugin(ScrollTrigger);

export function useProjectsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "projects", charStagger: 0.15 });

  // ── Cards staggered entrance ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-project-item]");
    if (!items.length) return;

    gsap.set(items, { y: 100, opacity: 0, scale: 0.95 });

    const triggers: ScrollTrigger[] = [];

    items.forEach((item, i) => {
      const trigger = ScrollTrigger.create({
        trigger: item,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(item, {
            y: 0, opacity: 1, scale: 1, duration: 1,
            delay: (i % 2) * 0.15, ease: "power3.out",
          });
        },
        onRefresh: (self) => {
          if (self.progress > 0) gsap.set(item, { y: 0, opacity: 1, scale: 1 });
        },
      });
      triggers.push(trigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return sectionRef;
}
