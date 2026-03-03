import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const top = topRef.current;
    const bottom = bottomRef.current;
    const counter = counterRef.current;
    if (!top || !bottom || !counter) return;

    const tl = gsap.timeline();

    // 1. Count 0 → 100
    tl.to(counter, {
      innerText: 100,
      duration: 2,
      snap: { innerText: 1 },
      ease: "power2.inOut",
    });

    // 2. Pause at 100, then trigger hero entrance so it's
    //    ready behind the preloader before the curtains open
    tl.to({}, { duration: 0.4 });
    tl.call(() => {
      window.dispatchEvent(new Event("preloader-complete"));
    });

    // 3. Split reveal — top half up, bottom half down
    tl.to(top, {
      yPercent: -100,
      duration: 0.8,
      ease: "power4.inOut",
    });
    tl.to(
      bottom,
      {
        yPercent: 100,
        duration: 0.8,
        ease: "power4.inOut",
      },
      "<",
    );

    // 4. Cleanup
    tl.call(() => {
      document.body.style.overflow = "";
      setRemoved(true);
    });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (removed) return null;

  const textClasses =
    "font-heading text-[15vw] font-bold uppercase leading-none tracking-tighter text-primary select-none pointer-events-none";

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Top half */}
      <div
        ref={topRef}
        className="absolute inset-0 flex items-center justify-center bg-background"
        style={{ clipPath: "inset(0 0 50% 0)" }}
      >
        <span className={textClasses}>AAHAD</span>
      </div>

      {/* Bottom half */}
      <div
        ref={bottomRef}
        className="absolute inset-0 flex items-center justify-center bg-background"
        style={{ clipPath: "inset(50% 0 0 0)" }}
      >
        <span className={textClasses}>AAHAD</span>
      </div>

      {/* Percentage counter */}
      <div className="fixed right-8 bottom-8 z-[71] flex items-baseline gap-0.5">
        <span
          ref={counterRef}
          className="font-heading text-4xl font-bold text-primary md:text-5xl"
        >
          0
        </span>
        <span className="font-heading text-lg font-medium text-primary/40 md:text-xl">
          %
        </span>
      </div>
    </div>
  );
}
