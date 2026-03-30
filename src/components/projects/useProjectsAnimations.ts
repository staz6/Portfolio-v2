import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useProjectsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "projects" });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll<HTMLElement>("[data-project-item]");
    if (!items.length) return;

    const reveal = () => {
      const viewportBottom = window.scrollY + window.innerHeight;

      items.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top + window.scrollY;
        const isInView = itemTop < viewportBottom;

        // Remove CSS opacity-0 class so it doesn't fight with GSAP inline styles
        item.classList.remove("opacity-0");

        if (isInView) {
          // Already visible — show instantly, no blink
          gsap.set(item, { opacity: 1, y: 0, scale: 1 });
        } else {
          // Below viewport — animate in when scrolled to
          gsap.set(item, { opacity: 0, y: 60, scale: 0.95 });
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                observer.disconnect();
                gsap.to(item, {
                  opacity: 1, y: 0, scale: 1,
                  duration: 0.5, ease: "power3.out",
                });
              }
            },
            { threshold: 0.1 },
          );
          observer.observe(item);
        }
      });
    };

    section.addEventListener("heading-done", reveal, { once: true });

    return () => section.removeEventListener("heading-done", reveal);
  }, []);

  return sectionRef;
}
