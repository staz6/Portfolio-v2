import type { ReactNode, RefObject } from "react";
import { AboutHeading } from "./AboutHeading";
import { AboutScene } from "./AboutScene";

interface AboutLayoutProps {
  sectionRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  contentGap?: string;
  scene?: ReactNode;
}

/**
 * Shared section shell for all About variants.
 * Renders: noise overlay, glow blobs, heading, 3D scene (left), and a slot for right-side content.
 */
export function AboutLayout({ sectionRef, children, contentGap = "lg:gap-20", scene }: AboutLayoutProps) {
  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-grid relative overflow-hidden bg-background py-24 lg:py-40"
    >
      {/* Radial glow blobs */}
      <div className="pointer-events-none absolute -top-1/4 -left-1/4 h-[60%] w-[60%] rounded-full bg-primary/[0.06] blur-[120px]" />
      <div className="pointer-events-none absolute -right-1/4 -bottom-1/4 h-[50%] w-[50%] rounded-full bg-primary/[0.04] blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <AboutHeading />

        <div className={`mt-14 grid grid-cols-1 items-center gap-10 lg:mt-20 lg:grid-cols-2 ${contentGap}`}>
          {/* Left — 3D sphere */}
          <div className="relative mx-auto aspect-square w-full max-w-sm lg:mx-0 lg:max-w-none">
            {scene ?? <AboutScene />}
          </div>

          {/* Right — variant content */}
          {children}
        </div>
      </div>
    </section>
  );
}
