import { useEffect } from "react";
import gsap from "gsap";
import { AboutLayout } from "./AboutLayout";
import { AboutDescription } from "./AboutDescription";
import { AboutHighlights } from "./AboutHighlights";
import { useAboutAnimations } from "./useAboutAnimations";
import { createAboutScene } from "./createAboutScene";
import { AboutSphereV4 } from "./AboutSphereV4";

const SceneV4 = createAboutScene(AboutSphereV4);

export function AboutV4() {
  const sectionRef = useAboutAnimations((tl, section) => {
    tl.from(section.querySelectorAll("[data-about-line]"), {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.12,
    }, "-=0.8");
    tl.from(section.querySelector("[data-about-divider]"), {
      scaleX: 0, transformOrigin: "left", duration: 0.6,
    }, "-=0.3");
    tl.from(section.querySelectorAll("[data-about-pill]"), {
      y: 20, opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.08, ease: "back.out(1.7)",
    }, "-=0.3");
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tweens: gsap.core.Tween[] = [];
    section.querySelectorAll("[data-about-pill]").forEach((pill, i) => {
      tweens.push(
        gsap.to(pill, {
          y: -6, duration: 2 + i * 0.3, ease: "sine.inOut",
          repeat: -1, yoyo: true, delay: i * 0.2,
        }),
      );
    });
    return () => tweens.forEach((t) => t.kill());
  }, []);

  return (
    <AboutLayout sectionRef={sectionRef} scene={<SceneV4 />}>
      <div className="flex flex-col gap-8">
        <AboutDescription />
        <div data-about-divider className="h-px w-full bg-border" />
        <AboutHighlights />
      </div>
    </AboutLayout>
  );
}
