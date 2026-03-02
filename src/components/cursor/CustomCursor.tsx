import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, []);

  useEffect(() => {
    if (isTouch || !cursorRef.current) return;

    const cursor = cursorRef.current;
    const mouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      gsap.to(cursor, {
        x: mouse.x,
        y: mouse.y,
        duration: 0.15,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Scale up on interactive elements
    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-cursor-scale]") ||
        target.closest("a") ||
        target.closest("button")
      ) {
        gsap.to(cursor, {
          scale: 3.5,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-cursor-scale]") ||
        target.closest("a") ||
        target.closest("button")
      ) {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      gsap.killTweensOf(cursor);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[99999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
      style={{ mixBlendMode: "difference" }}
    />
  );
}
