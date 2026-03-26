import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHeadingAnimation, REDUCED_MOTION } from "@/hooks/useHeadingAnimation";

export function useProjectsAnimations() {
  const sectionRef = useRef<HTMLElement>(null);

  useHeadingAnimation(sectionRef, { prefix: "projects", charStagger: 0.1 });

  // ── Cards entrance via IO — each card observed individually ──
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || REDUCED_MOTION()) return;

    const items = section.querySelectorAll("[data-project-item]");
    if (!items.length) return;

    gsap.set(items, { y: 80, opacity: 0, scale: 0.95 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            gsap.to(entry.target, {
              y: 0, opacity: 1, scale: 1, duration: 0.8,
              ease: "power3.out",
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return sectionRef;
}
