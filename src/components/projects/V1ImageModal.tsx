import { useEffect, useRef } from "react";
import gsap from "gsap";
import { PROJECTS } from "./projectsData";

interface V1ImageModalProps {
  activeIndex: number | null;
}

export function V1ImageModal({ activeIndex }: V1ImageModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cursorXTo = useRef<gsap.QuickToFunc | null>(null);
  const cursorYTo = useRef<gsap.QuickToFunc | null>(null);

  // Set up quickTo cursor followers
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    cursorXTo.current = gsap.quickTo(modal, "left", {
      duration: 0.8,
      ease: "power3.out",
    });
    cursorYTo.current = gsap.quickTo(modal, "top", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handleMouseMove = (e: MouseEvent) => {
      cursorXTo.current?.(e.clientX);
      cursorYTo.current?.(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scale in/out based on active state
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (activeIndex !== null) {
      gsap.set(modal, { visibility: "visible" });
      gsap.to(modal, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    } else {
      gsap.to(modal, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => gsap.set(modal, { visibility: "hidden" }),
      });
    }
  }, [activeIndex]);

  // Shift image strip to show correct image
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || activeIndex === null) return;

    gsap.to(strip, {
      y: `${-activeIndex * 100}%`,
      duration: 0.5,
      ease: "power3.out",
    });
  }, [activeIndex]);

  return (
    <div
      ref={modalRef}
      className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-1/2"
      style={{
        width: "25vw",
        height: "18vw",
        minWidth: "300px",
        minHeight: "220px",
        maxWidth: "450px",
        maxHeight: "340px",
        scale: 0,
        opacity: 0,
        visibility: "hidden",
      }}
    >
      <div className="h-full w-full overflow-hidden rounded-xl">
        <div
          ref={stripRef}
          className="relative h-full w-full"
          style={{ willChange: "transform" }}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.slug.current}
              className="absolute left-0 w-full h-full"
              style={{ top: `${i * 100}%` }}
            >
              <img
                src={project.thumbnail}
                alt={project.name}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
