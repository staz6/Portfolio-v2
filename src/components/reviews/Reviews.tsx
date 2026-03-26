import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ReviewsHeading } from "./ReviewsHeading";
import { ReviewCard } from "./ReviewCard";
import { useReviewsAnimations } from "./useReviewsAnimations";
import type { ReviewProps } from "@/sanity/lib/mappers";

/* ── GSAP official horizontalLoop helper ── */
function horizontalLoop(items: HTMLElement[], config: any = {}) {
  const tl = gsap.timeline({
    repeat: config.repeat,
    paused: config.paused,
    defaults: { ease: "none" },
    onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
  });
  const length = items.length;
  const startX = items[0].offsetLeft;
  const times: number[] = [];
  const widths: number[] = [];
  const xPercents: number[] = [];
  const pixelsPerSecond = (config.speed || 1) * 100;
  const snap = config.snap === false ? (v: number) => v : gsap.utils.snap(config.snap || 1);

  gsap.set(items, {
    xPercent: (i: number, el: HTMLElement) => {
      const w = (widths[i] = parseFloat(String(gsap.getProperty(el, "width", "px"))));
      xPercents[i] = snap(
        (parseFloat(String(gsap.getProperty(el, "x", "px"))) / w) * 100 +
          Number(gsap.getProperty(el, "xPercent")),
      );
      return xPercents[i];
    },
  });

  gsap.set(items, { x: 0 });

  const totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth * Number(gsap.getProperty(items[length - 1], "scaleX")) +
    (parseFloat(config.paddingRight) || 0);

  for (let i = 0; i < length; i++) {
    const item = items[i];
    const curX = (xPercents[i] / 100) * widths[i];
    const distanceToStart = item.offsetLeft + curX - startX;
    const distanceToLoop = distanceToStart + widths[i] * Number(gsap.getProperty(item, "scaleX"));

    tl.to(item, {
      xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
      duration: distanceToLoop / pixelsPerSecond,
    }, 0)
      .fromTo(item, {
        xPercent: snap(((curX - distanceToLoop + totalWidth) / widths[i]) * 100),
      }, {
        xPercent: xPercents[i],
        duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
        immediateRender: false,
      }, distanceToLoop / pixelsPerSecond)
      .add("label" + i, distanceToStart / pixelsPerSecond);

    times[i] = distanceToStart / pixelsPerSecond;
  }

  tl.progress(1, true).progress(0, true);
  if (config.reversed) {
    tl.vars.onReverseComplete?.();
    tl.reverse();
  }

  return tl;
}

interface ReviewsComponentProps {
  reviews?: ReviewProps[];
}

export function Reviews({ reviews = [] }: ReviewsComponentProps) {
  const sectionRef = useReviewsAnimations();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !reviews.length) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-review-slide]", track);
    if (!items.length) return;

    const loop = horizontalLoop(items, {
      speed: 0.5,
      repeat: -1,
      paddingRight: 24,
      snap: false,
    });

    // Hover pause/resume
    let tween: gsap.core.Tween;
    const onEnter = () => {
      tween?.kill();
      tween = gsap.to(loop, { timeScale: 0, duration: 0.5, ease: "power2.out" });
    };
    const onLeave = () => {
      tween?.kill();
      tween = gsap.to(loop, { timeScale: 1, duration: 0.5, ease: "power2.in" });
    };

    // Pointer drag
    let dragging = false;
    let startX = 0;
    let startProgress = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startProgress = loop.progress();
      loop.pause();
      track.setPointerCapture(e.pointerId);
      track.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const delta = (e.clientX - startX) / track.offsetWidth;
      loop.progress(startProgress - delta * 0.5);
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      loop.play();
      track.style.cursor = "grab";
    };

    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);
    track.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      loop.kill();
      tween?.kill();
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
      track.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [reviews]);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative overflow-hidden bg-background"
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-1/4 -right-1/4 h-[60%] w-[60%] rounded-full bg-primary/[0.06] blur-[60px] lg:blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-[50%] w-[50%] rounded-full bg-primary/[0.04] blur-[50px] lg:blur-[100px]" />

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-40">
        <ReviewsHeading />
      </div>

      {/* Background quote marquee */}
      <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none">
        <div className="marquee-fade w-full">
          <div className="marquee-track flex w-max" style={{ animationDuration: "60s" }}>
            <span className="shrink-0 font-heading text-[8rem] font-black uppercase tracking-tight text-foreground/[0.03] md:text-[12rem] lg:text-[20rem]">
              {"\u201C"} WORDS MATTER {"\u201D"} TRUST {"\u201C"} RESULTS {"\u201D"}&nbsp;
            </span>
            <span className="shrink-0 font-heading text-[8rem] font-black uppercase tracking-tight text-foreground/[0.03] md:text-[12rem] lg:text-[20rem]">
              {"\u201C"} WORDS MATTER {"\u201D"} TRUST {"\u201C"} RESULTS {"\u201D"}&nbsp;
            </span>
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div data-reviews-content className="relative z-10 pb-24 lg:pb-40">
        <div
          ref={trackRef}
          className="flex cursor-grab gap-6 py-2 select-none"
        >
          {reviews.map((review, i) => (
            <div key={i} data-review-slide className="shrink-0">
              <ReviewCard review={review} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
