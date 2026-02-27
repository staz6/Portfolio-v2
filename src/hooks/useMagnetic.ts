import { useEffect, useRef } from "react";
import gsap from "gsap";

interface UseMagneticOptions {
  strength?: number;
  ease?: string;
  returnEase?: string;
  returnDuration?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLDivElement>(
  options: UseMagneticOptions = {},
) {
  const {
    strength = 0.35,
    ease = "power3.out",
    returnEase = "elastic.out(1, 0.3)",
    returnDuration = 0.7,
  } = options;

  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      gsap.to(el, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.3,
        ease,
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: returnDuration,
        ease: returnEase,
        overwrite: "auto",
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [strength, ease, returnEase, returnDuration]);

  return ref;
}
