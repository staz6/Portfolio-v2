import { useEffect } from "react";
import gsap from "gsap";
import { AboutLayout } from "./AboutLayout";
import { AboutDescription } from "./AboutDescription";
import { AboutHighlights } from "./AboutHighlights";
import { useAboutAnimations } from "./useAboutAnimations";

interface AboutProps {
  description?: any[] | null;
  highlights?: { text: string }[];
}

export function About({ description, highlights }: AboutProps) {
  const sectionRef = useAboutAnimations();

  // Continuous breathing animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens: gsap.core.Tween[] = [];

    // Pills: gentle floating
    section.querySelectorAll("[data-about-pill]").forEach((pill, i) => {
      tweens.push(
        gsap.to(pill, {
          y: -6, duration: 2 + i * 0.3, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: i * 0.2,
        }),
      );
    });

    // Divider: subtle width pulse
    const divider = section.querySelector("[data-about-divider]");
    if (divider) {
      tweens.push(
        gsap.to(divider, {
          scaleX: 0.95, duration: 3, ease: "sine.inOut",
          repeat: -1, yoyo: true, transformOrigin: "left",
        }),
      );
    }

    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <AboutLayout sectionRef={sectionRef}>
      <div className="flex flex-col gap-5">
        <AboutDescription description={description} />
        <div data-about-divider className="h-px w-full bg-border" />
        <AboutHighlights highlights={highlights} />
      </div>
    </AboutLayout>
  );
}
