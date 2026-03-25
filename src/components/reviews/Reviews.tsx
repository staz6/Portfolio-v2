import { useEffect, useRef } from "react";
import { ReviewsHeading } from "./ReviewsHeading";
import { ReviewCard } from "./ReviewCard";
import { useReviewsAnimations } from "./useReviewsAnimations";
import type { ReviewProps } from "@/sanity/lib/mappers";

interface ReviewsComponentProps {
  reviews?: ReviewProps[];
}

export function Reviews({ reviews = [] }: ReviewsComponentProps) {
  const sectionRef = useReviewsAnimations();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll + manual drag/swipe
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let speed = 0.5; // px per frame
    let rafId: number;
    let isPaused = false;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Auto-scroll loop
    function tick() {
      if (!isPaused && !isDragging && container) {
        container.scrollLeft += speed;
        // Loop: when we've scrolled past the first set, jump back
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        }
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    // Pause on touch
    const onTouchStart = (e: TouchEvent) => {
      isPaused = true;
      isDragging = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      container.scrollLeft = scrollLeft - (x - startX);
    };
    const onTouchEnd = () => {
      isDragging = false;
      // Resume auto-scroll after 2s
      setTimeout(() => { isPaused = false; }, 2000);
    };

    // Pause on mouse hover (desktop)
    const onMouseEnter = () => { isPaused = true; };
    const onMouseLeave = () => { isPaused = false; isDragging = false; };

    // Mouse drag (desktop)
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      container.scrollLeft = scrollLeft - (x - startX);
    };
    const onMouseUp = () => {
      isDragging = false;
      container.style.cursor = "grab";
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);
    container.addEventListener("mouseenter", onMouseEnter);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseup", onMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("mouseenter", onMouseEnter);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative bg-background"
    >
      {/* Glow blobs — wrapped to prevent horizontal overflow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 h-[60%] w-[60%] rounded-full bg-primary/[0.06] blur-[60px] lg:blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[50%] w-[50%] rounded-full bg-primary/[0.04] blur-[50px] lg:blur-[100px]" />
      </div>

      {/* Heading */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-40">
        <ReviewsHeading />
      </div>

      {/* Background quote marquee — hidden on mobile */}
      <div className="pointer-events-none absolute inset-0 hidden items-center overflow-hidden select-none lg:flex">
        <div className="marquee-fade w-full">
          <div
            className="marquee-track flex w-max"
            style={{ animationDuration: "60s" }}
          >
            <span className="shrink-0 font-heading text-[8rem] font-black uppercase tracking-tight text-foreground/[0.03] md:text-[12rem] lg:text-[20rem]">
              {"\u201C"} WORDS MATTER {"\u201D"} TRUST {"\u201C"} RESULTS {"\u201D"}&nbsp;
            </span>
            <span className="shrink-0 font-heading text-[8rem] font-black uppercase tracking-tight text-foreground/[0.03] md:text-[12rem] lg:text-[20rem]">
              {"\u201C"} WORDS MATTER {"\u201D"} TRUST {"\u201C"} RESULTS {"\u201D"}&nbsp;
            </span>
          </div>
        </div>
      </div>

      {/* Review cards — auto-scrolling + manually swipeable */}
      <div
        data-reviews-content
        className="relative z-10 pb-24 lg:pb-40"
      >
        <div
          ref={scrollRef}
          className="flex cursor-grab gap-6 overflow-x-auto py-2 pl-6 scrollbar-hide select-none"
        >
          {/* Two sets for seamless infinite loop */}
          {[0, 1].map((set) =>
            reviews.map((review, i) => (
              <ReviewCard key={`r${set}-${i}`} review={review} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
